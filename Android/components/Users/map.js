const html_script = `

<!DOCTYPE html>
<html>
<head>
	
	<title>Quick Start - Leaflet</title>

	<meta charset="utf-8" />
	<meta name="viewport" content="initial-scale=1.0">
	
	<link rel="shortcut icon" type="image/x-icon" href="docs/images/favicon.ico" />

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>


	
</head>
<body style="padding: 0; margin: 0">



<div id="mapid" style="width: 100%; height: 100vh;"></div>
<script>
	var mymap = L.map('mapid').setView([51.505, -0.09], 5);

    let starting_point = L.marker([51.505, -0.09]).addTo(mymap).bindPopup('<b>My Location</b>').openPopup();
    let finish_point = L.marker([51.505, -0.09]).addTo(mymap).bindPopup('<b>Your School</b>').openPopup();

    document.addEventListener('message', (data) => {
        let parse = JSON.parse(data.data);
        mymap.setView([parse.my_lat, parse.my_lon], 15);
        starting_point.setLatLng([parse.my_lat, parse.my_lon]);
        finish_point.setLatLng([parse.end_lat, parse.end_lon]);
    });

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		id: 'mapbox/streets-v11'
	}).addTo(mymap);

	var popup = L.popup();

	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent("You clicked the map at " + e.latlng.toString())
			.openOn(mymap);
	}


</script>



</body>
</html>

`

export default html_script
