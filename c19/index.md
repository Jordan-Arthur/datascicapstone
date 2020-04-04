```python
import shapefile
import requests
import json
from json import dumps

```


```python

def getCoDates(inObj):
    outerDates={}
    innerDates={}
    for cc in range(0,len(inObj['county']["dateReport"])):
        
        dths=tonum(inObj['county']["deaths"][cc])
        confir=tonum(inObj['county']["confirmed"][cc])
       
        if dths>0 or confir>0:
            if cc==0:
                innerDates = dict({cc:[confir,dths]})
            if cc>0:    
                innerDates.update(dict({cc:[confir,dths]}))
    outerDates.update(innerDates)
    return outerDates


```


```python
def tonum(s):
    outs=0
    if str(s).isnumeric():
        outs=s
    return outs
    
```


```python
datafile = "https://watsonads.cogads.weather.com/wa/covid19-bot2020-03-18-15-15-14-610/fetchvardata?type=aggregate&recordType=all&locationType=geocode&locationId="#-108.43,38.01

# divide ALAND by 2,589,988 to get sq miles

#county center
print("start")
reader = shapefile.Reader("d:/tl_2019_us_county/tl_2019_us_county.shp")
fields = reader.fields[1:]
field_names = [field[0] for field in fields]

xxx=0
buffer = []
for sr in reader.shapeRecords():
    xxx=xxx+1
    if xxx<10000:
        atr = dict(zip(field_names, sr.record))
        lat = round(float(atr["INTPTLAT"]), 2)
        lon = round(float(atr["INTPTLON"]), 2)
        if atr["GEOID"]=='06075':  #san francisco loction off?
            lat=37.77
            lon=-122.4
        geom = {} #{"type": "Point", "coordinates": [lon,lat]}
        jfile="{}{},{}".format(datafile,lat,lon)
        r = requests.get(jfile)
        json_data = json.loads(r.text)
        datedict={}
        
        if "country" in json_data:
            country=json_data['country']
        if "county" in json_data:
            datedict=getCoDates(json_data)
            countyname=json_data['county']['recordLocation'] 
            pop=json_data['county']['totalPopulation']
            #else print missing name
        if "state" in json_data:
            state=json_data['state']['recordLocation']            
            
        if len(datedict)>0:
            atr2 = { "GEOID":"0500000US"+atr["GEOID"] ,"NAME": countyname+", "+state ,"DATES":datedict,"POP":pop,"ALAND":atr["ALAND"],"CENTER":[lon,lat]}
            buffer.append(dict(type="Feature", geometry=geom, properties=atr2)) 

buffer.append(dict(type="country", country=country)) 
geojson = open(f"d:/covid_county_day.json", "w")
geojson.write(dumps({"type": "FeatureCollection",  "features": buffer,"country":country}, indent=2) + "\n")


geojson.close()
print("done")
```

    start
    


```python
f2 = open('d:/gz_2010_us_050_00_20m.json')
data2 = json.load(f2)
f2.close()


f = open('d:/covid_county_day.json')
data = json.load(f)
f.close()

for idv in data["features"]:
    if "properties" in idv:

        for idv2 in data2["features"]:
            if "properties" in idv2:
                if idv2["properties"]["GEO_ID"]==idv["properties"]["GEOID"]:
                    idv["geometry"]=idv2["geometry"]
         
            


        
geojson = open(f"d:/covid_countyboundry_day.json", "w")
geojson.write(dumps(data, indent=2) + "\n")
geojson.close()        


```


```python
f = open('d:/covid_countyboundry_day.json')
data = json.load(f)
f.close()

for idv in data["features"]:
    if "geometry" in idv:
        if "coordinates" not in idv["geometry"]:
            idv["geometry"]= {"type": "Polygon","coordinates": [[[-85.85189,33.498742]]]}

geojson = open(f"d:/covid_countyboundry_day2.json", "w")
geojson.write(dumps(data, indent=2) + "\n")
geojson.close()  
```


```python
# reverse the lon and lat
f = open('d:/covid_countyboundry_day2.json')
data = json.load(f)
f.close()

for idv in data["features"]:
    if "geometry" in idv:
        for c in idv["geometry"]["coordinates"]:
                if idv["geometry"]["type"] == 'Polygon':
                    for ci in c:
                        tmp=ci[0]
                        ci[0]=ci[1]
                        ci[1]=tmp

                if idv["geometry"]["type"] == 'MultiPolygon':
                    for ci in c:
                        for di in ci:
                            tmp=di[0]
                            di[0]=di[1]
                            di[1]=tmp

geojson = open(f"d:/covid_countyboundry_day3.json", "w")
geojson.write(dumps(data, indent=2) + "\n")
geojson.close()  
```


```python

```

##s

<style>
  #map{height:500px;width:950px;background-color:#ddd; }
   .circle {
    width: 50px;
    height: 30px;
	font-size:1em;
	color:white;
	text-align:center;
	line-height:30px;
	background-color:transparent;
}
  button{background-color:transparent;borders:none;}
  
 .center {
  margin: auto;
  padding: 10px;
}
  
  .title{
  color:white;
  font-weight:bold;
  font-size:2.25em;
  width:950px;
  }

  body{font-family: 'Roboto', sans-serif;background-color:#92b1ac;}
  
  </style>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin=""/>  
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet"> 
</head>
<body>
<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
<script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.4.1.min.js"></script>



<div class="title center">60 Days in 30 seconds Covid-19 by County Animation</div>
<div class="center" style="width:950px;"><span>Press "Start" below, hover, touch, or click county to see details</span></div>
<div  class="center" id="map"></div>

<div class="center">

<table style="font-size:1.25em;color:#fefefe;" class="center">
<colgroup>
<col style="width:150px">
<col style="width:150px">
<col style="width:150px">

</colgroup>
<tr>
	<td style="text-align:right;"><button id="startpan"><div class="circle">Start &#9655;</div></button></td>
	<td style="text-align:right;" colspan="2"><span style="color:white;font-size:1.5em;" id="timesince" ></span></td>
</tr>

<tr style="height:4em;"><td colspan="2" style="text-align:right;border-bottom:solid 1px white;">United States</td><td style="text-align:right;border-bottom:solid 1px white"><span id='countyname'>&nbsp</span><td></tr>
<tr>
	<td>Cases:</td>
	<td style="text-align:right;"><span id="infectedcount">0</span></td>
	<td style="text-align:right;"><span id="infectedcountC"></span></td>
	</tr>
<tr>
	<td>Deaths:</td>
	<td style="color:#fe0000;text-align:right;"><span id="facount" ></span></td>
	<td style="color:#fe0000;text-align:right;"><span id="facountC" ></span></td>
</tr>
<tr><td>Rate:</td><td style="text-align:right;"><span id="rate" >&nbsp;</span></td><td style="text-align:right;"><span id="rateC" >&nbsp;</span></td></tr>
<tr><td>Population:</td><td style="text-align:right;"><span id="population" ></span></td><td style="text-align:right;"><span id="populationC" ></span></td></tr>
<tr><td>Per 100k:</td><td style="text-align:right;"><span id="per100" ></span></td><td style="text-align:right;"><span id="per100C" ></span></td></tr>
</table>
</div>  
<div class="center" style="padding:30px;width:950px;">Data source: weather.com - https://watsonads.cogads.weather.com/wa/covid19-bot2020-03-18-15-15-14-610/fetchvardata?type=aggregate&recordType=all&locationType=geocode&locationId=34.69,-84.45, one file per county filtered and combined for use here.<div>
<script src="js/covid.js"></script>
