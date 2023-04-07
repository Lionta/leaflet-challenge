// Create the URL, street and topographic layers, and creating the map object then adding it to the map.
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
   
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
   
var baseMaps = {
    Street: street,
    Topography: topo
};
   
var map = L.map('map', {
    center: [38.5616,-121.5816],
    zoom: 8,
    layers: [street]
});

L.control.layers(baseMaps).addTo(map);

d3.json(url).then(function(data) {

    //Using the geoJSON method to get the data
    L.geoJSON(data, {
        //using the pointToLayer option to make points for each feature
        pointToLayer: function(feature, latlng) {
            //creating circleMarkers with the information and giving them base styling
          return L.circleMarker(latlng, {
            radius: getMarkerSize(feature.properties.mag),
            fillColor: getMarkerColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
            //binding a popup with the feature information
          }).bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
            "<p>Magnitude: " + feature.properties.mag + "</p>" +
            "<p>Depth: " + feature.geometry.coordinates[2] + "</p>");
        }
    }).addTo(map);

  // create a legend
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    depths = [-10, 10, 30, 50, 70, 90];

    // loop through the depths and generate a label with a colored square for each depth range
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
          '<ul style=\"background-color:' + getMarkerColor(depths[i]) + '\">'+depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+') +'</ul> ';
    }

    return div;
  };
  legend.addTo(map);
});

//multiplying magnitude by 5 to create larger markers that get bigger and smaller based on the magnitude
function getMarkerSize(magnitude) {
    return magnitude * 5;
  }


//setting colors for the various depths
function getMarkerColor(depth) {
    if (depth < 10) {
      return "#00ff00"; // green
    } else if (depth < 30) {
      return "#ffff00"; // yellow
    } else if (depth < 50) {
      return "#ffa500"; // orange
    } else if (depth <70) {
      return "#ff0000"; // red
    } else if (depth <90) {
        return "#7d150e"; //deep red
    } else {
        return "#360804"; //dark red
    }
  }