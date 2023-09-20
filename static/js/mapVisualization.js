function mapViz(data) {

  console.log('Successfully received business data from database map : ', data)

  $('#map-input').val('');
  d3.select('#map-bar-chart-viz').selectAll('svg').remove();

/*****************************************  VARIABLE SETTING  ******************************************/  
    
  let colors = ['#CD6839', '#8FBC8F', '#FFB90F', '#5CACEE', '#8B7E66', '#DDA0DD', '#FFEC8B', '#79CDCD', '#F4A460', '#CDC8B1']; 

  const input = document.getElementById('map-input');
  const searchBox = new google.maps.places.SearchBox(input);
  const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 40.0137967, lng:  -105.2627051 },
      zoom: 11,
      mapTypeId: 'roadmap',

  });
  
/*****************************************  VARIABLE SETTING  ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  LOCATIONS  ******************************************/

  var locations = [];

  for (var key of Object.keys(data)) {

      const locationArray = [];

      locationArray.push(data[key]['name'], data[key]['latitude'], data[key]['longitude']);
      locations.push(locationArray)

  }

/*****************************************  LOCATIONS  ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  addEVENTLISTENER  ******************************************/

  // add event listener for places_changed event
  searchBox.addListener('places_changed', function() {
      const places = searchBox.getPlaces();
      
      // Check if places have been selected
      if (places && places.length > 0) {
        const place = places[0];
        const inputVal = place.name; // Get the selected place's name or other details
        const destinationVal = document.getElementById('destination').value;
    
        if (destinationVal) {
          calculateDistance();
          setTimeout(function() {
            drawBarChart(data);
          }, 100); // Delay of 100 milliseconds
        } else if (inputVal) {
          calculateDistance();
        }
      }
    });
 
/*****************************************  addEVENTLISTENER  ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  BUSINESS MARKER  ******************************************/  

  var infowindow = new google.maps.InfoWindow();
  var businessMarker, i;
  var destinationList = document.getElementById('destination');

  $('#destination').empty();

  $('#destination').append('<option value="none"> -- </option>');


  for (i = 0; i < locations.length; i++) { 
      
      var option = document.createElement('option');
      option.value = locations[i][1] + ',' + locations[i][2];
      option.innerHTML = locations[i][0];
      destinationList.appendChild(option);

      $('#destination').val(locations[i][1] + ',' + locations[i][2]);


      businessMarker = new google.maps.Marker({

          position: new google.maps.LatLng(locations[i][1], locations[i][2]),
          map: map,
          icon: {
              path: 'M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z',
              scale: 0.07,
              strokeWeight: 2.5,
              strokeColor: '#FFFFFF',
              strokeOpacity: 1,
              fillColor: colors[i],
              fillOpacity: 1.0, 
          }

      });

      google.maps.event.addListener(businessMarker, 'click', (function(marker, i) {

      return function() {

          infowindow.setContent(`<i class="fas fa-square fa-sm" style="color:${colors[i]}"></i>` + '   ' + locations[i][0]);
          infowindow.open(map, marker);

      }
      
      })(businessMarker, i));

  }

/*****************************************  BUSINESS MARKER  ******************************************/  

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  SEARCH BOX FUNCTION  ******************************************/ 
    
  let markers = [];
  
  // search box events 
  input.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault();
      }
  })
    
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
  });

  
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', () => {

      calculateDistance();

      const places = searchBox.getPlaces();
      
      if (places.length == 0) {
          return;
      }

      // clear out the old markers.
      markers.forEach((marker) => {

          marker.setMap(null);

      });

      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {

      if (!place.geometry || !place.geometry.location) {
          console.log('Returned place contains no geometry');
          return;
      }

      const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
      };


      // Create a marker for each place.
      markers.push(
          new google.maps.Marker({
              map,
              icon,
              title: place.name,
              position: place.geometry.location,
          })
      );

      if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);

      } else {

          bounds.extend(place.geometry.location);
      }
      });
      
      map.fitBounds(bounds);
  });

/*****************************************  SEARCH BOX FUNCTION ******************************************/ 

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  DIRECTIONS SERVICE  ******************************************/

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });

  directionsRenderer.setOptions({
      polylineOptions: {
          strokeColor: '#CD4F39',
          strokeOpacity: 0.8,
          strokeWeight: 7
      }
  });

  directionsRenderer.setMap(map);

  const mapInput = document.getElementById('map-input');
  const destinationSelect = document.getElementById('destination');

  // Create a new Autocomplete instance for the 'map-input' search box
  const autocomplete = new google.maps.places.Autocomplete(mapInput);

  mapInput.addEventListener('change', onChangeHandler);
  destinationSelect.addEventListener('change', onChangeHandler);

  function onChangeHandler() {
  calculateAndDisplayRoute(directionsService, directionsRenderer);
  }

  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const origin = {
      query: mapInput.value
  };

  const destination = {
      query: destinationSelect.value
  };

  directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
  })
      .then((response) => {
      directionsRenderer.setDirections(response);
      calculateDistance(); // call calculateDistance() inside the callback
      });
  }


/*****************************************  DIRECTIONS SERVICE  ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  CALCULATE DISTANCE  ******************************************/       
 
// function calculateDistance() {
//     var geocoder = new google.maps.Geocoder();
//     var startInput = document.getElementById('map-input').value;
//     var start, end, distance;
//     var distanceList = [];
  
//     geocoder.geocode({ 'address': startInput }, function(results, status) {
//   if (status == google.maps.GeocoderStatus.OK) {
//     // Geocoding successful, proceed with distance calculation

//     // Retrieve latitude and longitude of the start location
//     var latitude = results[0].geometry.location.lat();
//     var longitude = results[0].geometry.location.lng();
//     start = new google.maps.LatLng(latitude, longitude);

//     data.forEach(function(item) {
//       // Attempt to retrieve latitude and longitude of the end location
//       var endLatitude = parseFloat(item.latitude);
//       var endLongitude = parseFloat(item.longitude);

//       // Check if end location coordinates are valid
//       if (!isNaN(endLatitude) && !isNaN(endLongitude)) {
//         end = new google.maps.LatLng(endLatitude, endLongitude);
//         distance = (google.maps.geometry.spherical.computeDistanceBetween(start, end) / 1000).toFixed(2);

//         distanceList.push({
//           business: item.name,
//           distance: parseFloat(distance)
//         });
//       }
//     });

//     d3.select('#map-bar-chart-viz').selectAll('svg').remove();
//     drawBarChart(distanceList);
    
//   } else {
//     // Geocoding failed, display error message or take appropriate action
//     console.error('Geocoding failed:', status);
//     // Display an error message to the user or handle the failure as desired
//   }
// });

//   }
  function calculateDistance() {
      var geocoder = new google.maps.Geocoder();
      var startInput = document.getElementById('map-input').value;
      var start, end, distance;
      var distanceList = [];
    
      geocoder.geocode({ 'address': startInput }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var latitude = results[0].geometry.location.lat();
          var longitude = results[0].geometry.location.lng();
          start = new google.maps.LatLng(latitude, longitude);
    
          data.forEach(function(item) {
            var endLatitude = parseFloat(item.latitude);
            var endLongitude = parseFloat(item.longitude);
    
            if (!isNaN(endLatitude) && !isNaN(endLongitude)) {
              end = new google.maps.LatLng(endLatitude, endLongitude);
              distance = (google.maps.geometry.spherical.computeDistanceBetween(start, end) / 1000).toFixed(2);
    
              distanceList.push({
                business: item.name,
                distance: parseFloat(distance)
              });
            }
          });
    
          d3.select('#map-bar-chart-viz').selectAll('svg').remove();
          drawBarChart(distanceList);
    
        } else {
          console.error('Geocoding failed:', status);
        }
      });
    }

    
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        console.log("Place not found");
        return;
      }
    
      mapInput.value = place.formatted_address;
      setTimeout(function() {
        calculateDistance();
      }, 100);
    });
    
    

/*****************************************  CALCULATE DISTANCE  ******************************************/ 

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  BAR CHART  ******************************************/

  function drawBarChart(data) {
      var colors = d3.scaleOrdinal().range(['#CD6839', '#8FBC8F', '#FFB90F', '#5CACEE', '#8B7E66', '#DDA0DD', '#FFEC8B', '#79CDCD', '#F4A460', '#CDC8B1']);
      var inputValue = document.getElementById('map-input').value;
    
      // check if there is no value in 'map-input'
      if (!inputValue) {
        d3.select('#map-bar-chart-viz').select('svg').remove();
        return; // exit the function
      }
    
      // set the dimensions and margins of the graph
      const margin = { top: 20, right: 30, bottom: 40, left: 210 },
        width = 500 - margin.left - margin.right,
        height = 240 - margin.top - margin.bottom;
    
      // calculate the maximum distance value in the data
      const maxDistance = d3.max(data, (d) => d.distance);
    
      // add some extra space behind the maximum value
      const xMax = maxDistance * 1.1;
    
      // append the svg object to the body of the page
      const svg = d3
        .select('#map-bar-chart-viz')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
      // X axis
      const x = d3.scaleLinear().domain([0, xMax]).range([0, width]);
    
      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end')
        .style('font-size', '13px');
    
      svg
        .append('text')
        .attr('class', 'x-axis-title')
        .attr('text-anchor', 'end') // set the anchor to end
        .attr('x', width + 10) // position it at the rightmost end
        .attr('y', height + margin.bottom - 10)
        .text('km');
    
      // Y axis
      const y = d3.scaleBand().range([0, height]).domain(data.map((d) => d.business)).padding(0.1);
    
      svg.append('g').call(d3.axisLeft(y)).style('font-size', '13px');
    
      var bars = svg.selectAll('.bar').data(data).enter().append('g').attr('class', 'bars');
    
      // append rects
      bars
        .append('rect')
        .attr('class', 'bar')
        .attr('y', function (d) {
          return y(d.business) + 7;
        })
        .attr('height', y.bandwidth() - 20)
        .attr('x', 0)
        .attr('width', function (d) {
          const distance = x(d.distance);
          return isNaN(distance) ? 1 : Math.max(distance, 1); // Set a minimum width of 1 if distance is NaN
        })
        .attr('fill', function (d, i) {
          return colors(d.business);
        });
    
      // add a value label to the right of each bar
      bars
        .append('text')
        .attr('class', 'label')
        .attr('font-size', '12px')
        .attr('y', function (d) {
          return y(d.business) + y.bandwidth() / 2 + 4;
        })
        .attr('x', function (d) {
          const distance = x(d.distance);
          const offset = isNaN(distance) ? -10 : Math.max(distance, 3); // Adjust the offset based on the width availability
          return offset;
        })
        .text(function (d) {
          return d.distance + ' km';
        });
    }
    
/*****************************************  BAR CHART  ******************************************/

}

    window.mapViz = mapViz;













