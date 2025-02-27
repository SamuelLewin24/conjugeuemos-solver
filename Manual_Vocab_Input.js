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

          console.log("Note: for any questions regarding names type the names as: ___ (3 underscores)")
          console.log("ex: Sofia y Juan ser ---> ___ y ___ ser (Do not replace yo, tu, ect, just names")
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