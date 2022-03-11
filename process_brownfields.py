import json

with open('Military.geojson') as infile:
    data = json.load(infile)

for feature in data['features']:
    site_id = feature['properties']['Site_ID']
    with open(f'brownfields/{site_id}.html', mode='w') as outfile:
        outfile.write(f'''
            <html>
            <head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
                <link rel="stylesheet" href="brownfields.css">
            </head>
            <body>
                <h1>{feature['properties']['Site_Name']}</h1>
                <div id="content">
                    <div id="map"></div>
                    <div>
                        <p>Key Information:</p>
                        <dl>
                            <dt>Site ID</dt>
                            <dd>{feature['properties']['Site_ID']}</dd>
                            <dt>Acres</dt>
                            <dd>{feature['properties']['Acres']}</dd>
                            <dt>Urban Area</dt>
                            <dd>{feature['properties']['Urban_Area']}</dd>
                            <dt>Urban Area Population</dt>
                            <dd>{feature['properties']['Urban_Area_Population']}</dd>
                            <dt>Distance to Urban Area</dt>
                            <dd>{feature['properties']['Distance_to_Urban_Area']}</dd>
                            <dt>Landcover Type</dt>
                            <dd>{feature['properties']['LC_Type']}</dd>
                            <dt>RE Powering Profile</dt>
                            <dd>{feature['properties']['RE_Powering_Profile']}</dd>
                            


                        </dl>
                    
                    
                    </div>
                </div>
            
                
    

                <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
                <script>
                    let geojsonPoint = {json.dumps(feature['geometry'])};
                </script>
                <script src="brownfields.js"></script>
            </body>
            </html>
        ''')