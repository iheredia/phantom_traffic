var args = require('system').args;

var city_folder = args[1];
var city_width = args[2];
var city_height = args[3];
var city_zoom = args[4];
var img_format = args[5];
var img_quality = args[6];
var city_lat = args[7];
var city_lon = args[8];
var city_name = args[9];

function pretty_log(msg) {
    var d = (new Date).toString();
    console.log(d + ' ' + city_name + ': ' + msg);
}

function log(msg) {
    pretty_log(msg);
    if (msg == 'Mask loaded...') {
        pretty_log('Rendering mask...');
        var filename = './' + city_folder + '/' + city_name + '.msk';
        page.render(filename, {format: img_format, quality: img_quality});
        pretty_log('DONE!');
        phantom.exit();
    }
}

var page = require('webpage').create();
page.viewportSize = { width: city_width, height: city_height};
page.onConsoleMessage = function (msg){ log(msg) };

setTimeout(function() {
    log('Timeout exit :( ');
    phantom.exit();
}, 60*1000);

function renderMap(lat, lon, zoom) {
    console.log('Building map...');
    var mapDiv = document.createElement('div');
    mapDiv.id = "map";
    mapDiv.style.position = 'absolute';
    mapDiv.style.top = '0';
    mapDiv.style.left = '0';
    mapDiv.style.height = '100%';
    mapDiv.style.width = '100%';
    document.body.appendChild(mapDiv);
    var mapStyles = [
      {
        "featureType": "road.highway",
        "stylers": [
          { "visibility": "on" },
          { "color": "#ffffff" }
        ]
      },{
        "featureType": "landscape",
        "stylers": [
          { "visibility": "on" },
          { "color": "#000000" }
        ]
      },{
        "featureType": "water",
        "stylers": [
          { "visibility": "on" },
          { "color": "#000000" }
        ]
      },{
        "featureType": "transit",
        "stylers": [
          { "visibility": "on" },
          { "color": "#000000" }
        ]
      },{
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "elementType": "labels.text",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" },
          { "color": "#000000" }
        ]
      },{
        "featureType": "poi",
        "stylers": [
          { "color": "#808080" },
          { "visibility": "off" }
        ]
      },{
        "featureType": "transit.station",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "transit.line",
        "stylers": [
          { "visibility": "off" }
        ]
      }
    ];
    var latlng = new google.maps.LatLng(lat, lon);
    var mapOptions = { center: latlng, zoom: zoom, styles: mapStyles };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        console.log('Mask loaded...');
    });
}

var googleJs = 'https://maps.google.com/maps/api/js?sensor=false';
page.open('about:blank', function (status) {
    if (status == 'success') {
        log('Opening blank web page...');
        page.includeJs(googleJs, function() {
            log('googlemaps\' lib loaded!');
            page.evaluate(renderMap, city_lat, city_lon, parseInt(city_zoom));
        });
    }
});

