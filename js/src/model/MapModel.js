var MapModel = Backbone.Model.extend({
    initialize: function() {
	this.on("change:name", function(model) {
	    if (model === undefined) {
		return;
	    }
	    var name = model.get("name");
	    jQuery("#" + model.get('el') + ' .name').val(name);
	});

	this.set('places', {});
	this.set('stylers', {});
    },
    toJSON: function() {
	return {
	    id: this.get('id'),
	    name: this.get('name'),
	    lat: this.get('lat'),
	    lng: this.get('lng'),
	    zoom: this.get('zoom'),
	    width: this.get('width'),
	    height: this.get('height'),
	    type: this.get('type'),
	    places: this.collectionToJSON(this.get('places'))	    
	};
    },
    validate: function() {

	var messages = [];
	var fields = [];

	if (!this.get('name')) {
	    messages.push('You must provide a name for map');
	    fields.push('.top .name');
	}
	if (!this.get('width') || isNaN(this.get('width'))) {
	    messages.push('Invalid map width, must be a number.');
	    fields.push('.width');
	}
	if (!this.get('height') || isNaN(this.get('height'))) {
	    messages.push('Invalid map height, must be a number.');
	    fields.push('.height');
	}
	if (!this.get('lat') || isNaN(this.get('lat'))) {
	    messages.push('Invalid map center lat, must be a valid coordonate.');
	    fields.push('.lat');
	}
	if (!this.get('lng') || isNaN(this.get('lng'))) {
	    messages.push('Invalid map center lng, must be a valid coordonate.');
	    fields.push('.lng');
	}
	if (!this.get('type')) {
	    messages.push('Invalid map type specified.');
	    fields.push('.type');
	}
	
	//Validate places
	var places = this.get('places');
	for (var key in places) {
	    var placeValidation = places[key].validate();
	    if (placeValidation.hasError) {
		messages = messages.concat(placeValidation.messages);
		fields = fields.concat(placeValidation.fields);
	    }
	}	
	
	return {messages: messages, fields: fields, hasError: messages.length !== 0};

    },
    collectionToJSON: function(collection) {
	var result = [];
	for (var key in collection) {
	    result.push(collection[key].toJSON());
	}
	return result;
    },
    addPlace: function(key, placeModel) {
	var places = this.get('places');
	places[key] = placeModel;
    },
    removePlace: function(key) {
	var places = this.get('places');
	delete places[key];
    },
    getPlaceById: function(key) {
	var places = this.get('places');
	return places[key];
    },  
    prepareModelState: function(data) {
	//Create new	
	var map = data.map.configuration;
	map.id = data.map.id;
	return map;
    },
    load: function(data) {
	var modelState = this.prepareModelState(data);
	for (var key in modelState) {

	    var value = modelState[key];
	    //Check if connection object
	    if (Object.prototype.toString.call(value) === '[object Array]') {
		this.fillFromCollection(key, value);
	    } else {
		this.set(key, value);
	    }
	}
    },
    fillFromCollection: function(type, collection) {
	//Prepare collection
	this.set(type, {});
	for (var key in collection) {
	    var subModelState = collection[key];
	    //Check if valid object type
	    if (Object.prototype.toString.call(subModelState) !== '[object Object]') {
		continue;
	    }
	    //inject channel
	    subModelState['channel'] = this.get('channel');

	    var ident = 'ident' + Math.floor(Math.random() * 100000);
	    switch (type) {
		case 'places':
		    if (subModelState['details'] !== undefined) {
			subModelState['details'] = subModelState['details'].replace(/\\/g, "");
		    }
		    var place = new PlaceModel(subModelState);
		    place.set('id', ident);
		    this.addPlace(ident, place);
		    break;		
	    }

	}
    }
});