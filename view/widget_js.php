<?php
require_once(dirname(__FILE__) . '/../class/cetabo-helper.php');
header('Content-Type: application/javascript');

$id = Cetabo_Helper::arr_get($_GET, 'id');
$url = Cetabo_Helper::arr_get($_GET, 'url');
if (!is_numeric($id)) {
    return;
}
?>
jQuery(function() {
    var mapView=new MapView({
	el: jQuery("#map<?php echo $id; ?>"),
	url:{load: <?php echo json_encode(base64_decode($url)); ?>}	
    });    
    mapView.loadModel(<?php echo json_encode($id); ?>);
});

