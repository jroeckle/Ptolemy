define(["jquery", "backbone"],
    function ($, Backbone) {
        // Creates a new Backbone Model class object
        var Model = Backbone.Model.extend({
            initialize:function () {

            },

            // Default values for all of the Model attributes
            defaults:{
                
            },
            validate: function(attrs) {

            }
        });

        return Model;
    }
);