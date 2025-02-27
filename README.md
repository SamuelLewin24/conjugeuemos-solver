# 🤖 Conjuguemos Bot
- A bot that automates your conjugeuemos

## 📝 This Bot:
* Does your spanish vocab for you
  - Thats really all it does

## ✅ How to use the bot:

(This bot is designed such that someone with 0 computer knowledge could use it)

1. Open Chrome
2. Open Conjugeuemos
3. Open desired assignment
4. type some random phrase into input feild and get the question inccorect 
  - (yes this is required)
5. Right click ---> inspect element ---> Console
6. Copy and paste the code from "bot_v3.js" into Console:
```
(async function() {
  const maxIterations = 200;

  // Function to standardize the question input by removing names and replacing them with ___
  function standardizePhrase(phrase) {
      const names = ["Angel", "Juan", "Carlitos", "Diego", "Damian", "Elena", "Gabriel", "Jorge", "Liliana", "Luis", "Luna", "Ana", "Mia", "Carolina", "Natalia", "Pablo", "Catalina", "Sofia", "Pedro"];
      const regex = new RegExp(`\\b(${names.join("|")})\\b`, "gi");
      return phrase.replace(regex, "___").replace(/\s+/g, " ").trim();
  }

  for (let i = 0; i < maxIterations; i++) {
      try {
          function getQuestionInput() {
              const query = document.querySelector("#question-input");
              const pronounInput = document.querySelector("#pronoun-input");
              const verbInput = document.querySelector("#verb-input");

              if (query) {
                  return query.textContent.trim();
              } else if (pronounInput && verbInput) {
                  return `${pronounInput.textContent.trim()} ${verbInput.textContent.trim()}`;
              } else {
                  return null;
              }
          }

          let questionInput = getQuestionInput();
          if (!questionInput) {
              console.error("Question input not found.");
              continue; 
          }

          let standardizedQuestion;
          if (document.querySelector("#pronoun-input") && document.querySelector("#verb-input")) {
              // Standardize the question input by removing names if it involves pronoun and verb input
              standardizedQuestion = standardizePhrase(questionInput);
          } else {
              // Use the whole phrase as it is if it only uses the query input
              standardizedQuestion = questionInput;
          }

          console.log(`Current question: ${standardizedQuestion}`);

          let storedData = JSON.parse(localStorage.getItem("vocab") || "{}");

          const inputBox = document.querySelector("#assignment-answer-input");
          if (!inputBox) {
              console.error("Input box not found.");
              continue; 
          }

          if (storedData[questionInput]) {
              inputBox.value = storedData[questionInput];
              console.log("Found answer in DB for the full phrase. Setting input to the correct answer.");
          } else if (storedData[standardizedQuestion]) {
              inputBox.value = storedData[standardizedQuestion];
              console.log("Found answer in DB for the standardized phrase. Setting input to the correct answer.");
          } else {
              inputBox.value = "idk";
              console.log("Answer not found in DB. Setting input to 'idk'.");
          }

          await new Promise(resolve => document.addEventListener("click", resolve, { once: true }));

          await new Promise(resolve => setTimeout(resolve, 500));

          let newQuestionInput = getQuestionInput();
          if (!newQuestionInput) {
              console.error("New question input not found.");
              continue;
          }

          let newStandardizedQuestion;
          if (document.querySelector("#pronoun-input") && document.querySelector("#verb-input")) {
              // Standardize the new question input by removing names if it involves pronoun and verb input
              newStandardizedQuestion = standardizePhrase(newQuestionInput);
          } else {
              // Use the whole phrase as it is if it only uses the query input
              newStandardizedQuestion = newQuestionInput;
          }

          console.log(`New question: ${newStandardizedQuestion}`);

          const newIncorrectBox = document.querySelector(".js-bubble.coqui-test-bubble.incorrect");
          if (!newIncorrectBox || getComputedStyle(newIncorrectBox).display !== "block") {
              console.log("No incorrect box found or it is not displayed. Assuming the answer was correct.");
              continue; 
          }

          let correctAnswer;
          try {
              correctAnswer = newIncorrectBox.querySelector("span").textContent.trim();
              console.log(`Correct answer found: ${correctAnswer}`);
          } catch (error) {
              console.error("Error finding the correct answer in the incorrect box:", error);
              continue;
          }

          storedData[newQuestionInput] = correctAnswer;
          storedData[newStandardizedQuestion] = correctAnswer;
          localStorage.setItem("vocab", JSON.stringify(storedData));

          console.log("Updated localStorage:", localStorage.getItem("vocab"));
      } catch (error) {
          console.error("An unexpected error occurred:", error);
      }
  }
})();
```
7. Run code
8. Repeatedly click on the check answer button when the input feild is filled

## ✏️ Manually write Vocab and answers to localStorage
1. Open Chrome
2. Open Conjugeuemos (you dont necessarily need to be on an assignment)
3. Right click ---> inspect element ---> Console
4. Paste the code from "Manual_Vocab_Input.js" into the console
```
(function() {
  // Standardizes names and replaces with "___"
  function standardizePhrase(phrase) {
      const names = ["Angel", "Juan", "Carlitos", "Diego", "Damian", "Elena", "Gabriel", "Jorge", "Liliana", "Luis", "Luna", "Ana", "Mia", "Carolina", "Natalia", "Pablo", "Pedro"];
      const regex = new RegExp(`\\b(${names.join("|")})\\b`, "gi");
      return phrase.replace(regex, "___").replace(/\s+/g, " ").trim();
  }

  function promptForInput(message) {
      return new Promise((resolve) => {
          const input = prompt(message);
          resolve(input);
      });
  }

  async function main() {
      let storedData = JSON.parse(localStorage.getItem("vocab") || "{}");

      while (true) {
          const phrase = await promptForInput("Enter a phrase (or type 'STOP' to quit):");

          if (phrase === "STOP") {
              console.log("Stopping the script.");
              break;
          }

          const standardizedPhrase = standardizePhrase(phrase);

          const correctAnswer = await promptForInput(`Enter the correct answer for the phrase "${phrase}":`);

          storedData[phrase] = correctAnswer;
          storedData[standardizedPhrase] = correctAnswer;

          localStorage.setItem("vocab", JSON.stringify(storedData));

          console.log("Updated localStorage:", localStorage.getItem("vocab"));
      }
  }

  main().catch(console.error);
})();
```
5. Type in vocab phrase, followed by correct translation to said vocab phrase
6. Repeat untill finished inputing vocab phrases
7. Type "STOP" in all caps into the vocab phrase input feild to stop

## 📝 Things to Note:
* The bot waits a little bit before filling the input feild
  - this is to avoid conjugeuemos saying you finished the questions instantly
* The bot will input "idk" if it doesn't have the answer saved in website storage
  - just continue to click through if this happends, it will record the correct answer for next time
* The code sucks but I'm not fixing it

## ⚠️ Troubleshooting:

### ❌ Bot Doesn't Work
- Do the assignment manually you lazy cheater
