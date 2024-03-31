document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector("button");
    button.addEventListener("click", ()=>{
    
    if(navigator.geolocation){ //if browser support geolocation api
        button.innerText = "Allow to detect location";
        // geolocation.getCurrentPosition method is used to get current position of the device
        // it takes three parameters success, error, options. If everything is right then success 
        // callback function will call else error callback function will call. We don't need third parameter for this project
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        button.innerText = "Your browser not support";
    }
    }); 
function onSuccess(position){
    button.innerText = "Detecting your location...";
    let {latitude, longitude} = position.coords; //getting latitude and longitude properties value from coords obj
    //sending get request to the api with passing latitude and longitude coordinates of the user position
      console.log(latitude,longitude)
   //nerul- 19.042263, 73.014517
   //thane - 19.267924,72.967252
   //change below terms also
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=fb87072a45394821904e16450b724c48`)
    //parsing json data into javascript object and returning it and in another then function receiving the object that is sent by the api
    .then(response => response.json()).then(response =>{
      console.log(response.results[0]);
        let allDetails = response.results[0].components; //passing components object to allDetails variable
        let {suburb,city, state} = allDetails; //getting country, postcode, country properties value from allDetails obj
     

        button.innerText = `${suburb},  ${city}`; //passing these value to the button innerText


     //   let city = ' ';
    //    const regionalAreas = {

    //        'Thane' : ['Kasarvadavali' , 'Manpada' , 'Majiwada' , 'Bhayander Pada'],
    //        'Navi Mumbai' : ['Nerul West' , 'Seawoods' , 'Panvel'],
    
      //          };
        //for (const [cityName , regionalAreasList] of Object.entries(regionalAreas)){
          //  if(regionalAreasList. includes(suburb)){
            //    city = cityName;
              //  break;
           // }
       // }


console.log(latitude,longitude);
// make an AJAX POST request to your PHP file
$.ajax({
type: 'POST',
url: 'location_save.php',
data: { city: city, suburb: suburb ,latitude:latitude , longitude: longitude ,email:email},
success: function(response) {
  console.log(response);
},
error: function(xhr, _status, _error) {
  console.log(xhr.responseText);
}
});


});


}
   


function onError(error){
    if(error.code == 1){ //if user denied the request
        button.innerText = "You denied the request";
    }else if(error.code == 2){ //if location in not available
        button.innerText = "Location is unavailable";
    }else{ //if other error occurred
        button.innerText = "Something went wrong";
    }
    button.setAttribute("disabled", "true"); //disable the button if error occurred
}

var location_person = document.getElementById('location_person');
    var login_back = document.getElementById('login_back');

    location_person .addEventListener('mouseover', function() {
      login_back.style.display = 'block';
      login_back.innerHTML = 'Back to Login';
    });

    location_person.addEventListener('mouseout', function() {
      login_back.style.display = 'none';
    });


    
    var next = document.getElementById('next');
    var next_button = document.getElementById('next_button');

    next.addEventListener('mouseover', function() {
      next_button.style.display = 'block';
      next_button.innerHTML = 'Check for your nearby health workers';
    });

    next.addEventListener('mouseout', function() {
      next_button.style.display = 'none';
    });

}); 
