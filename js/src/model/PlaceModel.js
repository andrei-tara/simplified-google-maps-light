var PlaceModel = Backbone.Model.extend({
    initialize: function() {

	var channel = this.get('channel');

	this.on("change:lat", function(model) {
	    if (model === undefined) {
		return;
	    }

	    var lat = model.get("lat");
	    jQuery("#" + model.get('id') + ' .lat').val(lat);
	});
	this.on("change:lng", function(model) {
	    if (model === undefined) {
		return;
	    }

	    var lat = model.get("lng");
	    jQuery("#" + model.get('id') + ' .lng').val(lat);
	});
	this.on("change:name", function(model) {
	    if (model === undefined) {
		return;
	    }

	    EventDistpatcher.use(channel).trigger('place.update', this);
	});

	this.on("change:details", function(model) {
	    if (model === undefined) {
		return;
	    }

	    EventDistpatcher.use(channel).trigger('place.update', this);
	});

    },
    toJSON: function() {
	return {
	    'name': this.get('name'),
	    'lat': this.get('lat'),
	    'lng': this.get('lng'),
	    'icon': this.get('icon'),
	    'iconCustomName': this.get('iconCustomName'),
	    'iconCustomId': this.get('iconCustomId'),
	    'details': this.get('details')
	};
    },
    validate: function() {
	var messages = [];
	var fields = [];

	if (!this.get('name')) {
	    messages.push('You must provide a name for place');
	    fields.push("#" + this.get('id') + ' .name');
	}
	if (!this.get('lat') || isNaN(this.get('lat'))) {
	    messages.push('Invalid place lat, must be a valid coordonate.');
	    fields.push("#" + this.get('id') + ' .lat');
	}
	if (!this.get('lng') || isNaN(this.get('lng'))) {
	    messages.push('Invalid place lng, must be a valid coordonate.');
	    fields.push("#" + this.get('id') + ' .lng');
	}

	if (messages.length !== 0) {
	    fields.push(".header-" + this.get('id'));
	}

	return {messages: messages, fields: fields, hasError: messages.length !== 0};

    }
});