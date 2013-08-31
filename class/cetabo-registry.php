<?php

/**
 * Container used to globally store and pass values
 */
class Cetabo_Registry {

    private static $registry = array();

    public static function get($key) {
	return Cetabo_Helper::arr_get(self::$registry, $key, null);
    }

    public static function put($key, $value) {
	self::$registry[$key] = $value;
    }

}