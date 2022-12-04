/* ==========
You can see your
progress visually by running a local web server in the week's repository folder:

  npx http-server --port 8000

And navigating to http://localhost:8000/index.html

run python to generate html fiels for each points in anaconda

python process_MilitaryBrownfields.py

========== */

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

Step 1: Brownfields: Military Group

========== */

// Define features in Land cover Charts//
const lcCount = {
  //'Barren Land': 0,
  'Cultivated Crops': 0,
  'Developed High Intensity': 0,
  'Deciduous Forest': 0,
  'Developed Low Intensity': 0,
  'Developed Medium Intensity': 0,
  'Developed Open Space': 0,
  //'Emergent Herbaceous Wetlands': 0,
  //'Evergreen Forest': 0,
  'Grassland Herbaceous': 0,
  //'Mixed Forest': 0,
  //'Open Water': 0,
  'Pasture/Hay': 0,
  'Scrub Shrub': 0,
  'Woody Wetlands': 0,
};
// Define features in Classification Charts//
const subcatCount = {
  Railways: 0,
  Automotive: 0,
  'Gas Stations': 0,
  Gasification: 0,
  'Processing+Transport': 0,
  Unclassified: 0,
};

// Define features in Program_General Charts//
const programCount = {
  // "AML": 0,
  Brownfields: 0,
  //'LMOP': 0,
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
  'TROPICAL WET FORESTS':0,
  'NORTHERN FORESTS': 0,
  // "SOUTHERN SEMIARID HIGHLANDS":0,
  'TEMPERATE SIERRAS':0,
  'WATER':0,
  // "NA":0
};
// Color for legend, responding to Geojson//
const Petroclass = {
  Automotive: '#4D5382',
  Gas_Stations: '#658E9C',
  Gasification: '#8CBA80',
  Rail: '#514663',
  Processing_Transport: '#CACF85',
  Unclassified:'#00FF00',

};
// Name for Map dot legend, responding to Geojson//
const Petrolabels = {

  Automotive: 'Automotive',
  Gas_Stations: 'Gas_Stations',
  Gasification: 'Gasification',
  Rail: 'Rail',
  Processing_Transport: 'Processing_Transport',
  Unclassified: 'Unclassified',
};
// Name for subcategory chart (opposite way compared to Map dot legends)
const subtypeChartLabels = {
  Rail: 'Rail',
  Automotive: 'Automotive',
  GasStations: 'Gas_Stations',
  Gasification: 'Gasification',
  'Processing _Transport': 'Processing_Transport',
  'Unclassified':'Unclassified',
};

const Railways_button = document.querySelector('.Rail');
const Automotive_button = document.querySelector('.Automotive');
const Gas_Stations_button = document.querySelector('.Gas_Stations');
const Gasification_button = document.querySelector('.Gasification');
const Processing_Transport_button = document.querySelector('.Processing_Transport');
const Unclassified_button = document.querySelector('.Unclassified');

// hide and show content section for subcategory
Railways_button.addEventListener('click', () => {
  const contentSections = document.querySelectorAll('.content-section');
  const contentSectionShown = document.querySelector('#content-section-Rail');
  for(const section of contentSections){
    section.classList.add('hidden')
  }
  contentSectionShown.classList.remove('hidden')
});

Automotive_button.addEventListener('click', () => {
  const contentSections = document.querySelectorAll('.content-section');
  const contentSectionShown = document.querySelector('#content-section-Automotive');
  for(const section of contentSections){
    section.classList.add('hidden')
  }
  contentSectionShown.classList.remove('hidden')
});

Gas_Stations_button.addEventListener('click', () => {
  const contentSections = document.querySelectorAll('.content-section');
  const contentSectionShown = document.querySelector('#content-section-Gas_Stations');
  for(const section of contentSections){
    section.classList.add('hidden')
  }
  contentSectionShown.classList.remove('hidden')
});

Gasification_button.addEventListener('click', () => {
  const contentSections = document.querySelectorAll('.content-section');
  const contentSectionShown = document.querySelector('#content-section-Gasification');
  for(const section of contentSections){
    section.classList.add('hidden')
  }
  contentSectionShown.classList.remove('hidden')
});

Processing_Transport_button.addEventListener('click', () => {
  const contentSections = document.querySelectorAll('.content-section');
  const contentSectionShown = document.querySelector('#content-section-Processing_Transport');
  for(const section of contentSections){
    section.classList.add('hidden')
  }
  contentSectionShown.classList.remove('hidden')
});

Unclassified_button.addEventListener('click', () => {
  const contentSections = document.querySelectorAll('.content-section');
  const contentSectionShown = document.querySelector('#content-section-Unclassified');
  for(const section of contentSections){
    section.classList.add('hidden')
  }
  contentSectionShown.classList.remove('hidden')
});

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
    const jsonLayer = L.geoJSON(feature, {
      pointToLayer(feature2, latlng) {
        const classification = feature2.properties.Subgroup;
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
          marker.setRadius(baseRadius);
        } else {
          marker.setRadius(baseRadius);
        }
      });
    });

    jsonLayer.addEventListener('click', () => {
      window.location = `PetrochemicalBrownfields/${feature.properties.Site_ID}.html`;
    });
    const lctype = feature.properties.LC_Type;

    lcCount[lctype] += 1;

    // Count "Program_General" from Geojson to program chart
    const programtype = feature.properties.Program;
    programCount[programtype] += 1;

    // Count "Classification" from Geojson to program chart
    const subtype = feature.properties.Subgroup;
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
  const categories = Object.keys(Petrolabels);
  return div;
};
legendRadius.addTo(map);

// Fetch geojson file
let jsonData;
fetch('Petrochemical.geojson')
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
    return 10;
  }
  if (acreage < 11) {
    return 14;
  }
  if (acreage < 278) {
    return 16;
  }
  if (acreage > 278) {
    return 18;
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
      t: 40, b: 40, l: 50, r: 40,
    },
    width: 330,
    height: 350,
    showlegend: false,
  };
  let barColors = [
    '#772F1A',
    '#F58549',
    '#EEC170',
    '#585123',

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

  Plotly.newPlot('subcategoryPlot', data, layout);
};
let updateChart2 = () => {
  let xArray = Object.keys(lcCount);
  let yArray = Object.values(lcCount); // .map(y => y + 1);

  let layout = {
    title: 'Landcover',
    margin: {
      t: 40, b: 40, l: 40, r: 40,
    },
    width: 290,
    height: 290,
    showlegend: false,
    sort: false,
  };

  let barColors = [
    '#CF5178',
    '#A9657A',
    '#CC2B5E',
    '#74B89C',
    '#83787B',
    '#E44383',
    '#75374A',
    '#2C5343',
    '#5D8B7C',
    '#923351',
    '#663947',
    '#369E7D',
    '#573A43',
    '#79D6A5',
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
      t: 40, b: 40, l: 40, r: 40,
    },
    width: 325,
    height: 320,
    showlegend: false,
  };

  let barColors = [
    '#0E4547',
    '#0A888F',
    '#507173',
    '#C5FAFC',
    '#0A888F',
  ];

  let data = [{
    labels: xArray,
    values: yArray,
    hole: 0.4,
    type: 'pie',
    rotation: 120,
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
      t: 20, b: 40, l: 65, r: 40,
    },
    width: 295,
    height: 295,
    showlegend: false,
  };

  let barColors = [
    '#F2A65A', // ORANGE
    '#CFBE3E', // OLIVE GREEN
    '#ACAA9F', //
    '#858587',
    '#D3D0B7', // GREY
    '#FAF5CF', // WHITE
    '#756a1f', // DARK OLIVE GREEN
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
  const subMarker = jsonData.features.filter(f => f.properties.Subgroup === classification);
  subcategoryShow(subMarker);
};

Railways_button.addEventListener('click', () => { filterJson('Rail'); });
Automotive_button.addEventListener('click', () => { filterJson('Automotive'); });
Gas_Stations_button.addEventListener('click', () => { filterJson('GasStations'); });
Gasification_button.addEventListener('click', () => { filterJson('Gasification'); });
Processing_Transport_button.addEventListener('click', () => { filterJson('Processing & Transport'); });
Unclassified_button.addEventListener('click', () => { filterJson('Petrochemical Unclassified'); });

// Automotive Brownfield-grid1
// Quartile 1
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid1');
  // document.querySelector('#brownfield-grid')
  const quartile1 = document.createElement('h2');
  quartile1.innerHTML = 'Quartile 1';
  brownfieldGridEl.appendChild(quartile1);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 20 acres, Scale: width of image = 600 feet';
  brownfieldGridEl.appendChild(scaleBar);
// const subtype = feature.properties.Classifica; "filter subcategory from 'Classifica'
  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres < 1.6).filter(f => f.properties.Subgroup == 'Automotive');
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
  const brownfieldGridEl = document.getElementById('brownfield-grid1');
  const quartile2 = document.createElement('h2');
  quartile2.innerHTML = 'Quartile 2';
  brownfieldGridEl.appendChild(quartile2);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 560 acres, Scale: width of image = 0.45 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 1.6 && f.properties.Acres < 3.5).filter(f => f.properties.Subgroup == 'Automotive');
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

// Quartile 3
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid1');
  const quartile3 = document.createElement('h2');
  quartile3.innerHTML = 'Quartile 3';
  brownfieldGridEl.appendChild(quartile3);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 3652 acres, Scale: width of image = 1.8 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 3.5 && f.properties.Acres < 11).filter(f => f.properties.Subgroup == 'Automotive');
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},12,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);


// Quartile 4
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid1');
  const quartile4 = document.createElement('h2');
  quartile4.innerHTML = 'Quartile 4';
  brownfieldGridEl.appendChild(quartile4);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 2669226 acres, Scale: width of image = 7.2 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 11).filter(f => f.properties.Subgroup == 'Automotive');
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},10,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);

// GasStation Brownfield-grid2
// Quartile 1
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid2');
  // document.querySelector('#brownfield-grid')
  const quartile1 = document.createElement('h2');
  quartile1.innerHTML = 'Quartile 1';
  brownfieldGridEl.appendChild(quartile1);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 20 acres, Scale: width of image = 600 feet';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres < 1.6).filter(f => f.properties.Subgroup == 'GasStations');
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
  const brownfieldGridEl = document.getElementById('brownfield-grid2');
  const quartile2 = document.createElement('h2');
  quartile2.innerHTML = 'Quartile 2';
  brownfieldGridEl.appendChild(quartile2);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 560 acres, Scale: width of image = 0.45 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 1.6 && f.properties.Acres < 3.5).filter(f => f.properties.Subgroup == 'GasStations');
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

// Quartile 3
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid2');
  const quartile3 = document.createElement('h2');
  quartile3.innerHTML = 'Quartile 3';
  brownfieldGridEl.appendChild(quartile3);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 3652 acres, Scale: width of image = 1.8 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 3.5 && f.properties.Acres < 11).filter(f => f.properties.Subgroup == 'GasStations');
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},12,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);


// Quartile 4
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid2');
  const quartile4 = document.createElement('h2');
  quartile4.innerHTML = 'Quartile 4';
  brownfieldGridEl.appendChild(quartile4);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 2669226 acres, Scale: width of image = 7.2 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 11).filter(f => f.properties.Subgroup == 'GasStations');
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},10,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);

// Gasification Brownfield-grid3
// Quartile 1
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid3');
  // document.querySelector('#brownfield-grid')
  const quartile1 = document.createElement('h2');
  quartile1.innerHTML = 'Quartile 1';
  brownfieldGridEl.appendChild(quartile1);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 20 acres, Scale: width of image = 600 feet';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres < 1.6).filter(f => f.properties.Subgroup == 'Gasification');
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
  const brownfieldGridEl = document.getElementById('brownfield-grid3');
  const quartile2 = document.createElement('h2');
  quartile2.innerHTML = 'Quartile 2';
  brownfieldGridEl.appendChild(quartile2);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 560 acres, Scale: width of image = 0.45 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 1.6 && f.properties.Acres < 3.5).filter(f => f.properties.Subgroup == 'Gasification');
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

// Quartile 3
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid3');
  const quartile3 = document.createElement('h2');
  quartile3.innerHTML = 'Quartile 3';
  brownfieldGridEl.appendChild(quartile3);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 3652 acres, Scale: width of image = 1.8 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 3.5 && f.properties.Acres < 11).filter(f => f.properties.Subgroup == 'Gasification');
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},12,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);


// Quartile 4
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid3');
  const quartile4 = document.createElement('h2');
  quartile4.innerHTML = 'Quartile 4';
  brownfieldGridEl.appendChild(quartile4);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 2669226 acres, Scale: width of image = 7.2 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 11).filter(f => f.properties.Subgroup == 'Gasification');
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},10,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);

// Processing_Transport Brownfield-grid4
// Quartile 1
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid4');
  // document.querySelector('#brownfield-grid')
  const quartile1 = document.createElement('h2');
  quartile1.innerHTML = 'Quartile 1';
  brownfieldGridEl.appendChild(quartile1);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 20 acres, Scale: width of image = 600 feet';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres < 1.6).filter(f => f.properties.Subgroup == 'Processing & Transport');
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
  const brownfieldGridEl = document.getElementById('brownfield-grid4');
  const quartile2 = document.createElement('h2');
  quartile2.innerHTML = 'Quartile 2';
  brownfieldGridEl.appendChild(quartile2);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 560 acres, Scale: width of image = 0.45 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 1.6 && f.properties.Acres < 3.5).filter(f => f.properties.Subgroup == 'Processing & Transport');
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

// Quartile 3
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid4');
  const quartile3 = document.createElement('h2');
  quartile3.innerHTML = 'Quartile 3';
  brownfieldGridEl.appendChild(quartile3);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 3652 acres, Scale: width of image = 1.8 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 3.5 && f.properties.Acres < 11).filter(f => f.properties.Subgroup == 'Processing & Transport');
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},12,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);


// Quartile 4
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid4');
  const quartile4 = document.createElement('h2');
  quartile4.innerHTML = 'Quartile 4';
  brownfieldGridEl.appendChild(quartile4);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 2669226 acres, Scale: width of image = 7.2 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 11).filter(f => f.properties.Subgroup == 'Processing & Transport');
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},10,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);

// Rail Brownfield-grid5
// Quartile 1
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid5');
  // document.querySelector('#brownfield-grid')
  const quartile1 = document.createElement('h2');
  quartile1.innerHTML = 'Quartile 1';
  brownfieldGridEl.appendChild(quartile1);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 20 acres, Scale: width of image = 600 feet';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres < 1.6).filter(f => f.properties.Subgroup == 'Rail');
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
  const brownfieldGridEl = document.getElementById('brownfield-grid5');
  const quartile2 = document.createElement('h2');
  quartile2.innerHTML = 'Quartile 2';
  brownfieldGridEl.appendChild(quartile2);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 560 acres, Scale: width of image = 0.45 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 1.6 && f.properties.Acres < 3.5).filter(f => f.properties.Subgroup == 'Rail');
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

// Quartile 3
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid5');
  const quartile3 = document.createElement('h2');
  quartile3.innerHTML = 'Quartile 3';
  brownfieldGridEl.appendChild(quartile3);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 3652 acres, Scale: width of image = 1.8 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 3.5 && f.properties.Acres < 11).filter(f => f.properties.Subgroup == 'Rail');
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},12,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);


// Quartile 4
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid5');
  const quartile4 = document.createElement('h2');
  quartile4.innerHTML = 'Quartile 4';
  brownfieldGridEl.appendChild(quartile4);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 2669226 acres, Scale: width of image = 7.2 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 11).filter(f => f.properties.Subgroup == 'Rail');
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},10,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);

// Unclassified Brownfield-grid6
// Quartile 1
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid6');
  // document.querySelector('#brownfield-grid')
  const quartile1 = document.createElement('h2');
  quartile1.innerHTML = 'Quartile 1';
  brownfieldGridEl.appendChild(quartile1);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 20 acres, Scale: width of image = 600 feet';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres < 1.6).filter(f => f.properties.Subgroup == 'Petrochemical Unclassified');
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
  const brownfieldGridEl = document.getElementById('brownfield-grid6');
  const quartile2 = document.createElement('h2');
  quartile2.innerHTML = 'Quartile 2';
  brownfieldGridEl.appendChild(quartile2);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 560 acres, Scale: width of image = 0.45 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 1.6 && f.properties.Acres < 3.5).filter(f => f.properties.Subgroup == 'Petrochemical Unclassified');
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

// Quartile 3
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid6');
  const quartile3 = document.createElement('h2');
  quartile3.innerHTML = 'Quartile 3';
  brownfieldGridEl.appendChild(quartile3);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 3652 acres, Scale: width of image = 1.8 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 3.5 && f.properties.Acres < 11).filter(f => f.properties.Subgroup == 'Petrochemical Unclassified');
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},12,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);


// Quartile 4
setTimeout(() => {
  const brownfieldGridEl = document.getElementById('brownfield-grid6');
  const quartile4 = document.createElement('h2');
  quartile4.innerHTML = 'Quartile 4';
  brownfieldGridEl.appendChild(quartile4);

  const refreshButton = document.createElement('button');
  refreshButton.innerHTML = 'Refresh';
  brownfieldGridEl.appendChild(refreshButton);

  const scaleBar = document.createElement('h3');
  scaleBar.innerHTML = 'Areas < 2669226 acres, Scale: width of image = 7.2 mile';
  brownfieldGridEl.appendChild(scaleBar);

  const imageRow = document.createElement('div');
  brownfieldGridEl.appendChild(imageRow);
  const refreshImageRow = function () {
    imageRow.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const quartileFilter = jsonData.features.filter(f => f.properties.Acres > 11).filter(f => f.properties.Subgroup == 'Petrochemical Unclassified');
      const index = Math.floor(Math.random() * quartileFilter.length);
      const [lng, lat] = quartileFilter[index].geometry.coordinates;

      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', `https://api.mapbox.com/styles/v1/tiantianup/cl1v5lh0v000814mz35beqrsy/static/${lng},${lat},10,0.00,0.00/200x200@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA`);
      imageRow.appendChild(imgEl);
    }
  };
  refreshImageRow();
  refreshButton.addEventListener('click', refreshImageRow, false);
}, 1000);