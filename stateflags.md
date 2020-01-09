---
description: Map of State Flags - Resizing a background image on a leaflet map layer
---
<figure>
<iframe src="flags.html"></iframe>
</figure>

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
