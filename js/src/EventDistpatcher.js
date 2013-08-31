var EventDistpatcher = {
    channels: [],
    use: function(identifier) {
	if (this.channels[identifier] === undefined) {
	    this.channels[identifier] = _.extend({}, Backbone.Events);
	}
	return this.channels[identifier];
    }
};