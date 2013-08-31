var EditableMapView = MapView.extend({
    events: {
	'click .save': 'save',
	'click .edit': 'edit',
	'click .tab-place': 'switchOnPlace',
	'click .tab-settings': 'switchOnSettings',
	'click .tab-style': 'switchOnStyle'
    },
    initialize: function(config) {
	EditableMapView.__super__.initialize.apply(this, arguments);


	this.initMapNameInput();

	if (!config.readonly) {
	    this.initSubViews();
	    this.initNotificationManager();
	    this.initTabControl();
	    this.initAddressPicker();
	}

    },
    initSubViews: function() {
	this.placesView = new PlacesView({
	    el: "#controll-place",
	    model: this.model,
	    channel: this.getChannel(),
	    baseURL: this.config.baseURL
	});
	this.settingsView = new SettingsView({
	    el: "#controll-settings",
	    model: this.model,
	    channel: this.getChannel()
	});	
    },
    switchOnPlace: function() {
	this.placesView.refresh();
    },
    switchOnSettings: function() {
    },
    switchOnStyle: function() {
	this.stylerView.refresh();
    },
    getDefaultModelState: function() {
	var channel = this.getChannel();
	return {
	    readonly: this.isReadOnly(),
	    channel: channel,
	    'zoom': 5,
	    'width': 800,
	    'height': 600,
	    'lat': 40.874725640744046,
	    'lng': -73.90447246093748,
	    'type': google.maps.MapTypeId.ROADMAP
	};
    },
    initNotificationManager: function() {
	var channel = this.getChannel();
	this.notificationsManager = new NotificationsManager({channel: channel});
    },
    getMapConfiguration: function() {
	return {canvas: "map-canvas", readonly: this.isReadOnly(), channel: this.getChannel()};
    },
    initTabControl: function() {
	jQuery("#" + this.getElId() + " .controll").tabs();
	if (this.isReadOnly()) {
	    jQuery("#" + this.getElId() + " .controll").hide();
	}
    },
    initMapNameInput: function() {
	var model = this.model;
	jQuery("#" + this.getElId() + " .name").change(function() {
	    var value = jQuery(this).val();
	    model.set('name', value);
	});
	jQuery("#" + this.getElId() + " .name").prop('disabled', this.isReadOnly());

    },
    initAddressPicker: function() {

	var channel = this.getChannel();
	var instance = this;
	this.addresspicker = jQuery("#" + this.getElId() + " .addresspicker").addresspicker({
	    //regionBias: "fr",
	    updateCallback: function(geocodeResult, parsedGeocodeResult) {
		//console.log(geocodeResult);
		EventDistpatcher.use(channel).trigger('map.updatecenter', parsedGeocodeResult.lat, parsedGeocodeResult.lng);
		EventDistpatcher.use(channel).trigger('map.updatezoom', 15);
		var placeId = instance.placesView.addNew();
		var place = instance.model.getPlaceById(placeId);
		place.set('name', geocodeResult.label);
		instance.placesView.initNameInput(place);
	    }

	});
    },
    onLoadMapCallback: function(model) {
	EditableMapView.__super__.onLoadMapCallback.apply(this, arguments);
	jQuery("#" + this.getElId() + " .name").val(model.get('name'));
    },
    /**
     * Persist map
     */
    save: function() {
	var channel = this.getChannel();

	var validation = this.model.validate();

	if (validation.hasError) {
	    EventDistpatcher.use(channel).trigger('notification.show', validation.messages.join(' <br/>'));

	    for (var i = 0; i < validation.fields.length; i++) {
		this.highlightField(validation.fields[i]);
	    }

	    return;
	}

	EventDistpatcher.use(channel).trigger('backend.send', {
	    'url': this.getSaveURL(),
	    'content': this.model.toJSON(),
	    'callback': this.getSaveCallbacks()
	});
    },
    highlightField: function(name) {
	jQuery("#" + this.getElId() + ' ' + name).addClass("invalid").delay(8000).queue(function(next) {
	    jQuery(this).removeClass("invalid");
	    next();
	});
    },
    getSaveURL: function() {
	return this.getConfiguration().url.save;
    },
    getBackURL: function() {
	return this.getConfiguration().url.back;
    },
    isReadOnly: function() {
	return this.getConfiguration().readonly;
    },
    getSaveCallbacks: function() {
	var channel = this.getChannel();
	var instance = this;
	var callback = {
	    success: function(object) {
		instance.onSaveSuccess(object, channel);
	    },
	    error: function(error) {
		instance.onSaveError(error, channel);
	    }
	};
	return callback;
    },
    onSaveSuccess: function(object, channel) {
	if (object.success) {
	    EventDistpatcher.use(channel).trigger('notification.show', "Map successfully saved");
	    var returnURL = this.getConfiguration().url.back;
	    setInterval(function() {
		window.location.replace(returnURL);
	    }, 2000);
	} else {
	    EventDistpatcher.use(channel).trigger('notification.show', "An error has occured");
	}
    },
    onSaveError: function(error, channel) {
	EventDistpatcher.use(channel).trigger('notification.show', "An critical error has occured");
    },
    edit: function() {
	window.location.replace(this.getConfiguration().url.edit);
    }
});