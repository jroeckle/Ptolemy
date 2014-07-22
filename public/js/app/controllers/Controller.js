define(['App', 'backbone', 'marionette', 'views/WelcomeView'],
    function (App, Backbone, Marionette, WelcomeView) {
    return Backbone.Marionette.Controller.extend({
        initialize:function (options) {
            

            requirejs(['views/HeaderView', 'views/NavigationView'], function(HeaderView, NavigationView) {
                App.headerRegion.show(new HeaderView());
                App.sidenavRegion.show(new NavigationView());
            });
        },
        //gets mapped to in AppRouter's appRoutes
        index:function () {
            //App.mainRegion.show(new WelcomeView());
        }
    });
});