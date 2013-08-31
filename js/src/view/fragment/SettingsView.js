var SettingsView = BaseView.extend({
    events: {
    },
    initialize: function(config) {
	this.model = config.model;
	this.channel = config.channel;
	this.mapTypeProviderModel = new MapTypeProviderModel();

	var channel = this.getChannel();
	EventDistpatcher.use(channel).on('map.updatecenter', this.onChangeMapPosition, this);
	EventDistpatcher.use(channel).on('map.updatezoom', this.onChangeMapZoom, this);
	EventDistpatcher.use(channel).on('map.load', this.onLoadMap, this);

	this.initUIModel();

    },
    onLoadMap: function(model) {
	//var channel = this.getChannel();
	//EventDistpatcher.use(channel).trigger('map.updatezoom', parseInt(model.get('zoom')));
	//EventDistpatcher.use(channel).trigger('map.updatecenter', model.get('lat'), model.get('lng'));
	//EventDistpatcher.use(channel).trigger('map.updatetype', model.get('type'));

	jQuery("#" + this.getElId() + " .maptype").select2('val', model.get('type'));	
	jQuery("#" + this.getElId() + " .width").val(model.get('width'));
	jQuery("#" + this.getElId() + " .height").val(model.get('height'));
	this.onChangeMapZoom(model.get('zoom'));
	this.onChangeMapPosition(model.get('lat'),model.get('lng'));	


    },
    changedMapCenter: function() {
	var lat = jQuery("#" + this.getElId() + " .lat").val();
	var lng = jQuery("#" + this.getElId() + " .lng").val();

	var channel = this.getChannel();
	EventDistpatcher.use(channel).trigger('map.updatecenter', lat, lng);

    },
    changeMapZoom: function() {
	var zoomLevel = jQuery("#" + this.getElId() + " .zoom").slider("value");
	this.model.set('zoom', zoomLevel);

	var channel = this.getChannel();
	EventDistpatcher.use(channel).trigger('map.updatezoom', zoomLevel);
    },
    onChangeMapPosition: function(lat, lng) {
	this.model.set('lng', lng);
	this.model.set('lat', lat);
	jQuery("#" + this.getElId() + " .lng").val(lng);
	jQuery("#" + this.getElId() + " .lat").val(lat);
    },
    onChangeMapZoom: function(zoomLevel) {
	this.model.set('zoom', zoomLevel);
	jQuery("#" + this.getElId() + " .zoom").slider("value", zoomLevel);
    },
    initUIModel: function() {
	var instance = this;
	jQuery("#" + this.getElId() + " .lng").spinner({
	    step: 0.0001,
	    numberFormat: "n",
	    change: function() {
		instance.changedMapCenter();
	    },
	    stop: function() {
		instance.changedMapCenter();
	    }
	});

	jQuery("#" + this.getElId() + " .lat").spinner({
	    step: 0.0001,
	    numberFormat: "n",
	    change: function() {
		instance.changedMapCenter();
	    },
	    stop: function() {
		instance.changedMapCenter();
	    }
	});

	jQuery("#" + this.getElId() + " .zoom").slider({
	    range: "max",
	    min: 0,
	    max: 21,
	    value: instance.model.get('zoom'),
	    slide: function(event, ui) {
		instance.changeMapZoom();
	    }
	});

	jQuery("#" + this.getElId() + " .width").change(function() {
	    var value = jQuery(this).val();
	    instance.model.set('width', value);
	});

	jQuery("#" + this.getElId() + " .height").change(function() {
	    var value = jQuery(this).val();
	    instance.model.set('height', value);
	});

	//Init Values
	jQuery("#" + this.getElId() + " .width").val(this.model.get('width'));
	jQuery("#" + this.getElId() + " .height").val(this.model.get('height'));

	jQuery("#" + this.getElId() + " .lng").val(this.model.get('lng'));
	jQuery("#" + this.getElId() + " .lat").val(this.model.get('lat'));


	var channel = this.getChannel();

	new Select2Adaptor({
	    el: "#" + this.getElId() + " .maptype",
	    provider: this.mapTypeProviderModel,
	    onMatchSelection: function(obj) {
		return obj !== undefined && obj.id === instance.model.get('type');
	    },
	    onFormatResult: function(item) {
		//<img class='icon' src='" + item.imageSrc + "'/>" 
		return "<div class='place-icon-selector'>" + item.text +
			"<div class='description'>" + item.description + "</div></div>";
	    },
	    onFormatSelection: function(item) {
		return item.text;
	    },
	    onSelect: function(item) {
		instance.model.set('type', item.id);
		EventDistpatcher.use(channel).trigger('map.updatetype', item.id);
	    }
	});



    }

});
