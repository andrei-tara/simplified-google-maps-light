
/**
 * Provide functionality to load and display map
 * 
 */
var MapView = BaseView.extend({
    initialize: function(config) {

	this.config = config;

	var channel = this.getChannel();
	EventDistpatcher.use(channel).on('map.load', this.onLoadMapCallback, this);

	this.initConnection(config.url.load);
	this.initModel();
	this.initMapManager();


    },
    /**
     * Create ajax connector
     */
    initConnection: function() {
	var channel = this.getChannel();
	this.connectionManager = new ConnectionManager({channel: channel});
    },
    /**
     * Init model
     */
    initModel: function() {	
	this.model = new MapModel(this.getDefaultModelState());
    },
    getDefaultModelState: function() {
	var channel = this.getChannel();
	return {readonly: this.isReadOnly(), channel: channel};
    },
    /**
     * Init map manager
     */
    initMapManager: function() {
	var configuration = this.getMapConfiguration();
	this.mapManager = new MapManager(configuration);
    },
    /**
     * Holds the map configuration, override this for custom configurations in 
     * descendent classes
     */
    getMapConfiguration: function() {
	return {canvas: this.getElId(), readonly: this.isReadOnly(), channel: this.getChannel()};
    },
    getConfiguration: function() {
	return this.config;
    },
    isReadOnly: function() {
	return true;
    },
    /**
     * Load map with specified id
     */
    loadModel: function(id) {
	var instance = this;
	var channel = this.getChannel();
	//Perform ajax map loading
	EventDistpatcher.use(channel).trigger('backend.send', {
	    'content': {id: id},
	    'url': this.getLoadURL(),
	    'callback': {success: function(data) {
		    instance.model.load(data);
		    EventDistpatcher.use(channel).trigger('map.load', instance.model);
		}
	    }
	});
    },
    getLoadURL: function() {
	return this.getConfiguration().url.load;
    },
    onLoadMapCallback: function(model) {

	var channel = this.getChannel();

	//Map places
	var places = model.get('places');
	for (var key in places) {
	    EventDistpatcher.use(channel).trigger('place.add', places[key]);
	    EventDistpatcher.use(channel).trigger('place.update', places[key]);
	}
	
	//Map general settings	
	if (this.isReadOnly()) {
	    EventDistpatcher.use(channel).trigger('map.updatesize', model.get('width'), model.get('height'));
	}
	
	EventDistpatcher.use(channel).trigger('map.updatezoom', parseInt(model.get('zoom')));
	EventDistpatcher.use(channel).trigger('map.updatecenter', model.get('lat'), model.get('lng'));
	EventDistpatcher.use(channel).trigger('map.updatetype', model.get('type'));	

    }
});