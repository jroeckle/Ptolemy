require(['./GlobalConfig'], function (globalconfig) {
	

	require(["jquery","App", "routers/AppRouter", "controllers/Controller"],
		function ($, App, AppRouter, Controller) {

		$(function() {

			App.appRouter = new AppRouter({
				controller:new Controller()
			});

			App.start();
		});

	});

});