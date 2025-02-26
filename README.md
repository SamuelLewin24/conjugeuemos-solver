# Conjuguemos Bot
- A bot that automates your conjugeuemos

## This Bot:
* Does your spanish vocab for you
* Thats really all it does

## How to use the bot:

(This bot is designed such that someone with 0 computer knowledge could use it)

1. Open Chrome
2. Open Conjugeuemos
3. Open desired assignment
4. type some random phrase into input feild and get the question inccorect 
(yes this is required)
5. Right click ---> inspect element ---> Console
6. Copy and paste the following code into Console:
```
(async function() {
    const maxIterations = 200;

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
            console.log(`Current question: ${questionInput}`);

            let storedData = JSON.parse(localStorage.getItem("vocab") || "{}");

            const inputBox = document.querySelector("#assignment-answer-input");
            if (!inputBox) {
                console.error("Input box not found.");
                continue; 
            }

            if (storedData[questionInput]) {
                inputBox.value = storedData[questionInput];
                console.log("Found answer in DB. Setting input to the correct answer.");
            } else {
                inputBox.value = "idk";
                console.log("Answer not found in DB. Setting input to 'idk'.");
            }

            await new Promise(resolve => document.addEventListener("click", resolve, { once: true }));

            await new Promise(resolve => setTimeout(resolve, 2000));

            let newQuestionInput = getQuestionInput();
            if (!newQuestionInput) {
                console.error("New question input not found.");
                continue;
            }
            console.log(`New question: ${newQuestionInput}`);

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

## Things to Note:
* The bot waits 2 seconds before filling the input feild
  - this is to avoid conjugeuemos saying you finished the questions instantly
* The bot will input "idk" if it doesn't have the answer saved in website storage
  - just continue to click through if this happends, it will record the correct answer for next time
* The code sucks but im not fixing it

## Troubleshooting

### Bot Doesn't Work:
- Do the assignment manually you lazy cheater
