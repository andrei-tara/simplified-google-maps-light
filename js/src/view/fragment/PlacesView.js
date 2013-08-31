var PlacesView = AbstractAccordionView.extend({
    events: function() {
	return _.extend({}, AbstractAccordionView.prototype.events, {});
    },
    initialize: function(config) {
	this.initAccordionControl();
	this.model = config.model;
	this.channel = config.channel;
	this.iconProviderModel = new IconProviderModel(config.baseURL);
	this.iconSelectors = [];

	var channel = this.getChannel();
	EventDistpatcher.use(channel).on('place.select', this.onFocusPlace, this);
	EventDistpatcher.use(channel).on('map.load', this.onLoadMap, this);
    },
    onFocusPlace: function(place) {
	var id = place.get('id');
	//Data update
	var details = this.getPlaceDetailsValue(id);
	place.set('details', details);
	//Perfom expansion 
	this.expand(id);
    },
    onLoadMap: function(model) {
	var places = model.get('places');
	for (var key in places) {
	    this.bindModel(key, places[key]);
	    //EventDistpatcher.use(channel).trigger('place.update', places[key]);
	}
    },
    getPlaceById: function(id) {
	return this.model.getPlaceById(id);
    },
    afterElementCreation: function(id) {
	var place = this.getPlaceById(id);
	this.initIconSelector(place);
	this.initDetailsRichEditor(place);
	this.initNameInput(place);
	this.initLocationInput(place);

	var channel = this.getChannel();
	EventDistpatcher.use(channel).trigger('place.add', place);
    },
    initNameInput: function(place) {
	var name = jQuery("#" + place.get('id') + " .name");
	name.val(place.get('name'));
	jQuery("#name-lable-" + place.get('id')).html(place.get('name'));

	name.change(function() {
	    var value = jQuery(this).val();
	    place.set('name', value);
	    jQuery("#name-lable-" + place.get('id')).html(value);
	});
    },
    initLocationInput: function(place) {
	var lng = jQuery("#" + place.get('id') + " .lng");
	lng.val(place.get('lng'));
	lng.change(function() {
	    var value = jQuery(this).val();
	    place.set('lng', value);
	});


	var lat = jQuery("#" + place.get('id') + " .lat");
	lat.val(place.get('lat'));
	lat.change(function() {
	    var value = jQuery(this).val();
	    place.set('lat', value);
	});
    },
    initIconSelector: function(place) {

	this.updateIconProviderModelIfRequired(place);

	var channel = this.getChannel();
	this.iconSelectors[place.get('id')] = new Select2Adaptor({
	    el: "#" + place.get('id') + " .icon",
	    provider: this.iconProviderModel,
	    channel: channel,
	    onMatchSelection: function(obj) {
		return obj !== undefined && obj.imageSrc === place.get('icon');
	    },
	    onFormatResult: function(item) {
		return "<div class='place-icon-selector'><img class='icon' src='" + item.imageSrc + "'/>" + item.text +
			"<div class='description'>" + item.description + "</div></div>";
	    },
	    onFormatSelection: function(item) {
		return item.text;
	    },
	    onSelect: function(item) {
		place.set('icon', item.imageSrc);
		place.set('iconCustomName', item.text);
		place.set('iconCustomId', item.id);
		EventDistpatcher.use(channel).trigger('place.update', place);
	    }
	});

    },
    updateIconProviderModelIfRequired: function(place) {

	//Get selected value
	var selectedItem = this.iconProviderModel.valueOf(function(obj) {
	    return obj !== undefined && obj.imageSrc === place.get('icon');
	});

	if (selectedItem === undefined) {
	    var channel = this.getChannel();
	    var customIcon = {
		id: place.get('iconCustomId'),
		imageSrc: place.get('icon'),
		description: "Icon " + place.get('iconCustomName'),
		text: place.get('iconCustomName')
	    };
	    this.iconProviderModel.getData().push(customIcon);
	    EventDistpatcher.use(channel).trigger('select2.update', customIcon);
	}
    }
    ,
    initDetailsRichEditor: function(place) {
	var instance = this;
	var id = place.get('id');
	jQuery('textarea#' + id + "-details").html(place.get('details'));

	if (this.isRichEditorActive()) {
	    tinymce.execCommand('mceAddControl', true, id + "-details");
	    tinymce.get(id + "-details").onChange.add(function(ed, l) {
		instance.onFocusPlace(place);
	    });
	    
	} else {
	    jQuery('textarea#' + id + "-details").change(function() {
		instance.onFocusPlace(place);
	    });
	    jQuery("#" + place.get('id') + " .media-button").hide();
	}


    },
    isRichEditorActive: function() {
	return (typeof(tinymce) === "object" && typeof(tinymce.execCommand) === "function");
    },
    getPlaceDetailsValue: function(id) {
	if (this.isRichEditorActive() && tinymce.get(id + "-details") !== undefined) {
	    return  tinymce.get(id + "-details").getContent();
	}
	else {
	    return jQuery('textarea#' + id + "-details").val();
	}

    },
    /**
     * Provice concrete implementation for creation of nre accordionElement
     */
    createAccordionElement: function(id) {
	return jQuery('#template-place')
		.html()
		.replaceAll('{id}', id);
    },
    createAccordionElementDataModel: function(id) {
	var placeDataModel = new PlaceModel({
	    id: id,
	    name: '',
	    channel: this.getChannel()
	});
	this.model.addPlace(id, placeDataModel);
    },
    afterElementRemoval: function(id) {
	var place = this.model.getPlaceById(id);
	var channel = this.getChannel();
	EventDistpatcher.use(channel).trigger('place.remove', place);
	this.model.removePlace(id);
    }

});