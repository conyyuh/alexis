// Select elements
const startBtn = document.getElementById('start-btn');
const output = document.getElementById('output');

// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;

if (SpeechRecognition && SpeechSynthesisUtterance) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  const synth = window.speechSynthesis;

  // Start listening when button is clicked
  startBtn.addEventListener('click', () => {
    recognition.start();
    output.textContent = "Listening...";
  });

  // Function to speak the text
  function talk(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  }

  // Handle recognized speech
  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    output.textContent = `You said: ${command}`;
    runAssistant(command);
  };

  // Function to run the assistant based on the command
  function runAssistant(command) {
    if (command.includes('play')) {
      const song = command.replace('play', '').trim();
      talk(`Playing ${song}`);
      window.open(`https://www.youtube.com/results?search_query=${song}`, '_blank');
    } else if (command.includes('time')) {
      const time = new Date().toLocaleTimeString();
      talk(`Current time is ${time}`);
    } else if (command.includes('who the heck is')) {
      const person = command.replace('who the heck is', '').trim();
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${person}`)
        .then(response => response.json())
        .then(data => {
          const info = data.extract || "Sorry, I couldn't find information.";
          talk(info);
          output.textContent = info;
        })
        .catch(err => {
          talk("Sorry, I couldn't find any information.");
          console.error(err);
        });
    } else if (command.includes('date')) {
      talk("Sorry, I have a headache.");
    } else if (command.includes('are you single')) {
      talk("I am in a relationship with Wifi.");
    } else if (command.includes('joke')) {
      fetch('https://official-joke-api.appspot.com/random_joke')
        .then(response => response.json())
        .then(data => {
          const joke = `${data.setup} ${data.punchline}`;
          talk(joke);
          output.textContent = joke;
        })
        .catch(err => {
          talk("Sorry, I couldn't find a joke.");
          console.error(err);
        });
    } else {
      talk("Please say the command again.");
    }
  }

  recognition.onerror = (event) => {
    output.textContent = `Error: ${event.error}`;
  };
} else {
  output.textContent = "Sorry, your browser does not support Speech Recognition or Speech Synthesis.";
}
