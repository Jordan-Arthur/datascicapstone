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
		layers: [custom2],
   	    zoomSnap: 0.25,
		attributionControl: false
    });
	
	L.control.attribution({
  position: 'topright'
}).addTo(map);
	
	
		

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

	function myFunction(item, index) {
		item.clearLayers();
	} 
	
	
	$('#startpan').click(function(){
		overlays["0"].clearLayers();
		overlays["1"].clearLayers();
		overlays["2"].clearLayers();
		overlays["3"].clearLayers();
		overlays["4"].clearLayers();
		overlays["5"].clearLayers();
		overlays["6"].clearLayers(); 
		
		
		
	   x=addcounties(500);
	  
	});
	
	



	function removeAnamationFromPath(){
	map.eachLayer(function(layer){
		if (layer.myData){
			var igroup=layer.myData.properties.IGROUP;
				if (isNaN(igroup)){igroup=0;}
				var igroupval =((0.15*(igroup+1))*.9).toFixed(2);
				layer.options.fillOpacity=igroupval;
				layer.options.opacity=0.75;

		}
	});
	
	}
	
	
	
	
	
	
	function addcounties(interv){
		countyList.length=0;	
		countyListA.length=0;	
		selectdateoffset=0;	
		var i = 59;
		var intervalId = setInterval(function(){

			if(i < 1){
			clearInterval(intervalId);
			removeAnamationFromPath();
			return "dod";
			}
			addday(i);
			selectdateoffset=i;
			i--;
		}, interv);
	
	}
	
	
	
	
	var selectdateoffset;
	var selectmarker;
	var daytot=0;
	var daytotd=0;
	function addday(offsetdate){
		$("#infectedcount").text(formatNumber(geoJsonData.country.confirmed[offsetdate]));
		$("#facount").text(formatNumber(geoJsonData.country.deaths[offsetdate]));
		$("#timesince").text(geoJsonData.country.dateReport[offsetdate]);
		
		
		var rateC=((geoJsonData.country.deaths[offsetdate])/(geoJsonData.country.confirmed[offsetdate]))*100;
		var per100C=geoJsonData.country.confirmed[offsetdate]/(geoJsonData.country.totalPopulation/100000);
			rateC=parseFloat(rateC).toFixed(2)+"%";
			per100C=parseFloat(per100C).toFixed(0);
			$("#rate").text(rateC);
			$("#per100").text(per100C)
		    $("#population").text(formatNumber(geoJsonData.country.totalPopulation));

		if (selectmarker){
		updateCounty(selectmarker);	
		}
		

		$.each(geoJsonData.features, function(index, d) {
			if (d.type=="Feature"){
				if (offsetdate in d.properties.DATES){
					if (d.properties.DATES[offsetdate][0] > 0){
						if (!countyList.includes(d.properties.GEOID)){
							countyList.push(d.properties.GEOID);
						if (d.properties.GEOID=='0500000US06037'){updateCounty(d);}  //LA default
							var igroup=d.properties.IGROUP;
							if (isNaN(igroup)){igroup=0;}
							var igroupval =((0.15*(igroup+1))*.9).toFixed(2);
							
							var polyline = L.polyline(d.geometry.coordinates,
								{color: '#34deeb',
								fill:true,
								fillColor: '#34deeb',
								fillOpacity: 0,
								opacity: 0,
								weight: 1,
								className:"a"+d.properties.GEOID}					
							).addTo(overlays[igroup.toString()]);
					
							var anicounty = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
							$(anicounty)	
								.attr("attributeName", "fill-opacity")
								.attr("from" ,"0")
								.attr("to" ,igroupval )
								.attr("begin" ,tsi+"s")
								.attr("dur" ,"2s")
								.attr("fill","freeze");		
							$(".a"+d.properties.GEOID).append(anicounty);

							
							 anicounty = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
							$(anicounty)	
								.attr("attributeName", "stroke-opacity")
								.attr("from" ,"0")
								.attr("to" ,"0.75")
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
						//			$(".a"+d.properties.GEOID).attr("stroke","red");
						//			$(".a"+d.properties.GEOID).attr("stroke-opacity","0.1");
						
								}
							}
						}
				
					}
				}
			
			}
			
			
			
			
		})
		};

	

 
		
	function cdetail(e){
		var marker = e.target;
		updateCounty(marker.myData)
		selectmarker=marker.myData;
	};
	
	function updateCounty(aa){
		
		$("#countyname").text(aa.properties.NAME);
		if (selectdateoffset in aa.properties.DATES){
			$("#infectedcountC").text(formatNumber(aa.properties.DATES[selectdateoffset][0]));
			$("#facountC").text(formatNumber(aa.properties.DATES[selectdateoffset][1]));
			$("#populationC").text(formatNumber(aa.properties.POP));

			var rateC=(aa.properties.DATES[selectdateoffset][1]/aa.properties.DATES[selectdateoffset][0])*100;
			var per100C=aa.properties.DATES[selectdateoffset][0]/(aa.properties.POP/100000);
			rateC=parseFloat(rateC).toFixed(2)+"%";
			per100C=parseFloat(per100C).toFixed(0);
			$("#rateC").text(rateC);
			$("#per100C").text(per100C);
			
			
			
		}
		
	}
	
	
	
    function addk(){
		  $.getJSON("js/covid_countyboundry_day4.json") 
            .done(function(data) {
					geoJsonData=data;
					
                })
				
				
				
			            
		 .done(function(data) {
               
                var baseLayers = {
                    "Simple": Stadia_AlidadeSmooth,
					"Green": custom2,
                };
				
				overlays["0"] = L.featureGroup().addTo(map);
				overlays["1"] = L.featureGroup().addTo(map);
				overlays["2"] = L.featureGroup().addTo(map);
				overlays["3"] = L.featureGroup().addTo(map);
				overlays["4"] = L.featureGroup().addTo(map);
				overlays["5"] = L.featureGroup().addTo(map);
				overlays["6"] = L.featureGroup().addTo(map);
				
				
                L.control.layers(baseLayers, overlays,{position: 'bottomright', collapsed: false}).addTo(map);
				map.inertia = false;
			    ;
            });
	 }
	
	var tsi=-0.5;
	var ts = setInterval(function(){
			tsi=tsi+0.5;
		}, 500);

});



