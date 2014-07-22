define(['jquery', 'backbone', 'marionette', 'underscore', 'backbone.validateAll'],
    function ($, Backbone, Marionette, _) {
        var App = new Backbone.Marionette.Application();

        //Organize Application into regions corresponding to DOM elements
        //Regions can contain views, Layouts, or subregions nested as necessary
        App.addRegions({
            headerRegion  : "header",
            sidenavRegion : "#slide-menu"
        });

        function isMobile() {
            var ua = (navigator.userAgent || navigator.vendor || window.opera, window, window.document);
            return (/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        App.static = {};

        App.static.mobile = isMobile();

        App.addInitializer(function (options) {
            Backbone.history.start();
        });

        return App;
    });