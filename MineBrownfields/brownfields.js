const map = L.map('map').setView([39.95, -75.193], 16);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
}).addTo(map);

const layer = L.geoJSON(geojsonPoint).addTo(map);
map.fitBounds(layer.getBounds(), { maxZoom: 18 });
// map.setView([geometry.coordinates[1], geometry.coordinates[0]], {maxZoom: 18});
