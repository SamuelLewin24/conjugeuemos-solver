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

            const lowerCaseQuestionInput = questionInput.toLowerCase();
            const lowerCaseStandardizedQuestion = standardizedQuestion.toLowerCase();

            if (storedData[lowerCaseQuestionInput]) {
                inputBox.value = storedData[lowerCaseQuestionInput];
                console.log("Found answer in DB for the full phrase. Setting input to the correct answer.");
            } else if (storedData[lowerCaseStandardizedQuestion]) {
                inputBox.value = storedData[lowerCaseStandardizedQuestion];
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

            storedData[newQuestionInput.toLowerCase()] = correctAnswer;
            storedData[newStandardizedQuestion.toLowerCase()] = correctAnswer;
            localStorage.setItem("vocab", JSON.stringify(storedData));

            console.log("Updated localStorage:", localStorage.getItem("vocab"));
        } catch (error) {
            console.error("An unexpected error occurred:", error);
        }
    }
})();