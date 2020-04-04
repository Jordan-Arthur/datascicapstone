---
description: Map of State Flags - Resizing a background image on a leaflet map layer
---
#### Leaflet, geojson svg layer with background images

<div id="map"></div>

#### Add images to geojson file and have them display as the background of the polygon they are associated with, in this case states
````javascript
 {
      "type": "Feature",
      "properties": {
        "GEO_ID": "0400000US06",
        "STATE": "06",
        "NAME": "California",
        "LSAD": "",
        "CENSUSAREA": 155779.220000,
        "layers": [
          {
            "name": "flag",
            "img": "//upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_California.svg/200px-Flag_of_California.svg.png"
          },
          {
            "name": "bird",
            "img": "//upload.wikimedia.org/wikipedia/commons/thumb/a/aa/California_quail.jpg/200px-California_quail.jpg"
          },
          {
            "name": "flower",
            "img": "//upload.wikimedia.org/wikipedia/commons/thumb/e/ec/California_poppy.jpg/200px-California_poppy.jpg"
          }
        ]

      },
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [ -122.421439, 37.869969 ],
              [ -122.421341, 37.869946 ],
              [ -122.418470, 37.861764 ],
              [ -122.418470, 37.852721 ],
              [ -122.418698, 37.852717 ],
              [ -122.434403, 37.852434 ],
````              


#### Load json file and create SVG pattern defs that are used in the background
```javascript
(function() {
    $.getJSON("js/states_5m.json")
        .done(function(data) {
            ddd = data;
            $.each(data.features, function(index, d) {
                if (d.properties.flagimg) {
                    addpattern(d.properties.STATE, d.properties.flagimg);
                }
            });
        })
        .done(function(data) {
            geoJsonData = L.geoJson(data, {
                style: function(feature) {
                    return {
                        fillColor: "url(#p" + feature.properties.STATE + ")",
                        color: "#030303",
                        weight: 1,
                        opacity: 0.5,
                        fillOpacity: 0.3
                    };
                }

            }).addTo(map);
            adjustFills();
        });
})();
```



```javascript
function removeAndAdd() {
    geoJsonData.eachLayer(function(layer) {
        layer.removeFrom(map);
    });
    geoJsonData.eachLayer(function(layer) {
        layer.addTo(map);
    });
}
``` 
### something

  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin=""/>
   <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
   <script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.4.1.min.js"></script>
  <style>
  #map{height:700px; }
  </style>
  <svg id="svgdef">
</svg>  
<script src="js/statemapa.js"></script>


