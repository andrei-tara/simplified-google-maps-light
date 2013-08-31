<?php

//Our class extends the WP_List_Table class, so we need to make sure that it's there
if (!class_exists('WP_List_Table')) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

/**
 * It enacpsulate logic to work with lists on WP
 */
class Cetabo_Map_List_Table extends WP_List_Table {

    function __construct() {
	//global $status, $page;
	//Set parent defaults
	parent::__construct(array(
	    'singular' => 'map', //singular name of the listed records
	    'plural' => 'maps', //plural name of the listed records
	    'ajax' => false //does this table support ajax?
	));
    }

    /**
     * Column configuration
     * @param type $item
     * @param type $column_name
     * @return type
     */
    function column_default($item, $column_name) {
	switch ($column_name) {
	    case 'name':
		//return $item->$column_name;
		//Build row actions
		$actions = array(
		    'view' => sprintf('<a href="?page=%s&action=%s&id=%s">View</a>', $_REQUEST['page'], 'preview', $item->id),
		    'edit' => sprintf('<a href="?page=%s&action=%s&id=%s">Edit</a>', $_REQUEST['page'], 'edit', $item->id),
		    'delete' => sprintf('<a class="remove" map-id="%s" map-name="%s" href="#">Delete</a>', $item->id, $item->name),
		);

		//Return the title contents
		return sprintf('%1$s <span style="color:silver"></span>%3$s',
			/* $1%s */ $item->name,
			/* $2%s */ $item->id,
			/* $3%s */ $this->row_actions($actions)
		);

	    case 'shortcode':
		return "[cetabo_map id='{$item->id}']";

	    default:
		return;
	}
    }

    /**
     * Column 'selector'
     * @param type $item
     * @return type
     */
    function column_cb($item) {
	return sprintf("<img src='%s' style='margin-left: 10px'/>", Cetabo_ResourceLoader::instance()->load_img('img/menu_active.png'));
    }

    /**
     * Column header
     * @return string
     */
    function get_columns() {
	$columns = array(
	    'cb' => '',
	    'name' => 'Name',
	    'shortcode' => 'Shortcode',
	);
	return $columns;
    }

    /**
     * Provide columns that are used for sorting
     * @return array
     */
    function get_sortable_columns() {
	$sortable_columns = array(
	    'name' => array('name', false), //true means it's already sorted
	);
	return $sortable_columns;
    }

    /**
     * Bulk action, not used currenty
     */
    function process_bulk_action() {

	//Detect when a bulk action is being triggered...
	if ('delete' === $this->current_action()) {
	    wp_die('Items deleted (or they would be if we had items to delete)!');
	}
    }

    /**
     * Prepare item
     */
    function prepare_items() {
	$columns = $this->get_columns();
	$hidden = array();
	$sortable = $this->get_sortable_columns();

	//Handle column ordering
	$direction = Cetabo_Helper::arr_get($_GET, 'order', 'asc');
	if (!in_array($direction, array('asc', 'desc'))) {
	    $direction = 'asc';
	}
	$ordering = array('direction' => $direction, 'column' => 'name');

	$this->_column_headers = array($columns, $hidden, $sortable);
	$this->process_bulk_action();



	$result = Cetabo_DataProvider::instance()->get_list(7, $this->get_pagenum(), $ordering);

	$this->items = $result['items'];
	$this->set_pagination_args($result['pagination']);
    }

}
