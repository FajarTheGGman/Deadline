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
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
    <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>

	
</head>
<body style="padding: 0; margin: 0">



<div id="mapid" style="width: 100%; height: 100vh;"></div>
<script>
	var mymap = L.map('mapid').setView([51.505, -0.09], 5);

    let myIcon = L.icon({
        iconUrl: 'https://i.ibb.co/ky4gQfn/cap.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [41, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    let schoolIcon = L.icon({
        iconUrl: 'https://i.ibb.co/bNyQh3V/school.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [41, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    let starting_point = L.marker([51.505, -0.09], { icon: myIcon }).addTo(mymap).bindPopup('<b>My Location</b>').openPopup();
    let finish_point = L.marker([51.505, -0.09], { icon: schoolIcon }).addTo(mymap).bindPopup('<b>Your School</b>').openPopup();

    let my_lat = 0;
    let my_lon = 0;

    let end_lat = 0;
    let end_lon = 0;

    document.addEventListener('message', (data) => {
        let parse = JSON.parse(data.data);
        mymap.setView([parse.my_lat, parse.my_lon], 15);
        starting_point.setLatLng([parse.my_lat, parse.my_lon]);
        finish_point.setLatLng([parse.end_lat, parse.end_lon]);
        my_lat = parse.my_lat;
        my_lon = parse.my_lon;
        end_lat = parse.end_lat;
        end_lon = parse.end_lon;
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
