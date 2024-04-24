var f_b_popup = false
var feedback = document.getElementById("feedback");
var feedback_container =  document.getElementById("feedback_container");

feedback.addEventListener("click", function(){ 
  if(f_b_popup != false){
    feedback_container.style.display = "none";
      f_b_popup = false; 
  }
  else{
    feedback_container.style.display = "block";
      f_b_popup = true;
  }
});