$(document).ready(function() {

	


var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxZoom: 10,
	minZoom: 3,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});




var tl2="http://{s}.sm.mapstack.stamen.com/(toner-background,$eee[@70],$b3e6dd[hsl-color@60])[hsl-color]/{z}/{x}/{y}.png"
var tlattr='<span style="background=color:#92b1ac">&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a></span>'

 var custom2 = L.tileLayer(tl2, {
        attribution: tlattr,
        subdomains: 'abcd',
        minZoom: 3,
        maxZoom: 10,
        ext: 'png'
    });

//

    var nomap = L.tileLayer("none", {
        minZoom: 4,
        maxZoom: 10,
        attribution: "none",
    });

    var map = L.map('map', {
        center: [39, -96],
        zoom: 4.5,
		layers: [Stadia_AlidadeSmooth],
   	    zoomSnap: 0.25
    });
	
	var tsi=0.0;
	var ts = setInterval(function(){
			tsi=tsi+0.5;
		}, 500);
	

    var layName = [];
    var overlays = {};
	var geoJsonData;
	


    
	//addjson();
	addk();
	
	let countyList = [];
	let countyListA = [];
	

	var curday = function(daysback){
		 var dt = new Date();
		 dt.setDate( dt.getDate() - daysback );
	 
	     return dt.getMonth()+1 + '-' + dt.getDate() + '-' + dt.getFullYear();
	};
	
	
	function formatNumber(num) {
			return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	}

	
	
	function addcounties(interv){
		countyList.length=0;	
		countyListA.length=0;	
		overlays["c"].clearLayers();
			
		var i = 59;
		var intervalId = setInterval(function(){

			if(i < 1){
			clearInterval(intervalId);
			}
			addday(i)
			
			i--;
		}, interv);
		
	}
	
	var daytot=0;
	var daytotd=0;
	function addday(offsetdate){
		$("#infectedcount").text(formatNumber(geoJsonData.country.confirmed[offsetdate]));
		$("#facount").text(formatNumber(geoJsonData.country.deaths[offsetdate]));
		$("#timesince").text(geoJsonData.country.dateReport[offsetdate]);

		$.each(geoJsonData.features, function(index, d) {
			if (d.type=="Feature"){
				if (offsetdate in d.properties.DATES){
					if (d.properties.DATES[offsetdate][0] > 0){
						if (!countyList.includes(d.properties.GEOID)){
							countyList.push(d.properties.GEOID);
							var polyline = L.polyline(d.geometry.coordinates,
								{color: '#34deeb',
								fill: '#34deeb',
								weight: 1,
								opacity: 1,
								fillOpacity: 0.5,
								className:"a"+d.properties.GEOID}					
							).addTo(overlays["c"]);
					
					
						var anicounty = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
						$(anicounty)
							.attr("attributeName", "fill")
							.attr("from" ,"#ffffff")
							.attr("to" ,"#34deeb")
							.attr("begin" ,tsi+"s")
							.attr("dur" ,"2s")
							.attr("fill","freeze");
							
						$(".a"+d.properties.GEOID).append(anicounty); 
						polyline.on('mouseover', cdetail);
						polyline.on('click', cdetail);
						polyline.myData=d;
						
						}
						else
						{
							if (d.properties.DATES[offsetdate][1] > 0){
								if (!countyListA.includes(d.properties.GEOID)){
									countyListA.push(d.properties.GEOID);
									$(".a"+d.properties.GEOID).empty();
									var anicounty = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
									$(anicounty)
										.attr("attributeName", "fill")
										.attr("from" ,"#34deeb")
										.attr("to" ,"red")
										.attr("begin" ,tsi+"s")
										.attr("dur" ,"2s")
										.attr("fill","freeze");
										$(".a"+d.properties.GEOID).append(anicounty);				
								}
							}
						}
				
					}
				}
			
			}
			
			
			
			
		})
		};

	$('#startpan').click(function(){
		addcounties(500);
	});

		
	function cdetail(e){
		var marker = e.target;
		var aa = marker.myData;
		
		$("#countyname").text(aa.properties.NAME);
		if ("0" in aa.properties.DATES){
		$("#infectedcountC").text(formatNumber(aa.properties.DATES[0][0]));
		$("#facountC").text(formatNumber(aa.properties.DATES[0][1]));
		$("#populationC").text(formatNumber(aa.properties.POP));
		var rateC=(aa.properties.DATES[0][1]/aa.properties.DATES[0][0])*100;
		var per100C=aa.properties.DATES[0][0]/(aa.properties.POP/100000);
		rateC=parseFloat(rateC).toFixed(2)+"%";
		per100C=parseFloat(per100C).toFixed(0);
		$("#rateC").text(rateC);
		$("#per100C").text(per100C)
		
		
		$("#infectedcountCL").text("Confirmed");
		$("#facountCL").text("Deaths");
		$("#populationCL").text("Population");
		$("#rateCL").text("Rate");
		$("#per100CL").text("Cases per 100k")
		}
	}
	
	
	
    function addk(){
		  $.getJSON("js/covid_countyboundry_day3.json") 
            .done(function(data) {
					geoJsonData=data;
					
                })
				
				
				
			            
		 .done(function(data) {
               
                var baseLayers = {
                    "Simple": Stadia_AlidadeSmooth,
					"Green": custom2,
                };
				overlays["c"] = L.featureGroup().addTo(map);
				
                L.control.layers(baseLayers, overlays,{position: 'bottomright', collapsed: true}).addTo(map);
				map.inertia = false;
			    ;
            });
	 }







///***********************************************************************************************////
     function addj(){
		  $.getJSON("js/covid_countyboundry_day2.json") 
            .done(function(data) {
		 		   L.geoJson(data, {
						style: function (feature) {
						return {
  						    fillColor: "url(#p" + feature.properties.GEOID + ")",
							color: "#bb0000",
							weight: 1,
							opacity: 1,
							fillOpacity: 0,
							iddd:12
							};
					}
			}).addTo(map);
			
			var latlngs = [
    [45.51, -122.68],
    [37.77, -122.43],
    [34.04, -118.2]
];

var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
// zoom the map to the polyline
map.fitBounds(polyline.getBounds());
			
			
			}
			
			)
		 .done(function(data) {
               
                var baseLayers = {
                    "Standard": baseMap,
                    "Simple": Stamen_TonerBackground,
					"Green": custom2,
                    "No Map": nomap
                };

                L.control.layers(baseLayers, overlays,{collapsed: false}).addTo(map);
				map.inertia = false;
				
            });
	 }



    function addjson() {
        $.getJSON("js/states_5ma.json") //"js/gz_2010_us_050_00_20m.json") 
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
					//if (lcount==0){
					overlays[element].addTo(map);
					//}
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
					"Green": custom2,
                    "No Map": nomap
                };

                L.control.layers(baseLayers, overlays,{collapsed: false}).addTo(map);
				map.inertia = false;
				
            });

    };


    function addlayergroup(data, groupn, fillcode) {
        L.geoJson(data, {
            style: function(feature) {
                return {
                    fillColor: "url(#p" + fillcode + feature.properties.STATE + ")",
                    color: "#000000",
                    weight: 5,
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
			.attr("class", "stateimage")
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
/*

    
    map.on("overlayadd", function() {
        adjustFills();
    });

	map.on("overlayremove", function() {
        adjustFills();
    });


	map.on("moveend", function() {
		  for (var i in overlays) {
            if (map.hasLayer(overlays[i])) {
                map.removeLayer(overlays[i]);
                map.addLayer(overlays[i]);
            }
        }
    });	
*/
/*	
	map.on("mouseup", function() {
		adjustcenter();
		adjustFills();
    });	
	
	map.on("keyup", function() {
//		adjustcenter();
//		adjustFills();
    });	

 function adjustcenter() {
	mc=map.getCenter();
    map.panTo(L.latLng(mc.lat, mc.lng+0.001));
 };	

*/

});



