var BaseView = Backbone.View.extend({
    /**
     * Get container DOM element id
     */
    getElId: function() {
	return this.$el.attr('id');
    },
    getChannel: function() {
	if (this.channel === undefined) {
	    this.channel = 'id' + Math.floor(Math.random() * 100000);
	}
	return this.channel;
    }

});
