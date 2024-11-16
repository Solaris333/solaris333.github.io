 // URL of the published Google Sheet (ending in &output=csv)
var rvSheetUrl = "https://docs.google.com/spreadsheets/d/1zil5Dvvok5j8Z7BGpaDqt0BykUgoisaUhwU5lS5nJkc/pub?output=csv&gid=1633412963#gid=1633412963";


var rv = {
    "type": "FeatureCollection",
    "features": [
        {
            "features": [
                {
                }
            ]
        }
    ]
};

// Fetch the CSV file and add markers to the map
Papa.parse(rvSheetUrl , {
    download: true,
    header: true,
    complete: function(results) {
        for( var i = 0; i < results.data.length; i++ )
        {
            var lat = parseFloat(results.data[i].Latitude);
            var lon = parseFloat(results.data[i].Longitude);
            var stateId = parseInt(results.data[i].StateID);
            var owner = results.data[i].Owner;
            var plate = results.data[i].Plate;
            var picture = results.data[i].Picture;

            rv.features[0].features[ i ] = {
                    "type": "Feature",
                    "properties": {
                        "id": lat  + " " +  lon  + " " +  owner + " " + "(ID: " + stateId + ") - " + plate,
                        "name": owner,
                        "external_id": picture,
                        "image_link": picture,
                        "description": plate
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            lat,
                            lon
                        ]
                    }
                };
        }
        
    }
});
