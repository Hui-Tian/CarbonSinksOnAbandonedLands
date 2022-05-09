/* ==========
You can see your progress visually by running a local web server in the week's repository folder:

  npx http-server --port 8000

And navigating to http://localhost:8000/Petro-index.html

run python for process_brownfields.py in anaconda

python process_brownfields.py

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

Step 1: Brownfields: Petrochecmical Group

========== */

// Define features in Landcover Charts//
const lcCount = {
  // "Barren Land": 0,
  'Cultivated Crops': 0,
  'Developed High Intensity': 0,
  'Deciduous Forest': 0,
  'Developed Low Intensity': 0,
  'Developed Medium Intensity': 0,
  'Developed Open Space': 0,
  // "Emergent Herbaceous Wetlands": 0,
  // "Evergreen Forest": 0,
  'Grassland Herbaceous': 0,
  // "Mixed Forest": 0,
  // "Open Water": 0,
  'Pasture/Hay': 0,
  'Scrub Shrub': 0,
  'Woody Wetlands': 0,
};
// Define features in Claasification Charts//
const subcatCount = {
  Railways: 0,
  Automobiles: 0,
  'Gas Stations': 0,
  Gasification: 0,
  'Processing+Transport': 0,
};

// Define features in Program_General Charts//
const programCount = {
  // "AML": 0,
  Brownfields: 0,
  // "LMOP": 0,
  RCRA: 0,
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
  'MARINE WEST COAST FOREST': 0,
  'TROPICAL WET FORESTS': 0,
  'NORTHERN FORESTS': 0,
  // "SOUTHERN SEMIARID HIGHLANDS":0,
  'TEMPERATE SIERRAS': 0,
  WATER: 0,
  // "NA":0
};

// Color for legend, responding to Geojson//
const Petroclass = {
  PC_Rail: '#514663',
  PC_Auto: '#4D5382',
  PC_GasStations: '#658E9C',
  PC_Gasification: '#8CBA80',
  PC_ProcTrans: '#CACF85',
};
// Name for Map dot legend, responding to Geojson//
const Petrolabels = {
  Railways: 'PC_Rail',
  Automobiles: 'PC_Auto',
  'Gas Stations': 'PC_GasStations',
  Gasification: 'PC_Gasification',
  'Processing + Transport': 'PC_ProcTrans',
};
// Name for subcategory chart (opposite way compared to Map dot legends)
const subtypeChartLabels = {
  PC_Rail: 'Railways',
  PC_Auto: 'Automobiles',
  PC_GasStations: 'Gas Stations',
  PC_Gasification: 'Gasification',
  PC_ProcTrans: 'Processing+Transport',
};

const Railways_button = document.querySelector('.Railways');
const Automobiles_button = document.querySelector('.Automobiles');
const Gas_Stations_button = document.querySelector('.Gas_Stations');
const Gasification_button = document.querySelector('.Gasification');
const Processing_Transport_button = document.querySelector('.Processing_Transport');

// Legends on map//
let legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map2) {
  const div = L.DomUtil.create('div', 'info legend');
  const categories = Object.keys(Petrolabels);


  // loop through the categories (legend)
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const dataCategory = Petrolabels[category];
    const color = Petroclass[dataCategory];
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
        const classColor = Petroclass[classification];

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
      window.location = `PetrochemicalBrownfields/${feature.properties.Site_ID}.html`;
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
    const selectedSubgroup = Petrolabels.value;
  };
};

let legendRadius = L.control({ position: 'bottomleft' });
legendRadius.onAdd = function (map3) {
  const div = L.DomUtil.create('div', 'info legend');
  // div.innerHTML = "I'm here!"
  const categories = Object.keys(Petrolabels);


  // loop through the categories (legend)
  /*
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const dataCategory = Militarylabels[category];
      const color = Militaryclass[dataCategory];
      div.innerHTML += `
        <span style="background: ${color}"></span>
        ${category}<br>
    `   ;
    } */

  return div;
};
legendRadius.addTo(map);

// Fetch geojson file
let jsonData;
fetch('Petrochemical5.geojson')
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
  if (acreage < 1.6) {
    return 6;
  }
  if (acreage < 3.5) {
    return 8;
  }
  if (acreage < 11) {
    return 10;
  }
  if (acreage < 278) {
    return 12;
  }
  if (acreage > 278) {
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
      t: 40, b: 40, l: 20, r: 40,
    },
    width: 330,
    height: 330,
    showlegend: false,
  };
  let barColors = [
    '#514663',
    '#4D5382',
    '#658E9C',
    '#8CBA80',
    '#CACF85',
  ];
  let data = [{
    labels: xArray,
    values: yArray,
    hole: 0.4,
    type: 'pie',
    textinfo: 'label+percent',
    textposition: 'outside',
    rotation: 50,
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
      t: 50, b: 40, l: 20, r: 0,
    },
    width: 270,
    height: 275,
    showlegend: false,
    sort: false,
  };

  let barColors = [
    '#A9657A',
    '#369E7D',
    '#83787B',
    '#CF5178',
    '#CC2B5E',
    '#5D8B7C',
    '#923351',
    '#75374A',
    '#663947',
    '#573A43',

  ];

  let data = [{
    labels: xArray,
    values: yArray,
    hole: 0.4,
    type: 'pie',
    rotation: 50,
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
      t: 40, b: 40, l: 40, r: 40,
    },
    width: 336,
    height: 336,
    showlegend: false,
  };

  let barColors = [
    '#0E4547',
    '#507173',
    '#0A888F',
    '#C5FAFC',


  ];

  let data = [{
    labels: xArray,
    values: yArray,
    hole: 0.4,
    type: 'pie',
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
      t: 40, b: 40, l: 60, r: 40,
    },
    width: 280,
    height: 280,
    showlegend: false,
  };

  let barColors = [
    '#CFBE3E',
    '#756a1f',
    '#F2A65A',
    '#CACEED',
    '#FAF5CF',
    '#D3D0B7',
    '#ACAA9F',
    '#858587',
    '#5D5F6E',
    '#EEC170',
    '#6D694C',
    '#7D7329',
  ];

  let data = [{
    labels: xArray,
    values: yArray,
    hole: 0.4,
    type: 'pie',
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
Railways_button.addEventListener('click', () => { filterJson('PC_Rail'); });
Automobiles_button.addEventListener('click', () => { filterJson('PC_Auto'); });
Gas_Stations_button.addEventListener('click', () => { filterJson('PC_GasStations'); });
Gasification_button.addEventListener('click', () => { filterJson('PC_Gasification'); });
Processing_Transport_button.addEventListener('click', () => { filterJson('PC_ProcTrans'); });

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
  scaleBar.innerHTML = 'Areas < 1.6 acres, Scale: width of image = 600 feet';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres < 1.6);
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
  scaleBar.innerHTML = 'Areas < 3.5 acres, Scale: width of image = 600feet';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 1.6 && f.properties.Acres < 3.5);
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
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 3.5 && f.properties.Acres < 11);
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
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 11 && f.properties.Acres < 278);
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
