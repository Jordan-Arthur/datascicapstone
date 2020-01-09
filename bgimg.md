<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1"
     baseProfile="full"
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     xmlns:ev="http://www.w3.org/2001/xml-events">
    <title>Text Pattern Fill Example</title>
    <defs>
        <pattern id="img1" patternUnits="userSpaceOnUse" width="600" height="450">
            <image xlink:href="daisy-grass-repeating-background.jpg" x="0" y="0"
                width="600" height="450" /><!-- Image from http://silviahartmann.com/background-tile/6-grass-meadow-tile.php-->
        </pattern>
    </defs>
    <path d="M5,50
             l0,100 l100,0 l0,-100 l-100,0
             M215,100
             a50,50 0 1 1 -100,0 50,50 0 1 1 100,0
             M265,50
             l50,100 l-100,0 l50,-100
             z"
          fill="url(#img1)" />
        
</svg>
