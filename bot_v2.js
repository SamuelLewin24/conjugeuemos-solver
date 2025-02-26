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