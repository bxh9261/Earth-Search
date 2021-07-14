// code from the next step will go here!
let geojson = {
    type: 'FeatureCollection',
    features: []
};
let map;
let markers = [];

function initMap(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiYnhoOTI2MSIsImEiOiJjazh5eWUxaGIxZHpzM2VvNjIwMDNmc2E2In0.wPiYqmP_Ov4Yv06LvaTZhg';
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [0,0],
      zoom: 0
    });
        // The 'building' layer in the mapbox-streets vector source contains building-height
    // data from OpenStreetMap.
    map.on('load', function() {
            // Insert the layer beneath any symbol layer.
            var layers = map.getStyle().layers;

            var labelLayerId;
            for (var i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                    labelLayerId = layers[i].id;
                    break;
                }
            }

            map.addLayer(
                {
                    'id': '3d-buildings',
                    'source': 'composite',
                    'source-layer': 'building',
                    'filter': ['==', 'extrude', 'true'],
                    'type': 'fill-extrusion',
                    'minzoom': 15,
                    'paint': {
                    'fill-extrusion-color': '#aaa',

                    // use an 'interpolate' expression to add a smooth transition effect to the
                    // buildings as the user zooms in
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.6
                    }
                },
            labelLayerId
            );
        });
    }

//add marker to map
function addMarker(coordinates,title,description,className,flag){
    let el = document.createElement('div');
    el.className = className;
    el.style.backgroundImage = "url(" + flag + ")";
    
    markers.push(new NamedMarker(new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({ offset:25 })
        .setHTML('<h3>' + title + '</h3><p>' + description + '<p>'))
        .addTo(map),
        title));
}

class NamedMarker {
  constructor(marker,name) {
    this.name = name;
    this.marker = marker;
  }
    
  getName(){
      return this.name;
  }
    
  getMarker(){
      return this.marker;
  }
}

//clear all markers, done every search
function clearMarkers(){
    for(let i = 0; i < markers.length; i++){
        markers[i].getMarker().remove();
    }
    markers = [];
}

//auto-open popup when selected by "random" or in the results box
function openPopup(name){

    for(let m of markers){
        if(m.getName() == name){
            if(!m.getMarker().getPopup().isOpen()){
                m.getMarker().togglePopup();
            }
        }
        else{
            if(m.getMarker().getPopup().isOpen()){
                m.getMarker().togglePopup();
            }
        }
    }
}

//fly to -- self explanatory
function flyTo(center = [0,0]){
    map.flyTo({center:center});
}

//set zoom level -- self explanatory
function setZoomLevel(value=0){
    map.setZoom(value);
}

//ok zoomer
function getZoomLevel(){
    return map.getZoom();
}

////set pitch and bearing -- I don't use this
function setPitchAndBearing(pitch=0,bearing=0){
    map.setPitch(pitch);
    map.setBearing(bearing);
}

export {initMap,setPitchAndBearing,setZoomLevel,getZoomLevel,flyTo,addMarker,clearMarkers,openPopup};