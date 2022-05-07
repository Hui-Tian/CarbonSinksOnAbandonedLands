let map = L.map('map', {
  zoomSnap: 0.5,
}).setView([38.301331, -96.277497], 4.5);


L.tileLayer('https://api.mapbox.com/styles/v1/tiantianup/cl0ysuwz6000v14nt43hxd8vj/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidGlhbnRpYW51cCIsImEiOiJja2MzZThibzEwOTAyMnF0Z2syeWszN3J6In0.gp4Ekf3SFQdYe605993jQA', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  let div;
  div = document.getElementById('myDropdown');
  div.classList.toggle('show');
}

function filterFunction() {
  let input; let filter; let a; let i; let div; let txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
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


