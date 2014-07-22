define([ 'marionette', 'text!templates/header.html', 'foundation'],
	function (Marionette, template) {
		//ItemView provides some default rendering logic
		return Marionette.ItemView.extend({
			className  : "row left",
			
			template   : _.template(template),
			onRender   : function() {
				this.$el.foundation("equalizer");
			}
		});
	});