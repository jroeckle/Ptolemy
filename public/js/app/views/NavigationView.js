define([ 'marionette', 'text!templates/side-navigation.html', 'jquery.mmenu'],
	function ( Marionette, template) {
		//ItemView provides some default rendering logic
		return Marionette.ItemView.extend({

			className  : "nav-wrapper",

			events : {
				"click .title" : "toggleMenu",
				"touchstart .title" : "toggleMenu",
				"click .nav-icon" : "toggleMenu",
				"touchstart .nav-icon" : "toggleMenu",
			},

			toggleMenu : function(e) {
				e.preventDefault();
				var slideMenu = $('#slide-menu');

				//Open or Close Depending on State
				(slideMenu.hasClass('mm-opened')) ? slideMenu.trigger("close.mm") : slideMenu.trigger("open.mm");
			},

			template   : _.template(template),

			onShow   : function() {

				var thatEl = this.$el;

				$(".slide-menu")
					.mmenu({
						slidingSubmenus : true
					})
					.on('opening.mm', function() {
						thatEl.addClass('opened');
					})
					.on('closing.mm', function() {
						thatEl.removeClass('opened');
					})
					.addClass('loaded');
				
			}
		});
	});