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

function isValidString(str1)
{
  return str1 != null && typeof str1 === "string" && str1.length > 0;
}

function fetchRV() {
 
// Fetch the CSV file and add markers to the map
Papa.parse(rvSheetUrl , {
    download: true,
    header: true,
    complete: function(results) {
        data.forEach(row => {
            var latitude = parseFloat(row.Latitude);
            var longitude = parseFloat(row.Longitude);
            var stateId = parseInt(row["State ID"]);
            var owner = row.Owner;
            var plate = row.Plate;
            var picture = row.Picture;

         if( isValidString(owner) && isValidString(plate) && isValidString(picture) && !isNaN( latitude ) && !isNaN( longitude ) && !isNaN( stateId ) && stateId > 0 )
         {
            rv.features[0].features.push({
                    "type": "Feature",
                    "properties": {
                        "id": latitude  + " " +  longitude  + " " +  owner + " " + "(ID: " + stateId + ") - " + plate,
                        "name": owner,
                        "external_id": picture,
                        "image_link": picture,
                        "description": plate
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            latitude,
                            longitude
                        ]
                    }
                });
        });
    }
        dataSynced();
    }
});
}
