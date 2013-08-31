<?php

/*
  Plugin Name: Simplified Google Maps Light
  Plugin URI: http://cetabo.com
  Description: A plugin to create awesomen google maps
  Version: 1.0
  Author:
  Author Email: contact@cetabo.com
  License: comercial

 */


require_once(plugin_dir_path(__FILE__) . 'class/cetabo-map-list-table.php');
require_once(plugin_dir_path(__FILE__) . 'class/cetabo-helper.php');
require_once(plugin_dir_path(__FILE__) . 'class/cetabo-dataprovider.php');
require_once(plugin_dir_path(__FILE__) . 'class/cetabo-registry.php');
require_once(plugin_dir_path(__FILE__) . 'class/cetabo-resource-loader.php');
require_once(plugin_dir_path(__FILE__) . 'class/cetabo-controller.php');

class Cetabo_GoogleMaps extends Cetabo_Controller {
    /* --------------------------------------------*
     * Constants
     * -------------------------------------------- */

    /**
     * Constructor
     */
    function __construct() {

	Cetabo_Registry::put('PLUGIN_URL', plugin_dir_url(__FILE__));
	Cetabo_Registry::put('PLUGIN_DIR', plugin_dir_path(__FILE__));
	Cetabo_Registry::put('PLUGIN_SLUG', 'cetabo_googlemaps');
	Cetabo_Registry::put('PLUGIN_NAME', 'Cetabo_GoogleMaps');

	Cetabo_Registry::put('PLUGIN_DEBUG_MODE', false);
	Cetabo_Registry::put('PLUGIN_VERSION', '1.0');


	//register an activation hook for the plugin
	register_activation_hook(__FILE__, array(&$this, 'install_cetabo_googlemaps'));
	//Hook up to the init action
	add_action('init', array(&$this, 'init_cetabo_googlemaps'));
    }

    /**
     * Runs when the plugin is activated
     */
    function install_cetabo_googlemaps() {
	Cetabo_DataProvider::instance()->install_database();
    }

    /**
     * Runs when the plugin is initialized
     */
    function init_cetabo_googlemaps() {
	// Setup localization
	load_plugin_textdomain(Cetabo_Registry::get('PLUGIN_SLUG'), false, dirname(plugin_basename(__FILE__)) . '/lang');
	// Load JavaScript and stylesheets
	$this->register_scripts_and_styles();

	// Register the shortcode [cetabo_map]
	add_shortcode('cetabo_map', array(&$this, 'render_shortcode'));

	if (is_admin()) {
	    //this will run when in the WordPress admin	    
	    add_action('admin_menu', array(&$this, 'prepare_admin_menu'));
	    add_action('wp_ajax_persist', array(&$this, 'persist_map'));
	    add_action('wp_ajax_delete', array(&$this, 'delete_map'));
	} else {
	    
	}

	add_action('wp_ajax_load', array(&$this, 'load_map'));
	add_action('wp_ajax_nopriv_load', array(&$this, 'load_map'));
    }

    /**
     * Execute when shortcode is rendered     
     */
    function render_shortcode($atts) {
	// Extract the attributes
	extract(shortcode_atts(array('id' => ''), $atts));

	if (!Cetabo_DataProvider::instance()->is_valid_map($id)) {
	    return; // not reander 
	}

	$encoded_load_url = base64_encode(Cetabo_Helper::ajax_action_url('load'));
	Cetabo_ResourceLoader::instance()->load_js("view/widget_js.php?id={$id}&url={$encoded_load_url}");
	return $this->capture('widget', array('id' => $id));
    }

    /**
     * Prepare admin menu 
     */
    function prepare_admin_menu() {
	//Prepare main menu
	$icon = Cetabo_ResourceLoader::instance()->load_img('img/menu_inactive.png');
	$title = "Maps";
	$capability = 'manage_options';
	add_menu_page('cetabo_googlemaps', $title, $capability, Cetabo_Registry::get('PLUGIN_SLUG'), array(&$this, 'action_distpatcher'), $icon, 22);

	add_submenu_page(Cetabo_Registry::get('PLUGIN_SLUG'), $title, 'All Maps', $capability, Cetabo_Registry::get('PLUGIN_SLUG'), array(&$this, 'action_distpatcher'));
	add_submenu_page(Cetabo_Registry::get('PLUGIN_SLUG'), $title, 'Add New', $capability, Cetabo_Registry::get('PLUGIN_SLUG') . '_add', array(&$this, 'add_new_map'));
	add_submenu_page(Cetabo_Registry::get('PLUGIN_SLUG'), $title, 'Get Pro Version', $capability, Cetabo_Registry::get('PLUGIN_SLUG') . '_pro', array(&$this, 'get_pro_version'));
    }

    function get_pro_version() {
	$this->render('pro/index');
    }

    /**
     * Create new map
     */
    function add_new_map() {
	$this->edit_map(null, false);
    }

    /**
     * Handle action
     */
    function action_distpatcher() {
	$action = (array_key_exists('action', $_REQUEST)) ? $_REQUEST['action'] : '';
	$id = (array_key_exists('id', $_REQUEST)) ? $_REQUEST['id'] : '';

	switch ($action) {
	    case 'edit':
		$this->edit_map($id, false);
		break;
	    case 'preview':
		$this->edit_map($id, true);
		break;
	    default :
		$this->list_maps();
		break;
	}
    }

    /**
     * Save map
     */
    function persist_map() {
	$success = Cetabo_DataProvider::instance()->persist_map($_POST);
	echo json_encode(array('success' => $success));
	die();
    }

    /**
     * Map AJAX load
     */
    function load_map() {
	$id = Cetabo_Helper::arr_get($_REQUEST, 'id');
	$data = array(
	    'return' => menu_page_url(Cetabo_Registry::get('PLUGIN_SLUG'), false),
	    'map' => Cetabo_DataProvider::instance()->load_map($id),
	);
	echo json_encode($data);
	die();
    }

    /**
     * Delete map
     */
    function delete_map() {
	$id = Cetabo_Helper::arr_get($_REQUEST, 'id');
	$success = Cetabo_DataProvider::instance()->delete_map($id);
	echo json_encode(array('success' => $success));
	die();
    }

    /**
     * Edit map     
     */
    function edit_map($id, $readonly) {
	$this->render('edit', array(
	    'id' => $id,
	    'readonly' => $readonly,
	    'url' => array(
		'save' => Cetabo_Helper::ajax_action_url('persist'),
		'load' => Cetabo_Helper::ajax_action_url('load'),
		'back' => Cetabo_Helper::action_url(''),
		'edit' => Cetabo_Helper::action_url("edit") . "&id={$id}",
	)));
    }

    /**
     * Disaply map list
     */
    function list_maps() {
	$edit_url = Cetabo_Helper::action_url('edit');
	//Create an instance of our package class...
	$map_list_table = new Cetabo_Map_List_Table();
	//Fetch, prepare, sort, and filter our data...
	$map_list_table->prepare_items();
	$this->render('list', array('map_list_table' => $map_list_table, 'new_url' => $edit_url));
    }

    /**
     * Register scripts common to admin adn frontend
     */
    private function register_core_scripts_and_styles() {

	$lib_bundle = array(
	    //Core dependencies (libs)
	    array('https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false', false),
	    'js/lib/underscore-min.js',
	    'js/lib/backbone-min.js',
	);
	Cetabo_ResourceLoader::instance()->load_js_bundle($lib_bundle);


	//If debug mode use full scripts
	if (Cetabo_Registry::get('PLUGIN_DEBUG_MODE')) {
	    $core_bundle = array(
		'js/src/Prototype.js',
		'js/src/EventDistpatcher.js',
		//Managers
		'js/src/manager/BaseManager.js',
		'js/src/manager/ConnectionManager.js',
		'js/src/manager/MapManager.js',
		//Models
		'js/src/model/PlaceModel.js',
		'js/src/model/MapModel.js',
		//Views
		'js/src/view/BaseView.js',
		'js/src/view/MapView.js',
	    );
	} else {
	    $core_bundle = array('js/cetabo-maps-core.min.js');
	}
	Cetabo_ResourceLoader::instance()->load_js_bundle($core_bundle);
    }

    /**
     * Register admin scripts
     */
    private function register_admin_scripts_and_styles() {
	wp_enqueue_media();

	$lib_bundle = array(
	    //Lib		    	    
	    'js/lib/jquery.ui.addresspicker.js',
	    'js/lib/select2.min.js',
	    'js/lib/jscolor.js',
	);
	Cetabo_ResourceLoader::instance()->load_js_bundle($lib_bundle);

	//If debug mode use full scripts
	if (Cetabo_Registry::get('PLUGIN_DEBUG_MODE')) {
	    $core_bundle = array(
		// Managers
		'js/src/manager/NotificationsManager.js',
		//Models
		'js/src/model/BaseProvider.js',
		'js/src/model/IconProviderModel.js',
		'js/src/model/MapTypeProviderModel.js',
		//Fragments views	   
		'js/src/view/fragment/AbstractAccordionView.js',
		'js/src/view/fragment/PlacesView.js',
		'js/src/view/fragment/SettingsView.js',
		'js/src/view/adaptor/Select2Adaptor.js',
		'js/src/view/EditableMapView.js',
		'js/src/Bootstrap.js',
	    );
	} else {
	    $core_bundle = array('js/cetabo-maps-backend.min.js');
	}
	Cetabo_ResourceLoader::instance()->load_js_bundle($core_bundle);



	$css_bundle = Array(
	    'css/jquery-ui.css',
	    'css/font-face.css',
	    'css/font-awesome.min.css',
	    'css/backend.css',
	);
	Cetabo_ResourceLoader::instance()->load_css_bundle($css_bundle);
    }

    /**
     * Register frontend scripts
     */
    private function register_frontend_scripts_and_styles() {
	Cetabo_ResourceLoader::instance()->load_css('css/frontend.css');
    }

    /**
     * Registers and enqueues stylesheets for the administration panel and the
     * public facing site.
     */
    private function register_scripts_and_styles() {

	$this->register_core_scripts_and_styles();
	if (is_admin()) {
	    $this->register_admin_scripts_and_styles();
	} else {
	    $this->register_frontend_scripts_and_styles();
	}
    }

}

//Instanciate plugin
new Cetabo_GoogleMaps();
?>