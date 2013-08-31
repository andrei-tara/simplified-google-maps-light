<?php

/**
 * Handles loading of CSS, JS and images files
 */
class Cetabo_ResourceLoader {

    private static $instance;
    private $resource_counter = array();

    /**
     * Provide global access point
     * @return Cetabo_ResourceLoader
     */
    public static function instance() {
	if (self::$instance == null) {
	    self::$instance = new Cetabo_ResourceLoader();
	}
	return self::$instance;
    }

    /**
     * Load css file 
     * @param string $path
     * @param boolean $is_local
     */
    public function load_css($path, $is_local = true) {
	$params = $this->prepare_params($path, $is_local);
	if ($params == null) {
	    return; //bad file
	}
	wp_register_style($params['name'], $params['url']);
	wp_enqueue_style($params['name']);
    }

    /**
     * Load css bundle
     * @param array $bundle
     */
    public function load_css_bundle($bundle) {
	foreach ($bundle as $bundle_entry) {
	    if (is_array($bundle_entry)) {
		$path = Cetabo_Helper::arr_get($bundle_entry, 0);
		$is_local = Cetabo_Helper::arr_get($bundle_entry, 1);
	    } else {
		$path = $bundle_entry;
		$is_local = true;
	    }
	    $this->load_css($path, $is_local);
	}
    }

    /**
     * Load js file
     * @param string $path
     * @param boolean $is_local
     */
    public function load_js($path, $is_local = true) {
	$params = $this->prepare_params($path, $is_local);
	if ($params == null) {
	    //echo (Cetabo_Registry::get('PLUGIN_DEBUG_MODE')) ? "Invalid path {$path}" : '';
	    return; //bad file
	}

	$dependencies = array(
	    'jquery',
	    'jquery-ui-accordion',
	    'jquery-ui-spinner',
	    'jquery-ui-slider',
	    'jquery-ui-tabs',
	    'jquery-ui-dialog',
	    'jquery-ui-autocomplete',
	);	
	wp_register_script($params['name'], $params['url'], $dependencies); //depends on jquery
	wp_enqueue_script($params['name']);
    }

    /**
     * Load script bundle
     * @param array $bundle
     */
    public function load_js_bundle($bundle) {
	foreach ($bundle as $bundle_entry) {
	    if (is_array($bundle_entry)) {
		$path = Cetabo_Helper::arr_get($bundle_entry, 0);
		$is_local = Cetabo_Helper::arr_get($bundle_entry, 1);
	    } else {
		$path = $bundle_entry;
		$is_local = true;
	    }
	    $this->load_js($path, $is_local);
	}
    }

    private function clean($file_path) {
	$file = explode('?', $file_path);
	return $file[0];
    }

    private function identifier($file_path) {
	$identifier = $this->clean($file_path);

	$count = Cetabo_Helper::arr_get($this->resource_counter, $identifier, 0);
	$this->resource_counter[$identifier] = 1 + $count;

	return $identifier . $this->resource_counter[$identifier];
    }

    private function prepare_params($file_path, $is_local = true) {
	$name = str_replace(array('/', ':', '_', '.'), '-', Cetabo_Registry::get('PLUGIN_SLUG') . '-' . $this->identifier($file_path));
	$file = Cetabo_Registry::get('PLUGIN_DIR') . $this->clean($file_path);
	$url = ($is_local) ? Cetabo_Registry::get('PLUGIN_URL') . $file_path : $file_path;

	if (!file_exists($file) && $is_local) {
	    return null;
	}

	return array(
	    'name' => $name,
	    'url' => $url
	);
    }

    /**
     * Get image file URL
     * @param string $file
     * @return string
     */
    public function load_img($file) {
	return Cetabo_Registry::get('PLUGIN_URL') . $file;
    }

}