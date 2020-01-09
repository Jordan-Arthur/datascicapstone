---
description: State Flags Map
---
<head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin=""/>
   <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
   <script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.4.1.min.js"></script>
  <style>
  #map{ width: 960px; height:960px; }
  </style>
</head>
<body>
  <div id="map"></div>
  
  <svg id="svgdef">
	<defs>
    <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
    <feComponentTransfer in=SourceAlpha>
      <feFuncA type="table" tableValues="1 0" />
    </feComponentTransfer>
    <feGaussianBlur stdDeviation="4"/>
    <feOffset dx="0" dy="5" result="offsetblur"/>
    <feFlood flood-color="rgb(0, 0, 0)" result="color"/>
    <feComposite in2="offsetblur" operator="in"/>
    <feComposite in2="SourceAlpha" operator="in" />
    <feMerge>
      <feMergeNode in="SourceGraphic" />
      <feMergeNode />
    </feMerge>
  </filter>
  </defs>
</svg>


<script src="statemap.js"></script>
</body>
