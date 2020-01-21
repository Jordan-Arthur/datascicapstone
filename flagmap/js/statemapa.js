$(document).ready(function() {

    var baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        minZoom: 3,
        maxZoom: 10,
        attribution: 'Map data &copy; <a  href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11'
    });

    var Stamen_TonerBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 3,
        maxZoom: 10,
        ext: 'png'
    });

    var nomap = L.tileLayer("none", {
        minZoom: 3,
        maxZoom: 10,
        attribution: "none",
    });

    var map = L.map('map', {
        center: [39.4, -106.4],
        zoom: 5,
		layers: [Stamen_TonerBackground]
    });


    var layName = [];
    var overlays = {};
	var geoJsonData;
    
	addjson();
  

    function addjson() {
        $.getJSON("js/states_5ma.json")
            .done(function(data) {
                $.each(data.features, function(index, d) {
                    for (var k in d.properties["layers"]) {
                        var newItem = d.properties["layers"][k].name;
                        newItem = newItem.charAt(0).toUpperCase() + newItem.slice(1)
                        layName.indexOf(newItem) === -1 ? layName.push(newItem) : null;
                    }
                });
				var lcount=0;
                layName.forEach(function(element) {
                    overlays[element] = L.featureGroup();
				//	if (lcount==0){
					overlays[element].addTo(map);
				//	}
					lcount++;
                });
            })
            .done(function(data) {
                geoJsonData = data;
                $.each(data.features, function(index, d) {
                    for (var k in d.properties["layers"]) {
                        for (var i in overlays) {
                            if (i.toLowerCase() == d.properties["layers"][k].name) {
                                addpattern(i.toLowerCase(), d.properties.STATE, d.properties["layers"][k].img);
                            }
                        }
                    };
                });
            })
            .done(function(data) {
                for (var i in overlays) {
                    var layname = i.toLowerCase();
                    addlayergroup(data, overlays[i], layname);
                };
            })
            .done(function(data) {
                adjustFills();

                var baseLayers = {
                    "Standard": baseMap,
                    "Simple": Stamen_TonerBackground,
                    "No Map": nomap
                };

                L.control.layers(baseLayers, overlays,{collapsed: false}).addTo(map);

            });

    };


    function addlayergroup(data, groupn, fillcode) {
        L.geoJson(data, {
            style: function(feature) {
                return {
                    fillColor: "url(#p" + fillcode + feature.properties.STATE + ")",
                    color: "#ffffff",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.3
                };
            }
        }).addTo(groupn);
    };



    function addpattern(pattype, theid, theurl) {
        var s = document.getElementById('svgdef');
        var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        var pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        var image1 = document.createElementNS('http://www.w3.org/2000/svg', 'image');

        $(pattern).attr("id", "p" + pattype + theid)
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "1")
            .attr("height", "1");

        $(image1).attr("id", "sf" + pattype + theid)
            .attr("href", theurl)
            .attr("preserveAspectRatio", "xMidYMax slice");



        defs.appendChild(pattern);
        pattern.appendChild(image1);
        s.appendChild(defs);

    }

    function adjustFills() {
		var oncount=0.00
			for (var i in overlays) {
				if (map.hasLayer(overlays[i])) {
				oncount++;	
				}
			};
		var op= (oncount>0) ? 1/oncount : 0.5;
	   
	   $.each(geoJsonData.features, function(index, d) {
	        for (var k in d.properties["layers"]) {
                for (var i in overlays) {
                    if (i.toLowerCase() == d.properties["layers"][k].name) {
                        adjustpattern(i.toLowerCase(), d.properties.STATE,op);
                    }
                }
            };
        });

    }


    function adjustpattern(pattype, theid,op) {
        var item = document.querySelector('[fill="url(#p' + pattype + theid + ')"]');
			$(item).attr("fill-opacity", op);
        if (item) {
			var bb = item.getBBox();
			var dh = (bb.height >= bb.width) ? 	bb.height : bb.width; 
			var elem = document.getElementById('sf' + pattype + theid)
			$(elem).attr("x", "0")
				.attr("height", dh)
				.attr("width", dh);
        }
    }


    map.on('zoomend', function() {
        for (var i in overlays) {
            if (map.hasLayer(overlays[i])) {
                map.removeLayer(overlays[i]);
                map.addLayer(overlays[i]);
            }
        }

    });


    map.on("overlayadd", function() {
        adjustFills();
    });

	map.on("overlayremove", function() {
        adjustFills();
    });

});
