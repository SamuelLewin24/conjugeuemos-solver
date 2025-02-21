import time
import json
import os
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import re  # Import regex for splitting answers

# Setup logging
LOG_FILE = "errors.log"
logging.basicConfig(filename=LOG_FILE, level=logging.ERROR, 
                    format="%(asctime)s - %(levelname)s - %(message)s")

# Dictionary acting as a database
translations = {}

# File to store translations
DB_FILE = "translations.json"

def load_translations():
    """Load translations from JSON file."""
    global translations
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r", encoding="utf-8") as f:
            translations = json.load(f)

def save_translations():
    """Save translations to JSON file."""
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(translations, f, ensure_ascii=False, indent=4)

def get_translation(spanish_phrase):
    """Retrieve translation from the dictionary."""
    return translations.get(spanish_phrase)

def update_translation(spanish, english):
    """Update the dictionary and save to file."""
    translations[spanish] = english
    save_translations()

def extract_first_answer(correct_answer):
    """
    Extracts only the first phrase from the correct answer.
    Handles cases where multiple answers are separated by commas or "or".
    """
    split_answers = re.split(r',| or ', correct_answer, maxsplit=1)  # Split at first comma or "or"
    return split_answers[0].strip() if split_answers else correct_answer.strip()

# Load existing translations
load_translations()

# Attach to an already open Chrome session
options = webdriver.ChromeOptions()
options.debugger_address = "127.0.0.1:9222"  # Connect to open Chrome

driver = webdriver.Chrome(options=options)  # Use existing browser session

try:
    time.sleep(1)  # Delay before starting

    # Locate the Spanish phrase based on the first screenshot
    try:
        spanish_phrase_elem = driver.find_element(By.ID, "question-input")
        spanish_phrase = spanish_phrase_elem.text.strip()
        print(f"Spanish phrase found: {spanish_phrase}")
    except Exception as e:
        logging.error("Could not find Spanish phrase. Error: %s", e)
        print("Could not find Spanish phrase. Exiting...")
        driver.quit()
        exit()

    time.sleep(1)  # Delay

    # Retrieve translation from the dictionary
    translation = get_translation(spanish_phrase)

    # Find input box
    input_box = driver.find_element(By.ID, "assignment-answer-input")
    input_box.click()
    time.sleep(1)  # Delay

    if translation:
        print(f"Translation found: {translation}")

        # Type the translation letter by letter
        for char in translation:
            input_box.send_keys(char)
            time.sleep(0.1)  # Mimic human typing

    else:
        print("Translation not found. Using 'a' to get correct answer.")

        # Type "a" and submit to trigger correct answer box
        input_box.send_keys("a")
        time.sleep(0.1)
        input_box.send_keys(Keys.RETURN)

        time.sleep(2)  # Wait for correct answer field to appear

        # Check for the correct answer box
        try:
            correct_answer_elem = driver.find_element(By.XPATH, "//span[@class='js-bubble coqui-test-bubble incorrect']/span")
            full_correct_answer = correct_answer_elem.text.strip()

            # Extract only the first answer
            correct_answer = extract_first_answer(full_correct_answer)
            print(f"Correct answer retrieved: {correct_answer} (from: {full_correct_answer})")

            # Store the translation for future use
            update_translation(spanish_phrase, correct_answer)
            print("Dictionary updated.")

        except Exception as e:
            logging.error("Could not retrieve correct answer after pressing 'a'. Error: %s", e)
            print("Could not retrieve correct answer. Exiting...")
            driver.quit()
            exit()

    time.sleep(1)  # Delay before submitting
    input_box.send_keys(Keys.RETURN)  # Submit

    # Wait for response
    time.sleep(2)

    # Check if the answer was incorrect
    try:
        correct_answer_elem = driver.find_element(By.XPATH, "//span[@class='js-bubble coqui-test-bubble incorrect']/span")
        full_correct_answer = correct_answer_elem.text.strip()

        # Extract only the first answer
        correct_answer = extract_first_answer(full_correct_answer)
        print(f"Incorrect answer detected. Correct answer: {correct_answer} (from: {full_correct_answer})")

        # Update dictionary and save to JSON
        update_translation(spanish_phrase, correct_answer)
        print("Dictionary updated.")

    except:
        print("No incorrect answer detected. Moving to the next phrase.")

    time.sleep(1)  # Delay before proceeding

except Exception as e:
    logging.error("Unexpected error: %s", e)
    print(f"Unexpected error: {e}. Exiting...")

finally:
    driver.quit()  # Ensure browser is closed
    print("Script exited.")