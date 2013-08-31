<?php

/**
 * It isolates the access to DB,map DAO models
 */
class Cetabo_DataProvider {

    /**
     * Global access point instance
     * @var Cetabo_DataProvider 
     */
    private static $instance;

    /**
     * Provide global access point
     * @return Cetabo_DataProvider
     */
    public static function instance() {
	if (self::$instance == null) {
	    self::$instance = new Cetabo_DataProvider();
	}
	return self::$instance;
    }

    /**
     * Setup Database structure
     * @global type $wpdb
     */
    public function install_database() {
	global $wpdb;
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

	$map_sql = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}maps (
		    id INT NOT NULL AUTO_INCREMENT,
		    name VARCHAR(200) NULL,
		    configuration TEXT NULL, PRIMARY KEY (id)
		    ) ENGINE = InnoDB; ";
	dbDelta($map_sql);
    }

    /**
     * Delte specified map
     * @global wpdb $wpdb
     * @param type $id
     * @return boolean
     */
    public function delete_map($id) {
	if (!is_numeric($id)) {
	    return false;
	}
	global $wpdb;
	$sql = "DELETE FROM {$wpdb->prefix}maps where id={$id}";
	return $this->execute($sql);
    }

    /**
     * Create or update map
     * @global wpdb $wpdb
     * @param type $map_object
     * @return type
     */
    public function persist_map($map_object) {
	$id = Cetabo_Helper::arr_get($map_object, 'id');
	$create_new = (!is_numeric($id));
	$name = Cetabo_Helper::arr_get($map_object, 'name');
	$serialized_object = base64_encode(serialize($map_object));
	global $wpdb;
	if ($create_new) {
	    $sql = "INSERT INTO {$wpdb->prefix}maps (`name`, `configuration`) VALUES ('{$name}','{$serialized_object}')";
	} else {
	    $sql = "UPDATE {$wpdb->prefix}maps SET configuration='{$serialized_object}', name='{$name}' WHERE id='{$id}'";
	}
	return $this->execute($sql);
    }

    /**
     * Load may by id
     * @global wpdb $wpdb
     * @param int $id
     * @return null
     */
    public function load_map($id) {
	if (!is_numeric($id)) {
	    return null;
	}
	global $wpdb;
	$sql = "SELECT * FROM {$wpdb->prefix}maps where id={$id}";
	$rows = $wpdb->get_results($sql);
	$result = (count($rows) > 0) ? $rows[0] : null;
	if ($result != null) {
	    $result->configuration = unserialize(base64_decode($result->configuration));
	}
	return $result;
    }

    /**
     * Count all existing maps
     * @global type $wpdb
     * @return type
     */
    public function count_all_maps() {
	global $wpdb;
	$result = $wpdb->get_results("SELECT count(*) as count FROM {$wpdb->prefix}maps");
	return $result[0]->count;
    }

    /**
     * Check if there is a map with specified id
     * @global wpdb $wpdb
     * @param int $id
     * @return boolean
     */
    public function is_valid_map($id) {
	global $wpdb;
	$result = $wpdb->get_results("SELECT count(*) as count FROM {$wpdb->prefix}maps where id={$id}");
	return $result[0]->count == 1;
    }

    /**
     * Get paginated list of maps
     * @global wpdb $wpdb
     * @param int $perpage elements to be displayed per page
     * @param int $page current page
     * @param array $ordering order by configuration
     * @return type
     */
    public function get_list($perpage, $page, $ordering) {
	global $wpdb;
	//Number of elements in your table?
	$totalitems = $this->count_all_maps();
	$page = mysql_real_escape_string($page);

	$left = ($page - 1) * $perpage;
	$right = ($page) * $perpage;

	$sql = "SELECT * FROM {$wpdb->prefix}maps ORDER BY {$ordering['column']} {$ordering['direction']} LIMIT {$left},{$right}";

	return array(
	    'items' => $wpdb->get_results($sql),
	    'pagination' => array(
		'total_items' => $totalitems,
		'per_page' => $perpage,
		'total_pages' => ceil($totalitems / $perpage))
	);
    }

    /**
     * Execute specified query
     * @global wpdb $wpdb
     * @param string $sql
     * @return boolean
     */
    private function execute($sql) {
	global $wpdb;
	return $wpdb->query($sql);
    }

}