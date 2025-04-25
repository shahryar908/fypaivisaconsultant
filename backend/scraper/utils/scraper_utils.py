import json
import os
from typing import List, Set, Tuple

from crawl4ai import (
    AsyncWebCrawler,
    BrowserConfig,
    CacheMode,
    CrawlerRunConfig,
    LLMExtractionStrategy,
)

from models.visa_info import VisaInfo
from utils.data_utils import is_complete_visa_info, is_duplicate_visa_info


def get_browser_config() -> BrowserConfig:
    """
    Returns the browser configuration for the crawler.

    Returns:
        BrowserConfig: The configuration settings for the browser.
    """
    return BrowserConfig(
        browser_type="chromium",
        headless=True,  # Run in headless mode for server deployment
        verbose=True,
    )


def get_llm_strategy() -> LLMExtractionStrategy:
    """
    Returns the configuration for the language model extraction strategy.

    Returns:
        LLMExtractionStrategy: The settings for how to extract data using LLM.
    """
    return LLMExtractionStrategy(
        provider="groq/deepseek-r1-distill-llama-70b",
        api_token=os.getenv("GROQ_API_KEY"),
        schema=VisaInfo.model_json_schema(),
        extraction_type="schema",
        instruction=(
            """Extract detailed visa information for each available visa type from the provided content. Structure the extracted information as separate objects if multiple visa types exist. Ensure each visa type includes the following details

Country: Name of the country for which the visa is issued.
Visa Type: The specific type of visa (e.g., Student Visa, Work Visa, Tourist Visa).
Requirements: A list of all required documents and conditions (e.g., passport, proof of funds, invitation letter, language proficiency, medical insurance).
Processing Time: The estimated time required to process the visa application.
Validity: The duration for which the visa remains valid after issuance.
Fees: The cost of the visa application in the respective currency.
Entry Type: Whether the visa is single-entry, multiple-entry, or transit.
Allowed Stay: The permitted duration a visa holder can stay in the country under this visa type.
Embassy Link (if available): The official website link of the embassy or consulate for further information.
Additional Notes: Any extra details about visa extensions, work permissions, or specific country-based rules."""


        ),
        input_format="markdown",
        verbose=True,
    )


async def fetch_and_process_country(
    crawler: AsyncWebCrawler,
    country: str,
    base_url: str,
    css_selector: str,
    llm_strategy: LLMExtractionStrategy,
    session_id: str,
    required_keys: List[str],
    seen_entries: Set[tuple],
    country_sources: dict = None,
) -> List[dict]:
    """
    Fetches and processes visa information for a specific country.

    Args:
        crawler: The web crawler instance
        country: The country to fetch visa information for
        base_url: The base URL of the website
        css_selector: The CSS selector to target the content
        llm_strategy: The LLM extraction strategy
        session_id: The session identifier
        required_keys: List of required keys in the visa information
        seen_entries: Set of entries that have already been seen
        country_sources: Optional dictionary of country-specific URLs

    Returns:
        List[dict]: A list of processed visa information entries
    """
    # Determine the URL to crawl
    if country_sources and country in country_sources:
        url = country_sources[country]
    else:
        url = f"{base_url}/{country}"

    print(f"Loading visa information for {country.upper()}...")

    # Fetch page content with the extraction strategy
    result = await crawler.arun(
        url=url,
        config=CrawlerRunConfig(
            cache_mode=CacheMode.BYPASS,
            extraction_strategy=llm_strategy,
            css_selector=css_selector,
            session_id=f"{session_id}_{country}",
        ),
    )

    if not (result.success and result.extracted_content):
        print(f"Error fetching visa information for {country}: {result.error_message}")
        return []

    # Parse extracted content
    try:
        extracted_data = json.loads(result.extracted_content)
    except json.JSONDecodeError:
        print(f"Error parsing JSON for {country}.")
        return []

    if not extracted_data:
        print(f"No visa information found for {country}.")
        return []

    # Process visa information
    complete_entries = []
    for entry in extracted_data:
        # Ensure the country field is set
        entry["country"] = country.replace("-", " ").title()

        # Convert requirements to a list if it's a string
        if isinstance(entry.get("requirements"), str):
            entry["requirements"] = [req.strip() for req in entry["requirements"].split(",")]

        if not is_complete_visa_info(entry, required_keys):
            print(f"Incomplete visa information for {country}, visa type: {entry.get('visa_type', 'Unknown')}")
            continue

        entry_key = (entry["country"], entry["visa_type"])
        if is_duplicate_visa_info(entry["country"], entry["visa_type"], seen_entries):
            print(f"Duplicate visa information for {country}, visa type: {entry['visa_type']}. Skipping.")
            continue

        # Add entry to the list
        seen_entries.add(entry_key)
        complete_entries.append(entry)

    print(f"Extracted {len(complete_entries)} visa entries for {country}.")
    return complete_entries