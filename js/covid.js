	$(document).ready(function() {
		
	
	var overlays = {};
	var geoJsonData;
	var countyList = [];
	var countyListA = [];
	var selectdateoffset;
	var selectmarker;
	var daytot=0;
	var daytotd=0;
	var minZ=4;
	var maxZ=7;


	var baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
			attribution: 'Map data &copy; <a  href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			id: 'mapbox/streets-v11'
		});

	var tl2="http://{s}.sm.mapstack.stamen.com/(toner-background,$eee[@70],$b3e6dd[hsl-color@60])[hsl-color]/{z}/{x}/{y}.png"
	var tlattr='<span style="background=color:#92b1ac">&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a></span>'

	

	var nomap = L.tileLayer("none", {
			attribution: "none",
		});

	var map = L.map('map', {
			center: [39, -96],
			zoom: 4.5,
			minZoom: minZ,
			maxZoom: maxZ,
			zoomSnap: 0.25,
			attributionControl: false
		});
		
		L.control.attribution({
		position: 'topright'
	}).addTo(map);
		
	map.createPane('labels');
	map.getPane('labels').style.zIndex = 650;
	map.getPane('labels').style.pointerEvents = 'none';
	
	
	var positronLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        pane: 'labels'
	}).addTo(map);
	
	
	var custom2 = L.tileLayer(tl2, {
		attribution: tlattr,
		subdomains: 'abcd',
		ext: 'png',
	}).addTo(map);	
	
	addk();

	

	function adjustControlLayer(){
		let pgg='#e3faf6'; //'#e4ebc5';
		
		$('.leaflet-control-layers').css('background-color',pgg);
		$('.leaflet-control-layers-expanded').css('background-color',pgg);
		$('.leaflet-control-layers-separator').after('<div style="width: 90%;margin: 5%;">Cases per 100k</div>');
		
		$('.leaflet-control-layers-selector:checkbox').each(function( index ) {
			let ubgcolor='rgba(255, 0, 0,' + calcOpacity(index+1) + ')';
			$(this).parent().parent().prepend("<div style='background-color:"+ubgcolor+";width:110px;height:20px;float:left;'>&nbsp</div>");
			$(this).css('margin-left','-100px');
		});
		
	};


	function refreshLayers(){
		$.each(overlays, function(index, d) {
			d.clearLayers();
		});
	}

	
	function addCounties(interv){
		countyList.length=0;	
		countyListA.length=0;	
		selectdateoffset=0;	
		let i = 59;
		let intervalId = setInterval(function(){

			if(i < 0){
			clearInterval(intervalId);
			return ;
			}
			//console.log(i);
			
			addday(i);
			selectdateoffset=i;
			i--;
		}, interv);
	
	}
		
	function addCountiesToMap(loadMode, revealDuration){
		$.each(geoJsonData.features, function(index, d) {
			
			if (d.type=="Feature"){
				let igroup=d.properties.IGROUP;
				let start=d.properties.START;
				if (isNaN(igroup)){igroup=0;}
				let igroupval =calcOpacity(igroup+1) 
							

				let polyline = L.polyline(d.geometry.coordinates,
					{color: 'red',
					fill:'white',
					fillColor: 'red', //'red',
					fillOpacity:(revealDuration<0? 0: igroupval),
					opacity: (revealDuration<0? 0: igroupval),
					weight: .5,
					className:"a"+d.properties.GEOID,
					}
					).addTo(overlays[d.properties.IGROUPL]);
		
		
				let anicounty = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
				
				$(anicounty)	
						.attr("attributeName", "stroke-opacity")
						.attr("values", "0 ; 0 ;"+ igroupval)
						.attr("keyTimes", "0; " + (1-(start/60)) + ";  1")
						.attr("begin" , "startButton.click") 
						.attr("dur" , revealDuration+ "s") 
						.attr("fill","freeze");		
					$(".a"+d.properties.GEOID).append(anicounty);
				
				anicounty = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
				$(anicounty)	
						.attr("attributeName", "fill-opacity")
						.attr("values", "0 ; 0 ;"+ igroupval)
						.attr("keyTimes", "0; " + (1-(start/60)) + ";  1")
						.attr("begin" , "startButton.click") 
						.attr("dur" , revealDuration+"s") 
						.attr("fill","freeze");		
					$(".a"+d.properties.GEOID).append(anicounty);
	
				polyline.on('mouseover', cdetail);
				polyline.on('click', cdetail);
				polyline.myData=d;
	
			}
		});	
	}

	
	function addday(offsetdate){
		$("#infectedcount").text(formatNumber(geoJsonData.country.confirmed[offsetdate]));
		$("#facount").text(formatNumber(geoJsonData.country.deaths[offsetdate]));
		$("#timesince").text(geoJsonData.country.dateReport[offsetdate]);
		
		let rateC=((geoJsonData.country.deaths[offsetdate])/(geoJsonData.country.confirmed[offsetdate]))*100;
		let per100C=geoJsonData.country.confirmed[offsetdate]/(geoJsonData.country.totalPopulation/100000);
			
			rateC=parseFloat(rateC).toFixed(2)+"%";
			per100C=parseFloat(per100C).toFixed(0);
			$("#rate").text(rateC);
			$("#per100").text(per100C)
			$("#population").text(formatNumber(geoJsonData.country.totalPopulation));

		if (selectmarker){
		updateCounty(selectmarker);	
		}
	};

	

 
		
	function cdetail(e){
		
		let marker = e.target;
		updateCounty(marker.myData)
		selectmarker=marker.myData;
	};
	
	function updateCounty(aa){
		//selectdateoffset=0;
		$("#countyname").text(aa.properties.NAME);
		if (selectdateoffset in aa.properties.DATES){
			$("#infectedcountC").text(formatNumber(aa.properties.DATES[selectdateoffset][0]));
			$("#facountC").text(formatNumber(aa.properties.DATES[selectdateoffset][1]));
			$("#populationC").text(formatNumber(aa.properties.POP));

			let sqmi=(aa.properties.ALAND/2589988)
			$("#perSMC").text(formatNumber((aa.properties.DATES[selectdateoffset][0]/sqmi).toFixed(0)));
			
			let rateC=(aa.properties.DATES[selectdateoffset][1]/aa.properties.DATES[selectdateoffset][0])*100;
			let per100C=aa.properties.DATES[selectdateoffset][0]/(aa.properties.POP/100000);
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
				let baseLayers = {
				"Green": custom2,
				"No Map": nomap,
				"Labels":positronLabels
				};
			
			$.each(geoJsonData.country.igroups, function(index, d) {
				overlays[d] = L.featureGroup().addTo(map);
			});
			
			L.control.layers(baseLayers, overlays,{position: 'bottomright', collapsed:true}).addTo(map);
			map.inertia = false;
			adjustControlLayer();
			addCountiesToMap(true,0.01);
			document.getElementById("startButton").dispatchEvent(new Event('click'));
		})
	 }
	

//Events		
		
	map.on("overlayremove", function(e) {	});
	map.on('baselayerchange', function (e) {	});
	map.on("overlayadd", function() { });
	

	$('#startpan').click(function(){
		refreshLayers();
		addCountiesToMap(true,15);
		addCounties(250);
		document.getElementById("startButton").dispatchEvent(new Event('click'));			
	});


//Helpers

	var curday = function(daysback){
		 let dt = new Date();
		 dt.setDate( dt.getDate() - daysback );
		 return dt.getMonth()+1 + '-' + dt.getDate() + '-' + dt.getFullYear();
	};
	
	
	function formatNumber(num) {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	}
	function calcOpacity(lev){
		return ((0.15*(lev))*.7).toFixed(2);
	}
	

});



