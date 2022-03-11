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
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
}).addTo(map);

/* ==========

Step 1: Overall inforamtion of Brownfields

========== */

let p1;
fetch('Military.geojson')
  .then(resp => resp.json())
  .then(data => {
    const features = data.features;
    const lcCount = {};
    for (const feature of features) {
      const layer = L.geoJSON(feature)
        .bindTooltip(feature.properties['Site_Name'])
        .addTo(map);
      layer.addEventListener('click', () => {
        window.location = `/brownfields/${feature.properties['Site_ID']}.html`;
      })
    }
  });

