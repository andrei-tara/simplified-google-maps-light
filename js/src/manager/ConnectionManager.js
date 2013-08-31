/**
 * Provide global communication system to backend
 * @type @exp;BaseManager@call;extend
 */
var ConnectionManager = BaseManager.extend({
    constructor: function(config) {
	var channel = config.channel;
	EventDistpatcher.use(channel).on('backend.send', this.send, this);
	this.config = config;
    },
    send: function(message) {
	var options = message.callback;
	var url = message.url;
	jQuery.ajax({
	    url: message.url,
	    type: 'POST',
	    dataType: 'json',
	    data: message.content,
	    success: function(object, status) {
		if (options !== undefined && options.success) {
		    options.success(object);
		}
	    },
	    error: function(xhr, status, error) {
		if (options !== undefined && options.error) {
		    options.error(error);
		}
	    }
	});
    }

});