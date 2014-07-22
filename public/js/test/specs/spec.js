// Jasmine Unit Testing Suite
define([
    'jquery',
    'backbone',
    'marionette',
    'models/Model',
    'models/LunarPhase',
    'collections/Collection',
    'collections/LunarPhases'],
    function(
        $,
        Backbone,
        Marionette,
        Model,
        LunarPhase,
        Collection,
        LunarPhases) {


        //'Mocks'
        var fakeGeolocationdata = {
                coords: {
                    accuracy: 22000,
                    altitude: null,
                    altitudeAccuracy: null,
                    heading: null,
                    latitude: 34.1186,
                    longitude: -118.3004,
                    speed: null
                },
                timestamp: 1402706077349
            };


        // Test suite that includes all of the Jasmine unit tests
        describe('Lunar Application', function() {

            // Backbone Model Suite: contains all tests related to models
            describe('Backbone models', function() {

                // Runs before every Model spec
                beforeEach(function() {
                    // Instantiates a new Model instance
                    this.model = new Model();

                    // We are spying on the _validate method to see if it gets called
                    spyOn(Model.prototype, 'validate');
                });

                it('should be in a valid state', function() {
                    expect(this.model.isValid()).toBe(true);
                });

                it('should call the validate method when setting a property', function() {
                    this.model.set({ example: 'test' }, { validate: true });
                    expect(Model.prototype.validate).toHaveBeenCalled();
                });

                describe('User Model', function() {
                    
                    var UserModel;

                    beforeEach(function(done) {
                        var that = this;

                        //load User Model
                        requirejs(['models/User'], function(User){
                            UserModel = User;
                            that.User = new UserModel();
                            spyOn(UserModel.prototype, 'set');
                            done();
                        });

                    });

                    it('should know when the gps is and is not available', function() {
                        //Assume modernizr location fails
                        this.User.checkForGPSAccess(false);
                        expect(UserModel.prototype.set).toHaveBeenCalledWith( 'hasGPS', false );
                        expect(this.User.get("hasGPS")).not.toBeUndefined();
                        
                        //Assume modernizr location passes
                        this.User.checkForGPSAccess(true);
                        expect(UserModel.prototype.set).toHaveBeenCalledWith( 'hasGPS', true );
                        expect(this.User.get("hasGPS")).not.toBeUndefined();
                    });

                    //TODO Figure a more clean way of doing this
                    xit('should know when location access is not granted', function(done) {
                        var that = this;

                        expect(this.User.get("hasGrantedLocationAccess")).not.toBeUndefined();

                        spyOn(navigator.geolocation,"getCurrentPosition").and.callFake(function() {
                            var position = { coords: { latitude: 32, longitude: -96 } };
                            arguments[0](position);
                        });

                        //Assume modernizr location passes
                        this.User.checkForGPSAccess(true, function(){
                            expect(UserModel.prototype.set).toHaveBeenCalledWith( 'hasGrantedLocationAccess', true );
                            expect(that.User.get("hasGrantedLocationAccess")).not.toBeNull();
                            done();
                        });

                    });

                    it('should know the current date time', function() {
                        expect(this.User.get("currentTime")).not.toBeUndefined();
                    });

                    it('can set its GeoLocation', function(){
                        expect(this.User.get("location")).not.toBeUndefined();
                        this.User.setUserLocation(fakeGeolocationdata);

                        var userLocation = this.User.get("location");

                        expect(userLocation).not.toBeUndefined();
                        expect(userLocation.get("timestamp")).toEqual(fakeGeolocationdata.timestamp);
                        expect(userLocation.get("coords")).not.toBeUndefined();
                        expect(userLocation.get("coords").latitude).toEqual(fakeGeolocationdata.coords.latitude);
                        expect(userLocation.get("coords").longitude).toEqual(fakeGeolocationdata.coords.longitude);
                    });

                    xit('should know where the user is (if given access)', function(){

                    });
                });

                describe('GeoLocation Model', function() {
                    var GeoLocationModel;

                    beforeEach(function(done) {
                        var that = this;

                        //load User Model
                        requirejs(['models/GeoLocation'], function(GeoLocation){
                            GeoLocationModel = GeoLocation;

                            that.GeoLocation = new GeoLocationModel(fakeGeolocationdata);

                            spyOn(GeoLocationModel.prototype, 'set');
                            done();
                        });
                    });

                    it('should have a timestamp', function() {
                        expect(this.GeoLocation.get("timestamp")).toEqual(fakeGeolocationdata.timestamp);
                    });

                    it('should have a latitude and longitude', function() {
                        expect(this.GeoLocation.get("coords")).not.toBeUndefined();
                        expect(this.GeoLocation.get("coords").latitude).toEqual(fakeGeolocationdata.coords.latitude);
                        expect(this.GeoLocation.get("coords").longitude).toEqual(fakeGeolocationdata.coords.longitude);
                    });

                    it('can tell you which hemisphere it\'s in', function() {
                        expect(this.GeoLocation.getHemispheres().north).toEqual(true);
                        expect(this.GeoLocation.getHemispheres().east).toEqual(false);
                    });
                });

                describe('Lunar Phase Model', function() {
                    beforeEach(function() {
                        this.LunarPhase = new LunarPhase();
                    });
                    it('should have a title', function() {
                        expect(this.LunarPhase.get("title")).not.toBeUndefined();
                    });
                    it('should never be set back to the default title', function(){
                        this.LunarPhase.set({title:"Phase Title"});
                        expect(this.LunarPhase.isValid()).toBe(false);
                    });
                });

            }); // End of the Model test suite


            // Backbone Collection Suite: contains all tests related to collections
            describe('Backbone collections', function() {
                // Runs before every Collection spec
                beforeEach(function() {
                    // Instantiates a new Collection instance
                    this.collection = new Collection();
                });

                it('should contain the correct number of models', function() {
                    expect(this.collection.length).toEqual(0);
                });

                describe('Lunar Phase Collection', function() {
                    beforeEach(function() {
                        this.LunarPhases = new LunarPhases();
                    });
                    it('should be a collection of lunar phases', function(){
                        expect(this.LunarPhases.model).toEqual(LunarPhase);
                    });
                    it('should know where to populate data from', function(done) {
                        var that = this;
                        this.LunarPhases.fetch({
                            success : function() {
                                expect(that.LunarPhases.length).toBeGreaterThan(0);
                                done();
                            }
                        });
                    });
                    it('should be able to determine a julian date based on any date object', function() {
                        var mockDate            = new Date("February 1, 2011"),
                            julianDayConversion = this.LunarPhases.getJulianDay(mockDate);

                        expect(julianDayConversion).toEqual(2455593.9265);
                    });
                    it('should be able to determine a lunar phase based on date', function(done){
                        var mockDate = new Date("February 18, 2011"),
                            that     = this;

                        this.LunarPhases.fetch({
                            success : function() {
                                expect(that.LunarPhases.getLunarPhaseByDate(mockDate)).toEqual(4);
                                done();
                            }
                        });
                    });
                    it('should be able to pull the lunar based on current date', function(done){
                        var mockDate = new Date("February 18, 2011"),
                            that     = this;

                        this.LunarPhases.fetch({
                            success : function() {
                                //should be able to pull the appropriate model from the collection based on current date
                                var currentLunarPhaseIndex = that.LunarPhases.getLunarPhaseByDate(mockDate);
                                    currentLunarPhase      = that.LunarPhases.at(currentLunarPhaseIndex);

                                expect(currentLunarPhase).not.toBeUndefined();
                                expect(currentLunarPhase.get("title")).toEqual("Full Moon");
                                done();
                            }
                        });
                    });
                });
            }); // End of the Collection test suite

            // Marionette View Suite: contains all tests related to views
            // describe('Marionette Views', function() {
            //     it('Instantiate some Views', function() {
            //         var container = $('#container');
            //         var welcomeView = new WelcomeView();
            //         container.append(welcomeView.render().$el);

            //         var desktopHeaderView = new DesktopHeaderView();
            //         container.append(desktopHeaderView.render().$el);

            //         var mobileHeaderView = new MobileHeaderView();
            //         container.append(mobileHeaderView.render().$el);
            //     });
            // }); // End of the View test suite*/
        }); // End of the MRB test suite

});
