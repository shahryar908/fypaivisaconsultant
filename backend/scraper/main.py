import asyncio
import os
from typing import Set

from crawl4ai import AsyncWebCrawler
from dotenv import load_dotenv

from config import (
    BASE_URL,
    COUNTRIES_TO_CRAWL,
    COUNTRY_SOURCES,
    CSS_SELECTOR,
    REQUIRED_KEYS,
)
from utils.data_utils import save_visa_info_to_csv, save_visa_info_to_json
from utils.scraper_utils import (
    fetch_and_process_country,
    get_browser_config,
    get_llm_strategy,
)

load_dotenv()


async def crawl_visa_information():
    """
    Main function to crawl visa information for multiple countries.
    """
    # Initialize configurations
    browser_config = get_browser_config()
    llm_strategy = get_llm_strategy()
    session_id = "visa_info_crawl_session"

    # Initialize state variables
    all_visa_info = []
    seen_entries: Set[tuple] = set()

    # Create output directory if it doesn't exist
    os.makedirs("output", exist_ok=True)

    # Start the web crawler context
    async with AsyncWebCrawler(config=browser_config) as crawler:
        for country in COUNTRIES_TO_CRAWL:
            # Fetch and process visa information for the current country
            visa_entries = await fetch_and_process_country(
                crawler,
                country,
                BASE_URL,
                CSS_SELECTOR,
                llm_strategy,
                session_id,
                REQUIRED_KEYS,
                seen_entries,
                COUNTRY_SOURCES,
            )

            # Add the visa entries to the total list
            all_visa_info.extend(visa_entries)

            # Save country-specific data
            if visa_entries:
                save_visa_info_to_json(visa_entries, f"output/{country}_visa_info.json")

            # Pause between requests to be polite and avoid rate limits
            await asyncio.sleep(3)

    # Save all collected visa information to CSV and JSON files
    if all_visa_info:
        save_visa_info_to_csv(all_visa_info, "output/all_visa_info.csv")
        save_visa_info_to_json(all_visa_info, "output/all_visa_info.json")
        print(f"Saved {len(all_visa_info)} visa entries to output files.")
    else:
        print("No visa information was found during the crawl.")

    # Display usage statistics for the LLM strategy
    llm_strategy.show_usage()


async def main():
    """
    Entry point of the script.
    """
    await crawl_visa_information()


if __name__ == "__main__":
    asyncio.run(main())