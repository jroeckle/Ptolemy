define(["models/Model"],
    function (Model) {
        // Creates a new Backbone Model class object
        var GeoLocation = Model.extend({
            initialize:function () {

            },

            // Default values Lunar Phase
            defaults:{
                timestamp : null,
                coords : null
            },

            getHemispheres : function() {
                var currentCoords = this.get("coords");

                //Exit if currentCoords not set
                if(!currentCoords) return false;

                //North or South
                return {
                    north : (currentCoords.latitude > 0),
                    east : (currentCoords.longitude > 0)
                }
            },

            validate: function(attrs) {                
                
            }
        });

        return GeoLocation;
    }
);