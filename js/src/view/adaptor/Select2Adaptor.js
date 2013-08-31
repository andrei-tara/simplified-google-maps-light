
var Select2Adaptor = BaseView.extend({
    initialize: function(config) {
	this.config = config;
	//Get selection
	var selectedItem = config.provider.valueOf(function(obj) {
	    return config.onMatchSelection(obj);
	});

	var selector = jQuery(config.el);

	this.refreshSelect2(selector);

	if (selectedItem !== undefined) {
	    selector.select2('val', selectedItem.id);
	}

	selector.on("select2-selecting", function(event) {
	    config.onSelect(event.object);
	});

	EventDistpatcher.use(config.channel).on('select2.update', this.onDataUpdate, this);
    },
    refreshSelect2: function(selector) {
	var config = this.config;

	selector.select2('destroy');
	selector.select2({
	    data: config.provider.getDataModel(),
	    formatResult: function(item) {
		return config.onFormatResult(item);
	    },
	    formatSelection: function(item) {
		return config.onFormatSelection(item);
	    },
	    escapeMarkup: function(item) {
		return item;
	    }
	}, true);

    },
    onDataUpdate: function(attachment) {
	var selector = jQuery(this.config.el);

	if (attachment !== undefined) {
	    this.refreshSelect2(selector);
	    selector.select2('val', attachment.id);
	}
    }
});