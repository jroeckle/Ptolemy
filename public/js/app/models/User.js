define(["models/Model", "models/GeoLocation"],
    function (Model, GeoLocation) {
        // Creates a new Backbone Model class object
        var User = Model.extend({

            initialize:function () {
                this.requestGPSLocation();
            },

            // Default values for User
            defaults:{
                hasGPS : null,
                hasGrantedLocationAccess : null,
                location:  new GeoLocation(),
                currentTime : new Date()
            },

            validate: function(attrs) {                
            
            },

            requestGPSLocation : function() {
                var that = this;

                //If Modernizr is present immeidately check for user location access
                if(Modernizr) this.checkForGPSAccess(Modernizr.geolocation, function(geoLocationData) {
                    that.setUserLocation(geoLocationData);
                });
            },

            setUserLocation : function(geoLocationData) {
                var usersLocation = this.get("location");                
                usersLocation.set(geoLocationData);
            },

            checkForGPSAccess : function(modernizrGeolocation, successCallback, failureCallback) {
                var that = this;

                //Does User Have GPS Capabilities?
                if(modernizrGeolocation) {
                    //User has GPS Capabilities
                    this.set("hasGPS", true);  

                    //Request Location Access
                    navigator.geolocation.getCurrentPosition(function(e){
                        //Location Access Granted
                        that.set("hasGrantedLocationAccess", true);
                        if(successCallback) successCallback(e);

                    }, function() {
                        //Location Access Denied
                        that.set("hasGrantedLocationAccess", false);
                        if(failureCallback) failureCallback();

                    });

                }  else {
                    //User does not GPS Capabilities
                    this.set("hasGPS", false);
                }

            }
        });

        return User;
    }
);