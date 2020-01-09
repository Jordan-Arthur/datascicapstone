
var ddd;
var geoJsonData;

$( document ).ready(function() {
   


// initialize the map
var map = L.map('map').setView([39.4, -106.4], 5);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a  href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11'
}).addTo(map);


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



function addpattern(theid, theurl) {
    var s = document.getElementById('svgdef');
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute("id", "p" + theid);
    pattern.setAttribute("x", "0");
    pattern.setAttribute("y", "0");
    pattern.setAttribute("width", "1");
    pattern.setAttribute("height", "1");

    var image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute("id", "sf" + theid);
    image.setAttribute("href", theurl);
    //image.setAttribute("preserveAspectRatio","xMidYMid slice");
    defs.appendChild(pattern);
    pattern.appendChild(image);
    s.appendChild(defs);

}

function adjustFills() {
    $.each(ddd.features, function(index, d) {
        if (d.properties.flagimg) {
            adjustpattern(d.properties.STATE);
        }
    });

}


function adjustpattern(theid) {
    var item = document.querySelector('[fill="url(#p' + theid + ')"]');
    var bb = item.getBBox();
    var newheight = bb.height;
    var newwidth = bb.width;
    var newv = 0;
    var newx = 0;
    if (newheight > newwidth) {
        newv = newheight;
        newx = newv * -0.33;
    } else {
        newv = newwidth;
        newx = newv * -0.33;
    }


    var elem = document.getElementById('sf' + theid);
    elem.setAttribute("height", newv);
    elem.setAttribute("x", newx);
}


map.on('zoomend', function(ev) {
    removeAndAdd();
    adjustFills();
});

map.on("dragend", function() {
    removeAndAdd();
    adjustFills();
});


function removeAndAdd() {
    geoJsonData.eachLayer(function(layer) {
        layer.removeFrom(map);
    });
    geoJsonData.eachLayer(function(layer) {
        layer.addTo(map);
    });
}
});
