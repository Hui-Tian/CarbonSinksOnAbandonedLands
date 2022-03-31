/* ==========

Introduction: In this part you will modify a few GeoJSON files in order to add
data to your map. Follow the instructions in the steps below. You can see your
progress visually by running a local web server in the week's repository folder:

  npx http-server --port 8000

And navigating to http://localhost:8000/index.html

run python for process_brownfields.py in anaconda

python process_brownfields.py

========== */

// The following line disables a couple of linter rules that would normally
// apply, but should not for this exercise. You can ignore it.

/* eslint no-use-before-define: "off", no-unused-vars: "off" */

const map = L.map('map').setView([38.301331, -96.277497], 5);

/* old basemap 
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
}).addTo(map);
*/

/* new basemap */

L.tileLayer('https://api.mapbox.com/styles/v1/tiantianup/cl0zp7ol1004q15ml01xhfvqk/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/* ==========

Step 1: Brownfields: Military Group

========== */
const lcCount = {
  "Barren Land": 0,
  "Cultivated Crops": 0,
  "Developed High Intensity": 0,
  "Deciduous Forest": 0,
  "Developed Low Intensity": 0,
  "Developed Medium Intensity": 0,
  "Developed Open Space": 0,
  "Emergent Herbaceous Wetlands": 0,
  "Evergreen Forest": 0,
  "Grassland Herbaceous": 0,
  "Mixed Forest": 0,
  "Open Water": 0,
  "Pasture/Hay": 0,
  "Scrub Shrub": 0,
  "Woody Wetlands": 0
};

const Militaryclass = {
  "Military_Weaponry":"#990e0e",
  "Military_Aviation": "#db1414",
  "Military_Waste Management": "#e55a5a",
  "Military_WM": "#e55a5a",
  "Military_Facilities": "#f7d0d0"
}

const Militarylabels = {
  "Weaponry":"Military_Weaponry",
  "Aviation":"Military_Aviation",
  "Waste Management":"Military_Waste Management",
  "Facilities":"Military_Facilities"
}



var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

  const div = L.DomUtil.create('div', 'info legend');
  const categories = Object.keys(Militarylabels);
  

  // loop through the categories
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const dataCategory = Militarylabels[category];
    const color = Militaryclass[dataCategory];
    div.innerHTML += `
      <span style="background: ${color}"></span>
      ${category}<br>
    `;
  }

  return div;
};

legend.addTo(map);

let p1;
fetch('Military.geojson')
  .then(resp => resp.json())
  .then(data => {
    const features = data.features;

    for (const feature of features) {

      const layer = L.geoJSON(feature, {
        pointToLayer: function (feature, latlng) {
          const classification = feature.properties['Classifica'];
          const classColor = Militaryclass[classification];

          var geojsonMarkerOptions = {
            radius: 4,
            fillColor: classColor,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
          };
          return L.circleMarker(latlng, geojsonMarkerOptions);
        } 
      })
        .bindTooltip(feature.properties['Site_Name'])
        .addTo(map);
      
      const radiuslayer = L.geoJSON(feature, {
        pointToLayer: function (feature, latlng) {
          const classification = feature.properties['Classifica'];
          const classColor = Militaryclass[classification];

          var geojsonMarkerOptions = {
            radius: acreageRange(feature.properties['Acres']),
            fillColor: classColor,
            color: "#000",
            weight: 1,
            opacity: 0,
            fillOpacity: 0.5
          };
          return L.circleMarker(latlng, geojsonMarkerOptions);
        } 
      })
        .bindTooltip(feature.properties['Site_Name'])
        .addTo(map);
      
      map.addEventListener('zoomend', () => {
        layer.eachLayer(marker => {
          if (map.getZoom() > 12) {
            marker.setRadius(8)
          } else if (map.getZoom() > 10) {
            marker.setRadius(6);
          } else {
            marker.setRadius(4);
          }
        })
      })
      layer.addEventListener('click', () => {
        window.location = `CarbonSinksOnAbandonedLands/brownfields/${feature.properties['Site_ID']}.html`;
      })
      const lctype = feature.properties['LC_Type'];
      
      lcCount[lctype] = lcCount[lctype] + 1;
    }
   
    updateChart()
 
    updateChart2()
  });
let acreageRange = (acreage) => {
  if (acreage < 600) {
    return 10;
  }
  else if (acreage < 3500) {
    return 14;
  }
  else if (acreage < 1000000) {
    return 18;
  }
  else if (acreage < 26000000) {
    return 22;
  }
}


let updateChart = () => {

    var xValues = Object.keys(lcCount);
  var yValues = Object.values(lcCount); 

  var barColors = [
    "#b91d47",
    "#00aba9",
    "#2b5797",
    "#e8c3b9",
    "#1e7145",
    "#fff7bc",
    "#fec44f",
    "#d95f0e",
    "#f7fcb9",
    "#addd8e",
    "#31a354",
    "#fde0dd",
    "#fa9fb5",
    "#c51b8a",
    "#7fcdbb"
  ];

  new Chart("myChart", {
    type: "doughnut",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      plugins: {
        legend: {
          textAlign: "left"
      }
  },
  title: {
    display: true,
    text: "Landcover Distribution"
  }
    }
  });
}

let updateChart2 = () => {

var xArray = Object.keys(lcCount);
var yArray = Object.values(lcCount);

var layout = {title:"Landcover"};

var data = [{labels:xArray, values:yArray, hole:.4, type:"pie"}];

Plotly.newPlot("myPlot", data, layout);


}

/* 4 sub-categories

Classifica:

*/