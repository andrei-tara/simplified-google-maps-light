/**
 * Provide global notification system
 */
var NotificationsManager = BaseManager.extend({
    constructor: function(config) {
	var channel = config.channel;
	EventDistpatcher.use(channel).on('notification.show', this.show, this);
    },
    show: function(message) {
	jQuery("#notification")
		.html(message)
		.fadeIn(500)
		.delay(4000)
		.fadeOut();
    }

});