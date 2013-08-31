<script>
    jQuery(function() {
	var connection = new ConnectionManager({channel: 'GLOBAL'});
	jQuery('.remove').click(function(e) {
		e.preventDefault();
		
	    var id = jQuery(this).attr('map-id');
	    var name = jQuery(this).attr('map-name');
	    var url = "<?php echo Cetabo_Helper::ajax_action_url('delete'); ?>&id=" + id;
	    var message = {
		url: url,
		content: '',
		action: 'delete',
		callback: {
		    success: function() {
			location.reload();
		    }
		}
	    };
	    jQuery("#dialog-confirm").html("Delete " + name + " ? are you sure ?");
	    jQuery("#dialog-confirm").dialog({
	    title: 'Delete map',	
		resizable: false,
		height: 140,
		modal: true,
		buttons: {
		    "Yes": function() {
			connection.send(message);
		    },
		    "No": function() {
			jQuery(this).dialog("close");
		    }
		}
	    });


	});
    });
</script>

<div class="wrap">

    <div id="icon-map" class="icon32">
	<h2>Maps <a class="add-new-h2" href="<?php echo $new_url; ?>">Add New</a></h2>
    </div>
    
    

    <div style="display:none" id="dialog-confirm"></div>
    <form id="map-list" method="get">	
	<input type="hidden" name="page" value="<?php echo $_REQUEST['page'] ?>" />		
	<?php $map_list_table->display() ?>
    </form>

</div>