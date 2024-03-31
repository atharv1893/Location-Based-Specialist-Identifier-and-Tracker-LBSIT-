mapboxgl.accessToken = "pk.eyJ1IjoiYXRoYXJ2LTE4OTMiLCJhIjoiY2xpZzNsNTZsMGJsNzNkbndobGh4NzNvaiJ9.zMgPbWtyz2qPVs6G4yMpRQ";
const APIKEY = "K2uhMneJS78v6v29URO_WNW6ktUisDimbYmyKDNxg6Q";
var map;
var center;
var count=0
var popup = false;
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



function convertToGeoJSON(locations) {
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
          radius: 500
      };
  
      const geocodingUrl = `https://discover.search.hereapi.com/v1/discover?apikey=${APIKEY}&${new URLSearchParams(params)}`
      fetch(geocodingUrl)
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
                      .setHTML(`
                      <h3>${location.title}</h3>
                      <p>${location.address.label}</p>
                      <br>
                      <button class='directionButton' data-lng="${location.position.lng}" data-lat="${location.position.lat}" onclick="getDirections(${location.position.lat}, ${location.position.lng})">Show Direction</button>
                  `));
      
  
                  currentMarkers.push(marker); // Add marker to the array
              });
              
              // Display hospitals list
              displayLocations(locations);
          })
          .catch(error => {
              console.error("Error: ", error);
          });
        }

       
function displayLocations(locations) {
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
            hospitalList.style.display = 'block';
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

function categoryLocations(category) {
    var profession_value = document.getElementById('profession')
    var hospital_list = document.getElementById('hospital_list');
    const routeInfoDiv = document.getElementById('route-info');
    routeInfoDiv.style.display = 'none';
    if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
    }
    hospital_list.style.display = 'none';   
     profession_value.value = category
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
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
        q: category,
        at: `${latitude},${longitude}`,
        radius: 1000,
        proximity:[longitude,latitude],
    };

    // Execute the search request
    fetch(`https://discover.search.hereapi.com/v1/discover?apikey=${APIKEY}&${new URLSearchParams(params)}`)
        .then(response => response.json())
        .then(data => {
            const locations = data.items;
            const geojsonData = convertToGeoJSON(locations);
            console.log(locations)
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
                        // .setHTML(`<h3>${location.title}</h3><p>${location.address.label}</p><br><a href="https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${location.position.lat},${location.position.lng}"target="_blank"><button class = 'direction' >Show Direction</button></a>`));
                        .setHTML(`
                <h3>${location.title}</h3>
                <p>${location.address.label}</p>
                <br>
                <button class='directionButton' data-lng="${location.position.lng}" data-lat="${location.position.lat}" onclick="getDirections(${location.position.lat}, ${location.position.lng})">Show Direction</button>
            `));

                currentMarkers.push(marker);
                
            });
            // document.querySelectorAll('.directionButton').forEach(button => {
            //     button.addEventListener('click', function() {
            //         const destinationLng = parseFloat(this.getAttribute('data-lng'));
            //         const destinationLat = parseFloat(this.getAttribute('data-lat'));
            //         getDirections(destinationLng, destinationLat);
            //     }); 
            
            displayLocations(locations);
        })
        .catch(error => {
            console.error("Error: ", error);
        });
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
"Police Station",
"Petrol Pump",
"ATM",
"Clinic",
"Towing Car",



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
// Function to fetch directions from Mapbox Directions API

function decodePolyline(encoded) {
    const points = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
        let b;
        let shift = 0;
        let result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
        lat += dlat;
        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
        lng += dlng;

        points.push([lat / 1e5, lng / 1e5]);
    }
    return points;
}
function addRoute(coords) {
    // If a route is already loaded, remove it
    if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
    }
    // Add a new layer to the map
    map.addLayer({
        id: 'route',
        type: 'line',
        source: {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: coords
            }
        },
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#C6F6FF',
            'line-width': 8,
            'line-opacity': 0.8
        }
    });
}


async function getMatch(coordinates, radius, profile) {
    // Separate the radiuses with semicolons
    const radiuses = radius.join(';');
    // Create the query
    const query = await fetch(
        `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );
    const response = await query.json();
    // Handle errors
    if (response.code !== 'Ok') {
        alert(
            `${response.code} - ${response.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`
        );
        return;
    }
    // Get the coordinates from the response
    const coords = response.matchings[0].geometry;
    // Draw the route on the map
    addRoute(coords);
}

function getDirections(destinationLng, destinationLat) {
    navigator.geolocation.getCurrentPosition(function(position) {
        const originLng = position.coords.longitude;
        const originLat = position.coords.latitude;

        const coordinates = `${originLng},${originLat};${destinationLat},${destinationLng}`;
        const profile = 'driving';
        const accessToken = mapboxgl.accessToken;
        const alternatives = true; // Whether to include alternative routes
        const geometries = 'geojson'; // Format of the returned geometry
        const language = 'en'; // Language for the route instructions
        const overview = 'full'; // Level of detail
        const steps = true; // Whether to return step-by-step instructions
        const duration = 'distance'; // Whether to include the estimated duration
        const radius = [originLat,originLng];
        getMatch(coordinates, radius, profile);
        const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?alternatives=${alternatives}&geometries=${geometries}&language=${language}&overview=${overview}&steps=${steps}&annotations=${duration}&access_token=${accessToken}`;

        fetch(directionsUrl)
            .then(response => response.json())
            .then(data => {
                

                // Display distance, duration, and step-by-step instructions
                const distance = (data.routes[0].distance / 1000).toFixed(2); // Distance in kilometers
                const duration = (data.routes[0].duration / 60).toFixed(2); // Duration in minutes
                const steps = data.routes[0].legs[0].steps.map(step => step.maneuver.instruction);
                const routeInfoHTML = `
                <div class = "route">
            
                <span class="material-symbols-outlined">
                directions_car
                </span>
                <span>${duration} minutes</span>
               
                <p>${distance} km</p>
                </div>
                <div class = "route-step">
                <b>Steps</b>
                <ol style="margin-top: 5px;padding-left: 20px;">
                ${steps.map(step => `<li style="margin-bottom: 5px;">${step}</li>`).join('')}
                </ol>
                </div>
                `;
    
            // Get reference to the div where we want to display route information
            const routeInfoDiv = document.getElementById('route-info');
            routeInfoDiv.style.display = 'block';
    
            // Update content of the div with route information
            routeInfoDiv.innerHTML = routeInfoHTML;
            })
            .catch(error => {
                console.error("Error fetching directions:", error);
            });
    });

}


function hideRouteInfo() {
    const routeInfoDiv = document.getElementById('route-info');
    routeInfoDiv.style.display = 'none';
}

// Event listener for window click to hide route info
window.addEventListener('click', function(event) {
    const routeInfoDiv = document.getElementById('route-info');
    const cardContainer = document.getElementById('hospital_list'); // Assuming the ID of the container for cards is 'hospital_list'

    // Check if the clicked element is not part of the route-info or the card container
    if (!routeInfoDiv.contains(event.target) && cardContainer.contains(event.target)) {
        hideRouteInfo();
    }
});

function checkKeyPress(event) {
    // Check if backspace key (keyCode 8) was pressed
    if (event.keyCode === 8 && count == 0) {
        hideList();
    }
}

function hideList() {
    var hospitalList = document.getElementById('hospital_list');
    const routeInfoDiv = document.getElementById('route-info');
    if (hospitalList) {
        hospitalList.style.display = 'none';
        routeInfoDiv.style.display = 'none';
        count = 1;
    }
    if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
    }
}

function searchPlace(placeName) {
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json?access_token=${mapboxgl.accessToken}`;

    fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
            // Check if any features are returned
            if (data.features.length > 0) {
              center = data.features[0].center;
                map.flyTo({ center, zoom: 16,pitch:60 });
                // Place name recognized, prompt for profession
                const profession = prompt('Place recognized. Please enter a profession:');
                var profession_value = document.getElementById('profession');
                profession_value.value = profession
                
                // Proceed with searching for nearby locations based on the place name and profession
                if (profession) {
                    OtherLocation(data.features[0], profession);
                }
            } else {
                alert('Place not recognized. Please enter a valid place name.');
            }
        })
        .catch(error => {
            console.error('Error searching for place:', error);
        });
}


function AskForLocation(){

    var routeInfoDiv = document.getElementById('route-info');
        routeInfoDiv.style.display = 'none';
     

    if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
    }
    const placeName = prompt('Please enter a place name:');
    if (placeName) {
      searchPlace(placeName);
    }
  }
  function OtherLocation(place , profession) {
    const latitude = place.center[1];
      const longitude = place.center[0];
      addSpecialMarker(latitude, longitude); 
        // Remove previous markers
        if (currentMarkers !== null) {
            for (let i = currentMarkers.length - 1; i >= 0; i--) {
                currentMarkers[i].remove();
            }
             // Clear the array
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
    
        const geocodingUrl = `https://discover.search.hereapi.com/v1/discover?apikey=${APIKEY}&${new URLSearchParams(params)}`
        fetch(geocodingUrl)
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
                        .setHTML(`
                        <h3>${location.title}</h3>
                        <p>${location.address.label}</p>
                        <br>
                        <button class='directionButton' data-lng="${location.position.lng}" data-lat="${location.position.lat}" onclick="getOtherLocationDirections(${place.center[1]},${place.center[0]},${location.position.lat}, ${location.position.lng})">Show Direction</button>
                    `));
        
    
                    currentMarkers.push(marker); // Add marker to the array
                });
                
                // Display hospitals list
                displayLocations(locations);
            })
            .catch(error => {
                console.error("Error: ", error);
            });
          }
          function getOtherLocationDirections(originLat, originLng, destinationLng, destinationLat) {
        
                const coordinates = `${originLng},${originLat};${destinationLat},${destinationLng}`;
                const profile = 'driving';
                const accessToken = mapboxgl.accessToken;
                const alternatives = true; // Whether to include alternative routes
                const geometries = 'geojson'; // Format of the returned geometry
                const language = 'en'; // Language for the route instructions
                const overview = 'full'; // Level of detail
                const steps = true; // Whether to return step-by-step instructions
                const duration = 'distance'; // Whether to include the estimated duration
                const radius = [originLat,originLng];
                getMatch(coordinates, radius, profile);
                const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?alternatives=${alternatives}&geometries=${geometries}&language=${language}&overview=${overview}&steps=${steps}&annotations=${duration}&access_token=${accessToken}`;
        
                fetch(directionsUrl)
                    .then(response => response.json())
                    .then(data => {
                        
        
                        // Display distance, duration, and step-by-step instructions
                        const distance = (data.routes[0].distance / 1000).toFixed(2); // Distance in kilometers
                        const duration = (data.routes[0].duration / 60).toFixed(2); // Duration in minutes
                        const steps = data.routes[0].legs[0].steps.map(step => step.maneuver.instruction);
                        const routeInfoHTML = `
                        <div class = "route">
                    
                        <span class="material-symbols-outlined">
                        directions_car
                        </span>
                        <span>${duration} minutes</span>
                       
                        <p>${distance} km</p>
                        </div>
                        <div class = "route-step">
                        <b>Steps</b>
                        <ol style="margin-top: 5px;padding-left: 20px;">
                        ${steps.map(step => `<li style="margin-bottom: 5px;">${step}</li>`).join('')}
                        </ol>
                        </div>
                        `;
            
                    // Get reference to the div where we want to display route information
                    const routeInfoDiv = document.getElementById('route-info');
                    routeInfoDiv.style.display = 'block';
            
                    // Update content of the div with route information
                    routeInfoDiv.innerHTML = routeInfoHTML;
                    })
                    .catch(error => {
                        console.error("Error fetching directions:", error);
                    });
        
        }
let LocationMarker = [];
let specialMarker;
        function addSpecialMarker(latitude, longitude) {
            // Remove previous special marker if exists
            removePreviousSpecialMarker();
        
            
            specialMarker = new mapboxgl.Marker({ color: '#ffc83d' })
            .setLngLat([longitude, latitude])
            .addTo(map);
            LocationMarker.push(specialMarker);
            console.log(LocationMarker)
        }
        
        function removePreviousSpecialMarker() {
            if (LocationMarker.length > 0) {
                for (let i = 0; i < LocationMarker.length; i++) {
                    LocationMarker[i].remove();
                }
                // Clear the LocationMarker array
                LocationMarker = [];
            }
        }
        