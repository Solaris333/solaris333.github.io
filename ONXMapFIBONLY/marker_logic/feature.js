// Advanced
// Shows polygons and marker with overlapping IDs
// The geoJSON contains 5 features which combine logically by 3 IDs

function addFeatures(map, feature_id, feature_name, feature_icon, feature_data) {

    // New layer with id `collectibles` from geoJSON `collectibles`
    let layer = map.addInteractiveLayer(feature_id, feature_data, {

        // The display name for this layer
        name: feature_name,

        // This layer should have a tab in the sidebar with a list for each feature ID
        create_checkbox: true,

        // Each feature should have a popup
        // This internally calls `getPopupMedia()` to associate an image or video
        // See `map_utils.js` for an example
        create_feature_popup: true,

        // This layer should be visible by default
        is_default: false,

        // Let's do something on every feature
        // https://leafletjs.com/reference.html#geojson-oneachfeature
        onEachFeature: function (feature, layer) {

            // Listen for events and do something
            // https://leafletjs.com/reference.html#evented-on
            layer.on({

                // Do some fancy highlighting by hovering with the mouse
                mouseover: event => {
                    this.highlightFeature(feature.properties.id);
                },
                mouseout: event => {
                    this.removeFeatureHighlight(feature.properties.id);
                },

                // Clicking on the layer zooms to it
                click: event => {

                    // This layer gets a popup which also does some additional stuff…
                    this.zoomToFeature(feature.properties.id);

                    // …which can be manually included if no popup is generated:
                    // map.share_marker.prevent();
                    // Utils.setHistoryState(this.id, feature.properties.id);
                }
            });

            // Bind a tooltip which follows the mouse around when hovering over a feature that
            // isn't a point (marker)
            if (feature.geometry.type != "Point") {

                // https://leafletjs.com/reference.html#layer-bindtooltip
                layer.bindTooltip(feature.properties.name, {
                    sticky: true
                });
            }
        },

        // Give polygons some special styling
        // Function that return a path object or directly a path object
        // https://leafletjs.com/reference.html#geojson-style
        // https://leafletjs.com/reference.html#path-option
        polygon_style: function (feature) {
            return {
                color: 'green',
                opacity: 0.2
            };
        },

        // Give polygons some special styling when a highlight occurs e.g. by mouse hovering or location finding
        // Function that return a path object or directly a path object
        // https://leafletjs.com/reference.html#geojson-style
        // https://leafletjs.com/reference.html#path-option
        polygon_style_highlight: function (feature) {
            return {
                color: 'green',
                opacity: 0.5,
                fillColor: 'green',
                fillOpacity: 0.2
            };
        },

        // If the coordinates are extracted from the game files they might need a transformation to
        // map correctly
        coordsToLatLng: function (coords) {
            var lx = (coords[0] + 1) * 0.5;
            var ly = (coords[1] - 1) * 0.5;
            return L.latLng(coords[1], coords[0]);
            //return L.latLng(ly, lx);
        },

        // Some additional notes:
        // * We're omitting the `sidebar_icon_html` so `images/icons/${this.id}.png` will be used as an icon
        // * We're omitting the `pointToLayer` so `images/icons/${this.id}.png` will be used for marker
        // * We're omitting the `feature_group` so markers will cluster with other layers

        sidebar_icon_html: feature_icon,
        
        pointToLayer: function (feature, latlng) {

            // https://leafletjs.com/reference.html#marker
            return L.marker(latlng, {

                // We don't have created a custom icon so let's use a generic one from Font Awesome
                // This can take:
                // * a Font Awesome `fa-` string
                // * the group id (`this.id`) to take the `images/icons/${this.id}.png`
                // * a max 2 char long string
                // * nothing for a generic marker
                icon: Utils.getCustomIcon(feature.icon ? feature.icon : 'fa-caravan', 'green'),
                riseOnHover: true
            });
        }
    });

    // Optionally add further geojsons
    // layer.addGeoJson(another_geojson, {
    //     create_feature_popup: true,
    //     …
    // });
}
