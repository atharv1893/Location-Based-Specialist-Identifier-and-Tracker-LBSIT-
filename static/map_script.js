mapboxgl.accessToken = "pk.eyJ1IjoiYXRoYXJ2LTE4OTMiLCJhIjoiY2xpZzNsNTZsMGJsNzNkbndobGh4NzNvaiJ9.zMgPbWtyz2qPVs6G4yMpRQ";
const APIKEY = "K2uhMneJS78v6v29URO_WNW6ktUisDimbYmyKDNxg6Q";
var map;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        console.log("Latitude: " + latitude + ", Longitude: " + longitude);
    
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/atharv-1893/clt31ff9e00mq01qzf21j3vc3',
            center: [longitude, latitude],
            zoom: 16,
            pitch:60,
        });
        map.addControl(new mapboxgl.NavigationControl());
        new mapboxgl.Marker({ color: '#a30c0c' })
      .setLngLat([longitude, latitude])
      .addTo(map);
      document.getElementById('centerButton').addEventListener('click', function() {
    map.flyTo({
        center: [longitude, latitude],
        zoom: 16,
        pitch: 60
    });
}); 
     
    }, function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    });
} else {
    alert("Geolocation is not supported by this browser.");
}


// Function to remove existing popups from the map
function removePopups() {
    var popups = document.querySelectorAll('.mapboxgl-popup');
    popups.forEach(popup => popup.remove());
}function convertToGeoJSON(locations) {
    const uniqueLocations = {};
    
    locations.forEach(location => {
        const key = `${location.title}_${location.position.lng}_${location.position.lat}`;
        uniqueLocations[key] = location;
    });

    const uniqueFeatures = Object.values(uniqueLocations).map(location => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [location.position.lng, location.position.lat]
        },
        properties: {
            name: location.title,
            address: location.address.label
        }
    }));

    return {
        type: 'FeatureCollection',
        features: uniqueFeatures
    };
}


function searchLocations() {
        var profession = document.getElementById('profession').value;
        if (profession.trim() === "") {
            alert("Please enter a profession.");
            return;
        }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            console.log("Latitude: " + latitude + ", Longitude: " + longitude);
            removePopups(); 
            findNearbyLocation(profession, position);
        }, function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred.");
                    break;
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    // Function to fetch nearby locations from HERE API
   
  }

  let currentMarkers = []; // Array to store current markers

  function findNearbyLocation(profession, position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
  
      // Remove previous markers
      if (currentMarkers !== null) {
          for (let i = currentMarkers.length - 1; i >= 0; i--) {
              currentMarkers[i].remove();
          }
          currentMarkers = []; // Clear the array
      }
      map.flyTo({
        center: [longitude, latitude],
        zoom: 16,
        pitch: 60
    });
      // Define the search parameters
      const params = {
          q: profession,
          at: `${latitude},${longitude}`,
          radius: 1000
      };
  
      // Execute the search request
      fetch(`https://discover.search.hereapi.com/v1/discover?apikey=${APIKEY}&${new URLSearchParams(params)}`)
          .then(response => response.json())
          .then(data => {
              const locations = data.items;
              const geojsonData = convertToGeoJSON(locations);
  
              // Add GeoJSON data to the map
              map.on('load', function () {
                  map.addSource('locations', {
                      type: 'geojson',
                      data: geojsonData
                  });
              });
  
              // Add markers for each location
              locations.forEach((location, index) => {
                  var el = document.createElement('div');
                  el.className = 'marker';
                  el.textContent = index + 1;
  
                  const marker = new mapboxgl.Marker({color: "#007afc"})
                      .setLngLat([location.position.lng, location.position.lat])
                      .addTo(map)
                      .setPopup(new mapboxgl.Popup({ offset: [0, -15] })
                          .setHTML(`<h3>${location.title}</h3><p>${location.address.label}</p>`));
  
                  currentMarkers.push(marker); // Add marker to the array
              });
              
              // Display hospitals list
              displayHospitals(locations);
          })
          .catch(error => {
              console.error("Error: ", error);
          });
        }
        function displayHospitals(locations) {
            var uniqueLocations = {};
        
            locations.forEach(location => {
                const key = `${location.title}_${location.position.lng}_${location.position.lat}`;
                if (!uniqueLocations[key]) {
                    uniqueLocations[key] = location;
                }
            });
        
            // Convert unique locations to an array
            const uniqueLocationsArray = Object.values(uniqueLocations);
        
            var hospitalList = document.getElementById('hospital_list');
            hospitalList.innerHTML = ''; 
        
            uniqueLocationsArray.forEach((location, index) => {
                var listItem = document.createElement('li');
                var nameElement = document.createElement('span');
                var addressElement = document.createElement('span');
        
                nameElement.textContent = `${index + 1}. ${location.title}`;
                nameElement.style.fontWeight = 'bold';
                nameElement.style.color = 'black';
        
                addressElement.textContent = location.address.label;
                addressElement.style.color = 'gray';
        
                listItem.appendChild(nameElement);
                listItem.appendChild(document.createElement('br'));
                listItem.appendChild(document.createElement('br'));
                listItem.appendChild(addressElement);
        
                listItem.addEventListener('click', function () {
                    // Fly to the corresponding marker when clicked
                    map.flyTo({
                        center: [location.position.lng, location.position.lat],
                        zoom: 18,
                        pitch: 60
                    });
                });
        
                hospitalList.appendChild(listItem);
            });
        }
        


   // Array of professions
   const profession = document.getElementById('profession');
const searchButton = document.getElementById('searchButton');
const hospitalList = document.getElementById('hospital-list');

var specialistDegrees = [
  "Hospital",
"Veterinary (VMD)",
"Garages",
"Fire Brigade",
"Police",
"Traffic Police",
"Gas Station",


];
function handleSearch() {
    var searchBar1 = document.getElementById("profession");
    var query = searchBar1.value.toLowerCase();
    var suggestion_list = document.getElementById("suggestion_list");
  
    // Clear previous autocomplete suggestions
    suggestion_list.innerHTML = "";
  
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
        suggestion_list.innerHTML = "";
      });
      suggestion_list.appendChild(listItem);
    });
  }
  

// Event listener to hide the autocomplete list when clicking outside the search field
document.addEventListener("click", function(event) {
var target = event.target;
var searchBar1 = document.getElementById("profession");
var suggestion_list = document.getElementById("suggestion_list");
searchBar1.addEventListener("input", handleSearch);
if (target !== searchBar1 && target !== suggestion_list) {
suggestion_list.innerHTML = "";
}
});
