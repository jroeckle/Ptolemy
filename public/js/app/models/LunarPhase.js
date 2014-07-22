define(["models/Model"],
    function (Model) {
        // Creates a new Backbone Model class object
        var LunarPhase = Model.extend({
            initialize:function () {

            },

            // Default values Lunar Phase
            defaults:{
                title : "Phase Title",
                description : ""
            },
            validate: function(attrs) {
                if(attrs.title === this.defaults.title) return "Phase Title is not a lunar phase";
            }
        });

        return LunarPhase;
    }
);