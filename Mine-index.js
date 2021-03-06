/* ==========

You can see your progress visually by running a local web server in the week's repository folder:

  npx http-server --port 8000

And navigating to http://localhost:8000/Mine-index.html

run python to generate html fiels for each points in anaconda

python process_MineBrownfields.py

========== *//// ////

// The following line disables a couple of linter rules that would normally
// apply, but should not for this exercise. You can ignore it.

/* eslint no-use-before-define: "off", no-unused-vars: "off" */

let map = L.map('map', {
  zoomSnap: 0.5,
}).setView([38.301331, -93.277497], 4.5);

/* old basemap
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
}).addTo(map);
*/

/* new basemap */

L.tileLayer('https://api.mapbox.com/styles/v1/tiantianup/cl0zp7ol1004q15ml01xhfvqk/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

/* ==========

Step 1: Brownfields: Mine Group

========== */

// Define features in Landcover Charts//
const lcCount = {
  'Barren Land': 0,
  'Cultivated Crops': 0,
  // "Developed High Intensity": 0,
  'Deciduous Forest': 0,
  'Developed Low Intensity': 0,
  'Developed Medium Intensity': 0,
  'Developed Open Space': 0,
  // "Emergent Herbaceous Wetlands": 0,
  'Evergreen Forest': 0,
  'Grassland Herbaceous': 0,
  'Mixed Forest': 0,
  'Open Water': 0,
  'Pasture/Hay': 0,
  'Scrub Shrub': 0,
  // "Woody Wetlands": 0
};
// Define features in Classification Charts//
const subcatCount = {
  Mineral: 0,
  Coal: 0,
  Hazards: 0,
  Waste: 0,
  Structures: 0,
  Water: 0,
  Unclassified: 0,
};

// Define features in Program_General Charts//
const programCount = {
  // "AML": 0,
  Brownfields: 0,
  // "LMOP": 0,
  // "RCRA": 0,
  'State Programs': 0,
  Superfund: 0,
};

// Define features in Ecoregion Charts//
const ecoregionCount = {
  'GREAT PLAINS': 0,
  'EASTERN TEMPERATE FORESTS': 0,
  'MEDITERRANEAN CALIFORNIA': 0,
  'NORTH AMERICAN DESERTS': 0,
  'NORTHWESTERN FORESTED MOUNTAINS': 0,
  // "MARINE WEST COAST FOREST":0,
  // "TROPICAL WET FORESTS":0,
  'NORTHERN FORESTS': 0,
  // "SOUTHERN SEMIARID HIGHLANDS":0,
  // "TEMPERATE SIERRAS":0,
  // "WATER":0,
  // "NA":0
};

// Color for legend, responding to Geojson//
const Mineclass = {
  Mine_Mineral: '#648587',
  Mine_Coal: '#494C80',
  Mine_Hazards: '#756E5D',
  Mine_Waste: '#656F6F',
  Mine_Structures: '#A09A89',
  Mine_Water: '#ACD5D8',
  Mine_Unclassified: '#C29C99',
};
// Name for legend, responding to Geojson//
const Minelabels = {
  Mineral: 'Mine_Mineral',
  Coal: 'Mine_Coal',
  Hazards: 'Mine_Hazards',
  Waste: 'Mine_Waste',
  Structures: 'Mine_Structures',
  Water: 'Mine_Water',
  Unclassified: 'Mine_Unclassified',


};
// Name for subcategory chart (opposite way compared to Map dot legends)
const subtypeChartLabels = {
  Mine_Mineral: 'Mineral',
  Mine_Coal: 'Coal',
  Mine_Hazards: 'Hazards',
  Mine_Waste: 'Waste',
  Mine_Structures: 'Structures',
  Mine_Water: 'Water',
  Mine_Unclassified: 'Unclassified',
};
// Filter Button
const Mineral_button = document.querySelector('.Mine_Mineral');
const Coal_button = document.querySelector('.Mine_Coal');
const Hazard_button = document.querySelector('.Mine_Hazards');
const Waste_button = document.querySelector('.Mine_Waste');
const Structure_button = document.querySelector('.Mine_Structures');
const Water_button = document.querySelector('.Mine_Water');
const Unclassified_button = document.querySelector('.Mine_Unclassified');

// Legends on map//
let legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map2) {
  const div = L.DomUtil.create('div', 'info legend');
  const categories = Object.keys(Minelabels);


  // loop through the categories (legend)
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const dataCategory = Minelabels[category];
    const color = Mineclass[dataCategory];
    div.innerHTML += `
      <span style="background: ${color}"></span>
      ${category}<br>
    `;
  }

  return div;
};

// Define Dropdown Button
function myFunction() {
  document.getElementById('myDropdown').classList.toggle('show');
}

function filterFunction() {
  let input; let filter; let ul; let li; let a; let i; let div; let txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  div = document.getElementById('myDropdown');
  a = div.getElementsByTagName('a');
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = '';
    } else {
      a[i].style.display = 'none';
    }
  }
}

legend.addTo(map);
let jsonLayerGroup = L.layerGroup().addTo(map);
let subcategoryShow = (features) => {
  jsonLayerGroup.clearLayers();
  for (const feature of features) {
    // origninal dotmarkers without radius responding to acrerage
    /* const layer = L.geoJSON(feature, {
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
      .addTo(map); */

    const jsonLayer = L.geoJSON(feature, {
      pointToLayer(feature2, latlng) {
        const classification = feature2.properties.Classification;
        const classColor = Mineclass[classification];

        let geojsonMarkerOptions = {
          radius: acreageRange(feature2.properties.Acres),
          fillColor: classColor,
          color: '#000',
          weight: 0.2,
          opacity: 0.7,
          fillOpacity: 0.7,
        };
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
    })
      .bindTooltip(feature.properties.Site_Name)
      .addTo(jsonLayerGroup);

    map.addEventListener('zoomend', () => {
      jsonLayer.eachLayer(marker => {
        const baseRadius = acreageRange(marker.feature.properties.Acres);
        if (map.getZoom() < 4.5) {
          marker.setRadius(baseRadius / 2);
          /*       } else if (map.getZoom() > 10) {
          marker.setRadius(6); */
        } else {
          marker.setRadius(baseRadius);
        }
      });
    });

    jsonLayer.addEventListener('click', () => {
      window.location = `MineBrownfields/${feature.properties.Site_ID}.html`;
    });

    // Count "LC_Type" from Geojson to landcover chart
    const lctype = feature.properties.LC_Type;
    lcCount[lctype] += 1;

    // Count "Program_General" from Geojson to program chart
    const programtype = feature.properties.Program_General;
    programCount[programtype] += 1;

    // Count "Classification" from Geojson to program chart
    const subtype = feature.properties.Classification;
    const stChartLabel = subtypeChartLabels[subtype];
    subcatCount[stChartLabel] += 1;

    // Count "Region" from Geojson to program chart
    const regiontype = feature.properties.NA_L1NAME;
    ecoregionCount[regiontype] += 1;
  }

  let filteredSubgroup = () => {
    const selectedSubgroup = Minelabels.value;
  };
};

let legendRadius = L.control({ position: 'bottomleft' });
legendRadius.onAdd = function (map3) {
  const div = L.DomUtil.create('div', 'info legend');
  const categories = Object.keys(Minelabels);

  return div;
};
legendRadius.addTo(map);

// Fetch geojson file
let jsonData;
fetch('Mine.geojson')
  .then(resp => resp.json())
  .then(data => {
    jsonData = data;
    const { features } = data; // .filter(f => f.properties['SubCategory'] === '...');
    subcategoryShow(features);

    updateChart1();

    updateChart2();

    updateChart3();

    updateChart4();
  });
// Dotmarker radius range
let acreageRange = (acreage) => {
  if (acreage < 2.7) {
    return 6;
  }
  if (acreage < 6.2) {
    return 8;
  }
  if (acreage < 17.3) {
    return 10;
  }
  if (acreage < 300) {
    return 12;
  }
  if (acreage > 300) {
    return 14;
  }
  return 6;
};
// Define features in 4 Charts

let updateChart1 = () => {
  let xArray = Object.keys(subcatCount);
  let yArray = Object.values(subcatCount);

  let layout = {
    title: 'Subcategory',
    margin: {
      t: 60, b: 30, l: 40, r: 40,
    },
    width: 300,
    height: 320,
    automargin: true,
    showlegend: false,
  };
  let barColors = [
    '#648587',
    '#494C80',
    '#756E5D',
    '#656F6F',
    '#A09A89',
    '#ACD5D8',
    'C29C99',
  ];
  let data = [{
    labels: xArray,
    values: yArray,
    hole: 0.4,
    type: 'pie',
    rotation: 45,
    textinfo: 'label+percent',
    textposition: 'outside',
    automargin: true,
    marker: { colors: barColors },
  }];

  Plotly.newPlot('subcategoryPlot', data, layout);
};
let updateChart2 = () => {
  let xArray = Object.keys(lcCount);
  let yArray = Object.values(lcCount);

  let layout = {
    title: 'Landcover',
    margin: {
      t: 50, b: 40, l: 40, r: 0,
    },
    width: 290,
    height: 280,
    automargin: true,
    showlegend: false,
    sort: false,
  };

  let barColors = [
    '#CF5178',
    '#A9657A',
    '#CC2B5E',
    '#83787B',
    '#d4c9cc',
    '#cc97a5',
    '#75374A',
    '#5D8B7C',
    '#923351',
    '#663947',
    '#369E7D',
    '#573A43',
  ];

  let data = [{
    labels: xArray,
    values: yArray,
    hole: 0.4,
    type: 'pie',
    rotation: 45,
    textinfo: 'percent',
    textposition: 'outside',
    automargin: true,
    marker: { colors: barColors },
  }];

  Plotly.newPlot('lcPlot', data, layout);
};



let updateChart4 = () => {
  let xArray = Object.keys(programCount);
  let yArray = Object.values(programCount);

  let layout = {
    title: 'Program',
    margin: {
      t: 40, b: 40, l: 0, r: 40,
    },
    width: 350,
    height: 350,
    automargin: true,
    showlegend: false,
  };

  let barColors = [
    '#0E4547',
    '#0A888F',
    '#C5FAFC',
  ];

  let data = [{
    labels: xArray,
    values: yArray,
    hole: 0.4,
    type: 'pie',
    rotation: -60,
    textinfo: 'label+percent',
    textposition: 'outside',
    automargin: true,
    marker: { colors: barColors },
  }];

  Plotly.newPlot('programPlot', data, layout);
};

let updateChart3 = () => {
  let xArray = Object.keys(ecoregionCount);
  let yArray = Object.values(ecoregionCount);

  let layout = {
    title: 'Ecoregion',
    margin: {
      t: 40, b: 40, l: 70, r: 10,
    },
    width: 305,
    height: 290,
    automargin: true,
    showlegend: false,
  };

  let barColors = [

    // "#CACEED",
    '#F2A65A', // ORANGE
    '#CFBE3E', // OLIVE GREEN
    '#ACAA9F', //
    '#D3D0B7', // GREY
    '#FAF5CF', // WHITE
    '#756a1f', // DARK OLIVE GREEN
    // "#ACAA9F",
    // "#858587",
    // "#5D5F6E",
    // "#EEC170",
    // "#6D694C",
    // "#7D7329"
  ];

  let data = [{
    labels: xArray,
    values: yArray,
    hole: 0.4,
    type: 'pie',
    rotation: 90,
    textinfo: 'percent',
    textposition: 'outside',
    automargin: true,
    marker: { colors: barColors },
  }];

  Plotly.newPlot('EcoPlot', data, layout);
};

let readMoreButton = () => {
  const MoreDescription = document.querySelector('.toggle-more-description');
  const HiddenMoreDescription = document.querySelector('.more-description');
  MoreDescription.addEventListener('click', () => {
    HiddenMoreDescription.classList.toggle('hidden');
  });
};


readMoreButton();

let filterJson = (classification) => {
  const subMarker = jsonData.features.filter(f => f.properties.Classification === classification);
  subcategoryShow(subMarker);
};
// button legend to filter subcategories from Geojson
Mineral_button.addEventListener('click', () => { filterJson('Mine_Mineral'); });
Coal_button.addEventListener('click', () => { filterJson('Mine_Coal'); });
Hazard_button.addEventListener('click', () => { filterJson('Mine_Hazards'); });
Waste_button.addEventListener('click', () => { filterJson('Mine_Waste'); });
Structure_button.addEventListener('click', () => { filterJson('Mine_Structures'); });
Water_button.addEventListener('click', () => { filterJson('Mine_Water'); });
Unclassified_button.addEventListener('click', () => { filterJson('Mine_Unclassified'); });

// Quartile 1
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid');
  // document.querySelector('#brownfield-grid')
  const quartile1 = document.createElement('h2');
  quartile1.innerHTML = 'Quartile 1';
  brownfieldGridEl.appendChild(quartile1);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 2.7 acres, Scale: width of image = 600 feet';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres < 2.7);
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},16,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);

// Quartile 2
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid');
  const quartile2 = document.createElement('h2');
  quartile2.innerHTML = 'Quartile 2';
  brownfieldGridEl.appendChild(quartile2);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 6.2 acres, Scale: width of image = 600feet';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 2.7 && f.properties.Acres < 6.2);
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},16,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);

// Quartile 3
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid');
  const quartile3 = document.createElement('h2');
  quartile3.innerHTML = 'Quartile 3';
  brownfieldGridEl.appendChild(quartile3);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 11 acres, Scale: width of image = 600 ft';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 6.2 && f.properties.Acres < 17.3);
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},16,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);


// Quartile 4
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid');
  const quartile4 = document.createElement('h2');
  quartile4.innerHTML = 'Quartile 4';
  brownfieldGridEl.appendChild(quartile4);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 278 acres, Scale: width of image = 0.45 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 17.3 && f.properties.Acres < 300);
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},14,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);

// [...new Set(jsonData.features.map(f => f.properties['Classifica']))]
