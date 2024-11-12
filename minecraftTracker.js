// minecraftTracker.js
// Get DOM elements
const homeBtn = document.getElementById('home-btn');
const questionsBtn = document.getElementById('questions-btn');
const archivesBtn = document.getElementById('archives-btn');
const mainContent = document.getElementById('main-content');

// Initialize score and answers in localStorage
if (!localStorage.score) {
  localStorage.score = 0;
}
if (!localStorage.answers) {
  localStorage.answers = JSON.stringify({});
}

// Function to render home screen
function renderHome() {
  mainContent.innerHTML = `
        <h2>Score: ${localStorage.score}</h2>
    `;
  setActiveButton('home-btn');
}

// Function to render questions screen
const questions = [
  { question: 'What is your plan for today\'s Minecraft build?', points: 30 },
  { question: 'Did you play Minecraft today?', points: 20 },
  {
    question: '',
    points: 50,
    conditional: true,
    yesQuestion: 'What did you build in Minecraft today?',
    noQuestion: 'What do you plan to build in Minecraft tomorrow?'
  }
];

// Function to render questions screen
let currentQuestion = 0;

function renderQuestions() {
  const date = new Date().toISOString().split('T')[0];
  const answers = JSON.parse(localStorage.answers);
  if (answers[date] && Object.keys(answers[date]).length === questions.length) {
    mainContent.innerHTML = `
            <h2>You've already answered all questions for today!</h2>
            <p>Check back tomorrow for new questions.</p>
        `;
    return;
  }

  const question = questions[currentQuestion];
  let questionText = question.question;

  // Conditional question logic
  if (question.conditional && currentQuestion === 2) {
    const previousAnswer = answers[date][questions[1].question];
    questionText = (previousAnswer.toLowerCase() === 'yes') ? question.yesQuestion : question.noQuestion;
  }

  mainContent.innerHTML = `
        <h2>${questionText}</h2>
        <input id="answer" type="text">
        <button id="submit-answer">Submit</button>
    `;

  document.getElementById('submit-answer').addEventListener('click', () => {
    const answer = document.getElementById('answer').value;
    if (!answers[date]) {
      answers[date] = {};
    }
    answers[date][questionText] = answer;
    localStorage.answers = JSON.stringify(answers);
    localStorage.score = parseInt(localStorage.score) + question.points;

    // Redirect to home screen after submitting each answer
    renderHome();

    // Increment currentQuestion for next question
    currentQuestion++;
  });
  setActiveButton('questions-btn');
}

// Function to render archives screen
function renderArchives() {
  const answers = JSON.parse(localStorage.answers);
  const archiveHtml = Object.keys(answers).map(date => `
        <h3>${date}</h3>
        <ul>
            ${Object.keys(answers[date]).map(question => `
                <li><strong>${question}:</strong> ${answers[date][question]}</li>
            `).join('')}
        </ul>
    `).join('');
  mainContent.innerHTML = archiveHtml;
  setActiveButton('archives-btn');
}

// Function to set active button in the footer.
function setActiveButton(id) {
  const buttons = document.querySelectorAll('footer button');
  buttons.forEach(button => button.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Add event listeners to buttons
homeBtn.addEventListener('click', renderHome);
questionsBtn.addEventListener('click', () => {
  const date = new Date().toISOString().split('T')[0];
  const answers = JSON.parse(localStorage.answers);
  if (answers[date] && Object.keys(answers[date]).length === questions.length) {
    mainContent.innerHTML = `
            <h2>You've already answered all questions for today!</h2>
            <p>Check back tomorrow for new questions.</p>
        `;
  } else {
    currentQuestion = Object.keys(answers[date] || {}).length; // Start from next unanswered question
    renderQuestions();
  }
  setActiveButton('questions-btn');
});
archivesBtn.addEventListener('click', renderArchives);

// Buy button event listener
document.getElementById('buy-btn').addEventListener('click', (e) => {
  document.getElementById('buy-popup').style.display = 'block';
  e.stopPropagation(); // Prevent global click event from closing popup
});

// Inspire button event listener
document.getElementById('inspire-btn').addEventListener('click', (e) => {
  document.getElementById('inspire-popup').style.display = 'block';
  e.stopPropagation(); // Prevent global click event from closing popup
});

// Collect button event listener
document.getElementById('collect-btn').addEventListener('click', (e) => {
  document.getElementById('collect-popup').style.display = 'block';
  e.stopPropagation(); // Prevent global click event from closing popup
});

document.getElementById('conversation-btn').addEventListener('click', (e) => {
  document.getElementById('conversation-popup').style.display = 'block';
  e.stopPropagation();
});

let conversationStep = 0;
document.getElementById('conversation-popup').addEventListener('click', (e) => {
  conversationStep++;
  const conversationText = document.getElementById('conversation-text');
  
  switch (conversationStep) {
    case 1:
      conversationText.textContent = 'First, explore the new Minecraft world around you.';
      break;
    case 2:
      conversationText.textContent = 'Come back for more ideas later.';
      break;
    default:
      // Allow closing popup after 3rd message
      document.getElementById('conversation-popup').style.display = 'none';
      conversationStep = 0; // Reset for next conversation
  }
  e.stopPropagation(); // Prevent global click event from closing popup.
});

// Tap on an image for a different outcome.
document.addEventListener('click', (e) => {
  if (e.target.closest('img')) {
    alert("tapped an image!");
    e.stopPropagation(); // Prevent global click event from closing popup.
  }
});

// Global click event listener to close popups when tapped.
document.addEventListener('click', (e) => {
  const popups = document.querySelectorAll('.overlay-popup');
  popups.forEach((popup) => {
    if (popup.style.display === 'block' && !e.target.closest('.fixed-buttons') && !e.target.closest('img')) {
      popup.style.display = 'none';
    }
  });
});

// Render home screen by default
renderHome();
