/**
 * Provide all opperations required to manipute the map
 * @type @exp;BaseManager@call;extend
 */
var MapManager = BaseManager.extend({
    state: {
	markers: {},
	infowindows: {}
    },
    initialize: function(config) {
	this.initMap(config.canvas);

	var channel = this.get('channel');

	EventDistpatcher.use(channel).on('map.updatecenter', this.onChangeMapPosition, this);
	EventDistpatcher.use(channel).on('map.updatezoom', this.onChangeMapZoom, this);
	EventDistpatcher.use(channel).on('map.updatetype', this.onChangeMapType, this);
	//Place events	
	EventDistpatcher.use(channel).on('place.add', this.onAddPlaces, this);
	EventDistpatcher.use(channel).on('place.remove', this.onRemovePlace, this);
	EventDistpatcher.use(channel).on('place.update', this.onUpdatePlace, this);
	EventDistpatcher.use(channel).on('styler.update', this.onUpdateStyle, this);
	EventDistpatcher.use(channel).on('map.updatesize', this.onUpdateSize, this);
    },
    /**
     * Prepare map
     */
    initMap: function(mapCanvas) {

	var channel = this.get('channel');
	var mapOptions = {
	    zoom: 3,
	    center: new google.maps.LatLng(39.5312, -102.6502),
	    panControl: true,
	    zoomControl: true,
	    scaleControl: true,
	    mapTypeControlOptions: {
		mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
	    }
	};
	this.map = new google.maps.Map(document.getElementById(mapCanvas), mapOptions);
	EventDistpatcher.use(channel).trigger('map.updatecenter', this.map.getCenter().lat(), this.map.getCenter().lng());
	//Hook map drag event
	google.maps.event.addListener(this.map, 'dragend', function() {
	    EventDistpatcher.use(channel).trigger('map.updatecenter', this.getCenter().lat(), this.getCenter().lng());
	});
	//Hook map zoom changed event
	google.maps.event.addListener(this.map, 'zoom_changed', function() {
	    EventDistpatcher.use(channel).trigger('map.updatezoom', this.getZoom());
	});
    },
    onChangeMapPosition: function(lat, lng) {
	if (lat === undefined || lng === undefined) {
	    return;
	}
	this.map.setCenter(new google.maps.LatLng(lat, lng));
    },
    onChangeMapType: function(type) {
	this.map.setMapTypeId(type);
    },
    onChangeMapZoom: function(zoomLevel) {
	if (zoomLevel === this.map.getZoom() || zoomLevel === NaN || zoomLevel === undefined) {
	    return;
	}
	this.map.setZoom(zoomLevel);
    },
    onUpdateStyle: function(stylers) {
	if (stylers === undefined) {
	    return;
	}
	this.map.setOptions({styles: stylers});
    },
    onUpdateSize: function(width, height) {
	if (width === undefined || height === undefined) {
	    return;
	}
	jQuery('#' + this.get('canvas')).width(width).height(height);

	google.maps.event.trigger(this.map, 'resize');
    },
    /**
     * Perform required actions on update map model
     */
    onAddPlaces: function(place) {

	if (place.get('rendered') === true) {
	    return;
	}

	if (place.get('lat') === undefined || place.get('lng') === undefined) {
	    var center = this.map.getCenter();
	    place.set('lat', center.lat());
	    place.set('lng', center.lng());
	}
	place.set('rendered', true);
	this.attachToMap(place);
	this.bindPlaceOnMapEvents(place);
    },
    /**
     * Get Place representation as Google map marker 
     */
    attachToMap: function(place) {

	var map = this.map;
	var marker = new google.maps.Marker({
	    position: new google.maps.LatLng(place.get('lat'), place.get('lng')),
	    map: this.map,
	    draggable: !this.get('readonly'),
	    title: place.get('name')
	});
	var infowindow = this.getAssocoatedInfoView(place);
	//Add marker info box
	google.maps.event.addListener(marker, 'click', function() {
	    infowindow.open(map, marker);
	});
	//place.set('marker', marker);
	this.state.markers[place.get('id')] = marker;
	place.set('rendered', true);
	return marker;
    },
    getAssocoatedInfoView: function(place) {
	if (this.state.infowindows[place.get('id')] === undefined) {
	    this.state.infowindows[place.get('id')] = new google.maps.InfoWindow({
		content: place.get('details')
	    });
	}
	return this.state.infowindows[place.get('id')];
    },
    bindPlaceOnMapEvents: function(place) {
	var map = this.map;
	var marker = this.state.markers[place.get('id')];
	var channel = this.get('channel');
	// Register Custom "dragend" Event
	google.maps.event.addListener(marker, 'dragend', function() {
	    // Get the Current position, where the pointer was dropped
	    var point = marker.getPosition();
	    //Update place
	    place.set('lat', point.lat())
	    place.set('lng', point.lng());
	});
	google.maps.event.addListener(marker, 'mousedown', function() {
	    EventDistpatcher.use(channel).trigger('place.select', place);
	});
    },
    /**
     * 
     */
    onUpdatePlace: function(place) {
	var id = place.get('id');
	var placeMarker = this.state.markers[id];
	placeMarker.setTitle(place.get('name'));
	placeMarker.setIcon(place.get('icon'));
	var infowindow = this.state.infowindows[id];
	infowindow.setContent(place.get('details'));
    },
    onRemovePlace: function(place) {
	var id = place.get('id');
	var marker = this.state.markers[id];
	if (marker !== undefined) {
	    marker.setMap(null);
	}
	//place.get('marker').setMap(null);
    }
});
