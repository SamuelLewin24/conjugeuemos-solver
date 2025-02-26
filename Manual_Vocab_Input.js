(function() {
  // Function to standardize the question input by removing names and replacing them with ___
  function standardizePhrase(phrase) {
      const names = ["Angel", "Juan", "Carlitos", "Diego", "Damian", "Elena", "Gabriel", "Jorge", "Liliana", "Luis", "Luna", "Ana", "Mia", "Carolina", "Natalia", "Pablo", "Pedro"];
      const regex = new RegExp(`\\b(${names.join("|")})\\b`, "gi");
      return phrase.replace(regex, "___").replace(/\s+/g, " ").trim();
  }

  // Function to prompt the user for input
  function promptForInput(message) {
      return new Promise((resolve) => {
          const input = prompt(message);
          resolve(input);
      });
  }

  async function main() {
      let storedData = JSON.parse(localStorage.getItem("vocab") || "{}");

      while (true) {
          // Prompt for the phrase
          const phrase = await promptForInput("Enter a phrase (or type 'STOP' to quit):");

          if (phrase === "STOP") {
              console.log("Stopping the script.");
              break;
          }

          // Standardize the phrase
          const standardizedPhrase = standardizePhrase(phrase);

          // Prompt for the correct answer
          const correctAnswer = await promptForInput(`Enter the correct answer for the phrase "${phrase}":`);

          // Store both the full phrase and the standardized phrase
          storedData[phrase] = correctAnswer;
          storedData[standardizedPhrase] = correctAnswer;

          // Save to localStorage
          localStorage.setItem("vocab", JSON.stringify(storedData));

          console.log("Updated localStorage:", localStorage.getItem("vocab"));
      }
  }

  main().catch(console.error);
})();