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


var specialistDegrees = [
"Doctor (MBBS)",
"Dentist (BDS/MDS)",
"Medical Stores",
"Veterinary (VMD)",
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
