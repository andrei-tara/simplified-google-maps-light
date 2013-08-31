var MapTypeProviderModel = BaseProvider.extend({
    initialize: function() {
	var data = [
	    {
		text: "ROADMAP",
		id: google.maps.MapTypeId.ROADMAP,
		description: "Displays the default road map view"

	    },
	    {
		text: "SATELLITE",
		id: google.maps.MapTypeId.SATELLITE,
		description: "Displays Google Earth satellite images"

	    },
	    {
		text: "HYBRID",
		id: google.maps.MapTypeId.HYBRID,
		description: "Displays a mixture of normal and satellite views"

	    },
	    {
		text: "TERRAIN",
		id: google.maps.MapTypeId.TERRAIN,
		description: "Displays a physical map based on terrain information"
	    }

	];

	this.setData(data);
    }

});