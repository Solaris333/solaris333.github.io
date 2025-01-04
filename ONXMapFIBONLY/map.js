// Step 0:
// Add all feature geoJSON and layer logic to the `index.html`
// In this example this is:
// * `marker/collectibles.js`
// * `marker/information.js`
// * `marker_logic/collectibles.js`
// * `marker_logic/information.js`

// Step 1:
// Initialize the map with basic information
var interactive_map = new InteractiveMap('map', {
    // This will limit automatic zooming to this zoom level
    max_good_zoom: 6,
    // This is the max zoom the map will allow
    max_map_zoom: 8,
    website_source: 'https://solaris333.github.io/ONXMapFIBONLY/',
    website_subdir: 'ONXMapFIBONLY',
    attribution: `
    <li><a href="https://www.example.com/index.html">$Thing</a> used by <a href="https://www.example.com/index.html">$person</a> under <a href="https://www.example.com/index.html">$license</a></li>
    <li>This project uses sample images from <a href="https://picsum.photos/">picsum.photos</a></li>
`
});

// Step 2:
// Add at least one tile layer
//
// generate them from an image with (don't forget do adjust the zoom levels `-z`):
// https://github.com/commenthol/gdal2tiles-leaflet
// `./gdal2tiles.py -l -p raster -w none -z 3-5 full_map.jpg map_tiles`
interactive_map.addTileLayer('Atlus', {
    minNativeZoom: 2,
    maxNativeZoom: 5,
    attribution: 'Map from <a href="https://gtaforums.com/topic/595113-high-resolution-maps-satellite-roadmap-atlas/">AUS-damox</a>'
}, url = `../ONXMap/map_tiles_atlus_names/{z}/{x}/{y}.png`);
interactive_map.addTileLayer('Satellite', {
    minNativeZoom: 2,
    maxNativeZoom: 5,
    attribution: 'Map from <a href="https://gtaforums.com/topic/595113-high-resolution-maps-satellite-roadmap-atlas/">AUS-damox</a>'
}, url = `../ONXMap/map_tiles_satellite_names/{z}/{x}/{y}.png`);

// Step 2.5 (optional):
// Add more tile layer
// interactive_map.addTileLayer('Overview', {
//     minNativeZoom: 2,
//     maxNativeZoom: 4,
//     attribution: 'Map from <a href="https://www.example.com/index.html">$source</a>'
// }, 'overview_tiles/{z}/{x}/{y}.png');

// Step 3:
// Add at least one marker layer
// The order matters - they will appear in this order in the sidebar and layer control
// See `marker_logic/collectibles.js` for a really basic layer

//addCollectibles(interactive_map);

// Step 3.5 (optional):
// Add more marker layer
// See `marker_logic/information.js` for more advanced technics

//addInformation(interactive_map);

addMedical(interactive_map);
addPolice(interactive_map);
addGovernment(interactive_map);
addFood(interactive_map);
addFire(interactive_map);
addRepair(interactive_map);
addTow(interactive_map);
addHousing(interactive_map);
addGas(interactive_map);
addClubs(interactive_map);
addClothing(interactive_map);
addGun(interactive_map);
addStores(interactive_map);
addJobs(interactive_map);
addBanks(interactive_map);
addHunting(interactive_map);
addFarming(interactive_map);
addReserve(interactive_map);
addLandmarks(interactive_map);
addCitylimits(interactive_map);
addGarage(interactive_map);

//RESTRICTED INFO
addPhones(interactive_map);
addMarabunta(interactive_map);

async function fetchFeatureData(files) {
    const parseCSVAsync = (file) => {
        return new Promise((resolve, reject) => {
     if( isValidString(file.csv)
        && isValidString(file.feature_id)
        && isValidString(file.feature_name)
        && isValidString(file.id)
        && isValidString(file.name)
        && isValidString(file.external_id)
        && isValidString(file.image_link)
        && isValidString(file.description)
        && isValidString(file.latitude)
        && isValidString(file.longitude)
        && isValidString(file.feature_icon)
       )
      {
            Papa.parse(file.csv, {
                download: true,
                header: true,
                complete: function(results) {
                    const data = results.data;
                    features[file.feature_id] = featureInitData;
   data.forEach(row =>
    {
     var latitude = parseFloat(row[file.latitude]);
     var longitude = parseFloat(row[file.longitude]);
     var id = row[file.id];
     var name = row[file.name];
     var external_id = row[file.external_id];
     var image_link = row[file.image_link];
     var description = row[file.description];
     
     if( isValidString(id)
        && isValidString(name)
        && isValidString(external_id)
        && isValidString(image_link)
        && isValidString(description)
        && !isNaN( latitude )
        && latitude != 0.0
        && !isNaN( longitude )
        && longitude != 0.0
       )
      {
       features[file.feature_id].features[0].features.push(
        {
         "type": "Feature",
         "properties":
          {
           "id": id,
           "name": name,
           "external_id": external_id,
           "image_link": image_link,
           "description": description
           },
         "geometry":
         {
          "type": "Point",
          "coordinates":
           [
            latitude,
            longitude
           ]
         }
        });
      }
    });
                    addFeatures(interactive_map, file.feature_id, file.feature_name, file.feature_icon, features[file.feature_id]);
                    //console.log("Parsed file:", results);
                    resolve(results);
                },
                error: function(error) {
                    reject(error);
                }
            });
          }
        else
         {
                resolve();
         }
        });
    };

    try {
        const results = await Promise.all(files.map(parseCSVAsync));
        // Step 4:
        // Finalize the map after adding all layers.
        interactive_map.finalize();
        
        // Step 5:
        // Open `index.html` to view the map.
        // You can now add additional layers by clicking the edit button in the lower left
        // While editing a layer you can export the geoJSON in the toolbar on the right when you're done
        // and add them here to step 3 to display them fixed for all users.
    } catch (error) {
        console.error("Error parsing files:", error);
    }
}

// Parse the feature index file
Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vRuwF91bofFvKTAtrfEuzELqzJOQuQMLs1sIJK_ClZ7lXR5vdYOlrK-NCKvK64dtyynYmgeqs7hzWR7/pub?output=csv", {
    download: true,
    header: true,
    complete: function(results) {
        fetchFeatureData( results.data ); 
        //console.log("Parsed file:", results);
    },
    error: function(error) {
        console.error("Error parsing files:", error);
    }
});
