
/**
 * Generic accordion implementation 
 */
var AbstractAccordionView = BaseView.extend({
    events: {
	'click .add': 'addNew',
	'click .remove': 'remove'
    },
    /**
     * Get accordion DOM element
     */
    getAccordion: function() {
	return jQuery(this.getAccordionIdentifier());
    },
    /**
     * Get accordion DOM element identifier
     */
    getAccordionIdentifier: function() {
	return "#" + this.getElId() + " .accordion";
    },
    /**
     * Perform required initializations
     */
    initAccordionControl: function() {
	this.getAccordion().accordion();
    },
    /**
     *Get accordion index by element identifier
     */
    resolveAccordionIndexById: function(id) {
	var index = 0;
	this.getAccordion().children('.accordion-content').each(function(i) {
	    if (id === this.id) {
		index = i;
		return;
	    }
	});

	return index;
    },
    buildAccordionElementIdentifier: function() {
	return 'ident' + Math.floor(Math.random() * 100000);
    },
    /**
     * Add new accordion element
     */
    addNew: function() {
	//Create identifier
	var newElementId = this.buildAccordionElementIdentifier();

	//Create HTML and attache it to DOM
	var accordionElement = this.createAccordionElement(newElementId);
	this.getAccordion().append(accordionElement);

	//Create associated model
	this.createAccordionElementDataModel(newElementId);
	this.afterElementCreation(newElementId);

	//Refresh UI
	this.getAccordion().accordion('refresh');

	return newElementId;
    },
    bindModel: function(id, model) {
	//Create identifier
	var newElementId = id;

	//Create HTML and attache it to DOM
	var accordionElement = this.createAccordionElement(newElementId);
	this.getAccordion().append(accordionElement);
	this.afterElementCreation(newElementId);

	//Refresh UI
	this.getAccordion().accordion('refresh');
    },
    refresh: function() {
	this.getAccordion().accordion('refresh');
    },
    /**
     * Build element, abstract method to be implemented in children classes
     */
    createAccordionElement: function(newElementId) {
	//Implementation will be provided by children implementations
    },
    /**
     * Build element model, abstract method to be implemented in children classes
     */
    createAccordionElementDataModel: function(newElementId) {
	//Implementation will be provided by children implementations
    },
    /**
     * Anny additional work to be done after elemnt creation
     */
    afterElementCreation: function(newElementId) {
	//Implementation will be provided by children implementations if required
    },
    /**
     * Remove selected accordion element
     */
    remove: function(event) {
	var selectedAccordionElement = event.currentTarget;
	var removingElementId = jQuery(selectedAccordionElement).attr('identif');
	jQuery(event.currentTarget).parent('h3').next('div').andSelf().remove();
	this.getAccordion().accordion('refresh');
	this.afterElementRemoval(removingElementId);
    },
    /**
     * Anny additional work to be done after elemnt removal
     */
    afterElementRemoval: function(elementId) {
	//Implementation will be provided by children implementations if required
    },
    /**
     * Select accordion element
     */
    expand: function(elementId) {
	var index = this.resolveAccordionIndexById(elementId);
	this.getAccordion().accordion("option", "active", index);
    }

});