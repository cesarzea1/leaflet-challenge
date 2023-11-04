// Initialize the map
var myMap = L.map('map').setView([37.09, -95.71], 5);

// Add a layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

// determine the size of the marker based on magnitude
function markerSize(magnitude) {
  return magnitude * 4; // Scale factor for marker size
}

// Define color of the marker based on the earthquake's depth
function markerColor(depth) {
    return depth > 90 ? '#ea2c2c' :
    depth > 70 ? '#ea822c' :
    depth > 50 ? '#ee9c00' :
    depth > 30 ? '#eecc00' :
    depth > 10 ? '#d4ee00' :
    '#98ee00';
}

// Function to add features to each point
function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><h3>Location: " + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

// Fetch the GeoJSON data from the USGS URL
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson")
  .then(response => response.json())
  .then(data => {
        L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: onEachFeature
    }).addTo(myMap);
  })
  .catch(error => {
    console.error('Error fetching the GeoJSON data: ', error);
  });

// legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];
  
    // legend white background 
    div.style.backgroundColor = 'white';
    div.style.padding = '6px';
    div.style.border = '1px solid #999';
    div.style.borderRadius = '5px';
    div.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.2)';
  
    //  depth intervals colored square for each interval
    for (var i = 0; i < depths.length; i++) {
      var nextDepth = depths[i + 1] ? depths[i + 1] : 90;
      div.innerHTML +=
        '<i style="background:' + markerColor(depths[i] + 1) + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.8;"></i>' +
        depths[i] + (depths[i + 1] ? '&ndash;' + nextDepth + ' km' : '+ km') + '<br>';
    }
  
    return div;
  };
  
  legend.addTo(myMap);