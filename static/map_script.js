
mapboxgl.accessToken = 'pk.eyJ1IjoiYXRoYXJ2LTE4OTMiLCJhIjoiY2xzeGVvbWgyMDJteTJsb2ViYmtzczA1byJ9.okf9PW2ORwBUQCJtC6EW7A';
const APIKEY = "K2uhMneJS78v6v29URO_WNW6ktUisDimbYmyKDNxg6Q";
var map;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        console.log("Latitude: " + latitude + ", Longitude: " + longitude);
    
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-streets-v11',
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
function removeMarkers() {
    var markers = document.querySelectorAll('.marker');
    markers.forEach(marker => marker.remove());
}

// Function to remove existing popups from the map
function removePopups() {
    var popups = document.querySelectorAll('.mapboxgl-popup');
    popups.forEach(popup => popup.remove());
}
function convertToGeoJSON(locations) {
    const uniquelocations = {};

    locations.forEach(location => {

        const firstFiveLetters = location.title.substring(0, 5);


        if (!uniquelocations[firstFiveLetters]) {
            uniquelocations[firstFiveLetters] = location;
        }
    });
    console.log(uniquelocations)
    const uniqueFeatures = Object.values(uniquelocations).map(location => ({
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
            removeMarkers();
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

function findNearbyLocation(profession,position) {
    var index = 0;
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Define the search parameters
    const params = {
        q: profession, // Change the query to search for locations
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
                map.addLayer({
                    id: 'text-layer',
                    type: 'symbol',
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [{
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [longitude, latitude] // Example coordinates
                                },
                                properties: {
                                    title: location.address.label
                                }
                            }]
                        }
                    },
                    layout: {
                        'text-field': ['get', 'title'],
                        'text-size': 24,
                        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                        'text-radial-offset': 0.5,
                        'text-justify': 'auto'
                    },
                    paint: {
                        'text-color': '#FFFFFF'
                    }
                });
            });
             
            // Add markers for each location
            locations.forEach(location => {
              var el = document.createElement('div');
                    el.className = 'marker';
                    el.textContent = index + 1;
                    const markerId = `marker-${index}`; 
                    new mapboxgl.Marker({color: "#007afc"})
                        .setLngLat([location.position.lng, location.position.lat])
                        .addTo(map)
                        .setPopup(new mapboxgl.Popup({ offset: [0, -15] })
                         .setHTML(`<h3>${location.title}</h3><p>${location.address.label}</p>`)
                        
                            );  
                            displayHospitals(locations); 
        })
        .catch(error => {
            console.error("Error: ", error);
        });
     
        const listItem = document.getElementById(`hospital-${index + 1}`);
        listItem.dataset.markerId = markerId;
        listItem.addEventListener('click', function() {
            const lngLat = marker.getAttribute('data-lng-lat').split(',').map(parseFloat);
        // Center the map to the initial coordinates
        map.flyTo({
            center: lngLat,
            zoom: 16,
            pitch: 60
        });
    });
}); 
} function displayHospitals(locations) {
    var uniqueLocations = {};

    locations.forEach(location => {
        const firstFiveLetters = location.title.substring(0, 5);
        if (!uniqueLocations[firstFiveLetters]) {
            uniqueLocations[firstFiveLetters] = location;
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
