var popup = false

function precision() {
  var rule1 = document.getElementById("rule1");
  var precision = document.getElementById("precision");

  rule1.addEventListener("mouseover", function () {
    precision.style.display = "block";
    precision.innerHTML = "Accurate and consistent of any assessments.";
  });

  rule1.addEventListener("mouseout", function () {
    precision.style.display = "none";
  });
}

function ethics() {
  var rule2 = document.getElementById("rule2");
  var ethics = document.getElementById("ethics");

  rule2.addEventListener("mouseover", function () {
    ethics.style.display = "block";
    ethics.innerHTML =
      "Guiding principles for ethical decision-making in any emergency";
  });

  rule2.addEventListener("mouseout", function () {
    ethics.style.display = "none";
  });
}

function safety() {
  var rule3 = document.getElementById("rule3");
  var safety = document.getElementById("safety");

  rule3.addEventListener("mouseover", function () {
    safety.style.display = "block";
    safety.innerHTML =
      "Preventing harm and ensuring people well-being in any practices.";
  });

  rule3.addEventListener("mouseout", function () {
    safety.style.display = "none";
  });
}


document.addEventListener('DOMContentLoaded', function() {
  var video = document.getElementById('myVideo');
  
  
  video.playbackRate = 0.8; 

  // Play the video
  video.play();
});


var emergency = document.getElementById("emergency_button");
var contacts = document.getElementById("emergency");

emergency.addEventListener("click", function(){ 
    if(popup != false){
        contacts.style.display = "none";
        popup = false; 
    }
    else{
        contacts.style.display = "block";
        popup = true;
    }
});