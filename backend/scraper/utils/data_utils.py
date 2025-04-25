import csv
import json
import os
from typing import List, Set
from models.visa_info import VisaInfo


def is_duplicate_visa_info(country: str, visa_type: str, seen_entries: Set[tuple]) -> bool:
    """
    Check if a visa entry already exists in the seen_entries set.
    
    Args:
        country: The country name
        visa_type: The type of visa
        seen_entries: Set of tuples containing (country, visa_type)
        
    Returns:
        bool: True if the entry is a duplicate, False otherwise
    """
    return (country, visa_type) in seen_entries


def is_complete_visa_info(visa_info: dict, required_keys: List[str]) -> bool:
    """
    Check if a visa information entry has all required fields.
    
    Args:
        visa_info: Dictionary containing visa information
        required_keys: List of required keys
        
    Returns:
        bool: True if the entry is complete, False otherwise
    """
    return all(key in visa_info and visa_info[key] for key in required_keys)


def save_visa_info_to_csv(visa_info_list: List[dict], filename: str) -> None:
    """
    Save visa information to a CSV file.
    
    Args:
        visa_info_list: List of visa information dictionaries
        filename: Name of the CSV file to save to
    """
    if not visa_info_list:
        print("No visa information to save.")
        return

    # Make sure output directory exists
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    # Get all fields from the data
    all_fields = set()
    for entry in visa_info_list:
        all_fields.update(entry.keys())
    
    # Use dynamic fieldnames instead of model fields
    fieldnames = list(all_fields)

    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(visa_info_list)
    
    print(f"Saved {len(visa_info_list)} visa entries to '{filename}'.")


def save_visa_info_to_json(visa_info_list: List[dict], filename: str) -> None:
    """
    Save visa information to a JSON file.
    
    Args:
        visa_info_list: List of visa information dictionaries
        filename: Name of the JSON file to save to
    """
    if not visa_info_list:
        print("No visa information to save.")
        return

    # Make sure output directory exists
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    with open(filename, "w", encoding="utf-8") as file:
        json.dump(visa_info_list, file, indent=2, ensure_ascii=False)
    print(f"Saved {len(visa_info_list)} visa entries to '{filename}'.")