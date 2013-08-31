var BaseProvider = Backbone.Model.extend({
    /**
     * Provide source data model
     */
    getDataModel: function() {
	var result = [];
	var dataSet = this.getData();
	for (var i = 0; i < dataSet.length; i++) {
	    var data = dataSet[i];
	    result.push(data);
	}
	return result;
    },
    /**
     * Find custom value by a specified comaprator function
     */
    valueOf: function(comparator) {
	var dataSet = this.getData();
	for (var key in dataSet) {
	    if (comparator(dataSet[key])) {
		return dataSet[key];
	    }
	}
	return undefined;
    },	    
    getData: function() {
	return this.get('data');
    },
    setData: function(rawData) {
	this.set('data', rawData);
    }
});