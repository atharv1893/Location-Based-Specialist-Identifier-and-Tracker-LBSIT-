document.addEventListener('DOMContentLoaded', function() {
  var popupVisible = false;
// List of specialist degrees in the medical field
document.getElementById("complaint").addEventListener("click", toggle_complaint);
function toggle_complaint() {
  var popup_feedback = document.getElementById("complaint-box");
  var button_feedback = document.getElementById("complaint");
  popupVisible = !popupVisible;

  if (popupVisible) {
    popup_feedback.style.display = "block";
    button_feedback.textContent = "?";
  } else {
    popup_feedback.style.display = "none";
    button_feedback.textContent = "?";
  }
}
const searchBox = document.getElementById('searchBox');
const searchButton = document.getElementById('searchButton');
const cardContainer = document.getElementById('cardContainer');

var specialistDegrees = [
"Doctor (MBBS)",
"Dentist (BDS/MDS)",
"Medical Stores",
"Physiotherapist (BPT/MPT)",
"Cardiologist (DM Cardiology)",
"Dermatologist (MD Dermatology)",
"Psychiatrist (MD Psychiatry)",
"Pediatrician (MD Pediatrics)",
"Veterinary (VMD)",
"Gynecologist (Gynecology)",
"Orthopedic Surgeon (MS Orthopedics)",
"Ophthalmologist (MS Ophthalmology)",
"Garages",
"Fire Brigade",
"Police",
"Traffic Police",

];
function handleSearch() {
var searchBar1 = document.getElementById("searchBox");
var query = searchBar1.value.toLowerCase();
var autocompleteList = document.getElementById("autocompleteList");

// Clear previous autocomplete suggestions
autocompleteList.innerHTML = "";

// Filter specialist degrees that match the search query
var matches = specialistDegrees.filter(function(specialistDegree) {
return specialistDegree.toLowerCase().indexOf(query) !== -1;
});

// Display the matched specialist degrees as autocomplete suggestions
matches.forEach(function(match) {
var listItem = document.createElement("li");
listItem.textContent = match;
listItem.addEventListener("click", function() {
searchBar1.value = match;
autocompleteList.innerHTML = "";
});
autocompleteList.appendChild(listItem);
});
}

// Event listener to hide the autocomplete list when clicking outside the search field
document.addEventListener("click", function(event) {
var target = event.target;
var searchBar1 = document.getElementById("searchBox");
var autocompleteList = document.getElementById("autocompleteList");

if (target !== searchBar1 && target !== autocompleteList) {
autocompleteList.innerHTML = "";
}
});


// Attach event listener for search input changes
var searchBar2 = document.getElementById("searchBox");
searchBar2.addEventListener("input", handleSearch);


searchBox.addEventListener('input', searchCards);
searchButton.addEventListener('click', searchCards);

function searchCards() {
const query = searchBox.value.toLowerCase();
const cards = cardContainer.getElementsByClassName('card');
let matchingCardsCount = 0;

for (let i = 0; i < cards.length; i++) {
const card = cards[i];
const title = card.getElementsByTagName('h3')[0].textContent.toLowerCase();

if (title.includes(query)) {
card.style.display = 'block';
matchingCardsCount++;
} else {
card.style.display = 'none';
}
}

const message = cardContainer.querySelector('.search-message');
const requestform = cardContainer.querySelector('.requestform');
const pf = document.getElementById("profession-feedback");
const bf = document.getElementById("button-feedback");

if (matchingCardsCount === 0 && !message) {
const noCardsMessage = document.createElement('p');
noCardsMessage.classList.add('search-message');
noCardsMessage.textContent = 'Sorry, no Profession matched your search';
cardContainer.appendChild(noCardsMessage);
pf.style.display = "block";
bf.style.display = "block";
} else if (matchingCardsCount > 0 && message) {
cardContainer.removeChild(message);
pf.style.display = "none";
bf.style.display = "none";
} else if (matchingCardsCount === 0 && query === '') {
pf.style.display = "none";
bf.style.display = "none";
}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
// Create a new instance of SpeechRecognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

// Set the recognition language
recognition.lang = 'en-US';

// Get the search box element
const searchBox = document.getElementById('searchBox');

// Define the startButton click event handler
const speechButton = document.getElementById('speechButton');
speechButton.addEventListener('click', () => {
  recognition.start();
  speechButton.disabled = true;

  console.log("Listening..")
});


recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log(transcript)
  const resultElement = document.getElementById('result');
  const sanitizedTranscript = transcript.replace(/[.|,]/g, '').trim();
  searchBox.value = sanitizedTranscript;

};

// Define the recognition error event handler
recognition.onerror = (event) => {
  console.error('Speech recognition error:', event.error);
};

// Define the recognition end event handler
recognition.onend = () => {
  speechButton.disabled = false;         
 console.log("End") 
};
} else {
alert('Speech recognition is not supported in this browser.');
}





});
