define( [], function () {
    'use strict';

    // *****************************************************************************
    // Dimensions & Measures
    // *****************************************************************************
    var dimensionProperties = {
        uses: "dimensions"
    };

    var measureProperties = {
        uses: "measures"
    };

    // *****************************************************************************
    // Sorting
    // *****************************************************************************
    var sortProperties = {
        uses: "sorting"
    };

    // *****************************************************************************
    // Appearance Section
    // *****************************************************************************
    var appearanceProperties = {
        uses: "settings",
        items: {
            MyStringProp: {
                ref: "myDynamicText",
                type: "string",
                label: "Enter Dynamic Text here"
            }
        }
    };

    
    // *****************************************************************************
    // Main property panel definition
    // ~~
    // Only what's defined here will be returned from properties.js
    // *****************************************************************************

    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: dimensionProperties,
            measures:   measureProperties,
            sorting:    sortProperties,
            appearance: appearanceProperties

        }
    };

} );