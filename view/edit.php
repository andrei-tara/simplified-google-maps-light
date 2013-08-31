<script>
    function __cetaboMapBootstrap() {

	switchEditors.switchto({id: '___hiddenEditor___-tmce'});

	var editView = new EditableMapView({
	    el: jQuery("#map-editor"),
	    url: <?php echo json_encode($url); ?>,
	    readonly:<?php echo json_encode($readonly); ?>,
	    baseURL:<?php echo json_encode(Cetabo_Registry::get('PLUGIN_URL')); ?>
	});

<?php if (is_numeric($id)): ?>
    	jQuery("#notification")
    		.html("Loading ...")
    		.fadeIn(500)
    		.delay(3000)
    		.fadeOut();
    	setTimeout(function() {
    	    editView.loadModel(<?php echo json_encode($id); ?>);
    	}, 1000);
<?php endif; ?>
    }
</script>
<div class="wrap">

    <div id="map-editor">

	<div class="header">
	    <div id="icon-map">
		<h2>Maps</h2>
	    </div>
	    <?php if (!$readonly): ?>
    	    <div class="map-save">
    		<strong>Do no forget to save changes</strong>
    		<button class="save btn"><i class="icon-save"></i>Save Map </button>
    	    </div>
	    <?php else: ?>
    	    <div class="map-edit">    		
    		<button class="edit btn"> Edit Map </button>
    	    </div>
	    <?php endif; ?>




	</div><!-- /header -->
	<div id="notification" class="ui-state-highlight hide"></div>

	<div class="content">
	    <div class="inside">
		<div class="top">
		    <div class="map-name" <?php if ($readonly): ?>style="width:100%"<?php endif; ?>>
			<input type='text' placeholder="Map name" class='name block' />		
		    </div>
		    <?php if (!$readonly): ?>
    		    <div class="map-search">
    			<input type='text' placeholder="Search for location" class='addresspicker block' />
    			<button id="btn-search" class="btn">search</button>
    		    </div>	
		    <?php endif; ?>
		</div><!-- /top -->

		<div class="bottom">
		    <!-- MAP -->
		    <div class="map"  <?php if ($readonly): ?>style="width:100%"<?php endif; ?>>
			<div id="map-canvas"></div>
		    </div><!-- /map -->
		    <!-- Control -->
		    <?php if (!$readonly): ?>
    		    <div class="controll">
    			<!-- Tab header -->
    			<ul>
    			    <li><a href="#controll-place" class="tab-place" ><i class="icon-map-marker"></i>Places</a></li>
    			    <li><a href="#controll-settings" class="tab-settings" ><i class="icon-cog"></i>Settings</a></li>    			    
    			</ul>

    			<!-- Tab content -->
    			<div id="controll-place">
    			    <div class="accordion"></div>
    			    <button class="add btn"><i class="icon-plus-sign-alt"></i>Add place </button>
    			</div>


    			<div id="controll-settings">
    			    <div>
    				<!-- Map size -->
    				<div class="control-group">
    				    <h3>Size</h3> 
    				    <fieldset class="col">
    					<label for="map-width">width</label>
    					<input class="width" id="map-width" type="text" />
    				    </fieldset>
    				    <fieldset class="col col2">
    					<label for="map-height">height</label>
    					<input class="height" id="map-height" type="text"/>
    				    </fieldset>
    				</div><!-- /control-group -->
    				<!-- Map center -->
    				<div class="control-group" id="center-details">
    				    <h3>Center</h3> 
    				    <fieldset class="col">									
    					<input class="lat" id="map-lat" type="text"/>
    				    </fieldset>
    				    <fieldset class=" col col2">									
    					<input class="lng" id="map-lng" type="text"/>
    				    </fieldset>
    				</div><!-- /control-group -->
    				<!-- Zoom level -->
    				<div class="control-group">
    				    <h3>Zoom level</h3> 
    				    <div class="zoom"></div>
    				</div><!-- /control-group -->
    				<!-- Map type -->
    				<div class="control-group">
    				    <h3>Map type</h3> 
    				    <div class="maptype" style="width:100%"></div>
    				</div><!-- /control-group -->
    			    </div>
    			</div><!-- /control-settings -->

    		    </div><!-- /map-options -->
		    <?php endif; ?>
		</div><!-- /bottom -->
	    </div>
	</div><!-- /content -->

    </div>

</div>

<div style="display:none">
    <div id="template-place">
	<h3 class="header-{id}"> <div id="name-lable-{id}"></div> <a href="#" identif="{id}" class="remove">x</a></h3>
	<div id="{id}" class="accordion-content">
	    <!-- Name -->
	    <div class="control-group">
		<h3>Name</h3> 
		<fieldset>
		    <input class="name block" type="text"/>
		</fieldset>
	    </div>
	    <!-- Location -->
	    <div class="control-group">
		<h3>Location</h3> 
		<fieldset class="col">
		    <input class="lat" type="text"/>		
		</fieldset>
		<fieldset class="col col2">
		    <input class="lng" type="text"/>
		</fieldset>
	    </div>
	    <!-- Icon -->
	    <div class="control-group">
		<h3>Icon</h3>	
		<fieldset class="s-icon">
		    <input class="icon" style="width:100%" id="icon" />		
		</fieldset>		
	    </div>


	    <!-- Details -->
	    <div class="control-group last">
		<h3>Details</h3> 		
		<div class="map-details-textarea">		    
		    <textarea class="details" id="{id}-details" type="text"></textarea>	    
		</div>
	    </div>
	</div>
    </div>

    <div id="template-style">
	<h3 class="header-{id}"> <div id="name-lable-{id}"></div> <a href="#" identif="{id}" class="remove">x</a></h3>
	<div id="{id}" class="syle-content">	   
	    <!-- Feature Type -->
	    <div class="control-group">
		<h3>Feature type</h3> 
		<div class="feature-type" style="width:100%"></div>
	    </div>

	    <!-- Element Type -->
	    <div class="control-group">
		<h3>Element type</h3> 
		<div class="element-type" style="width:100%"></div>
	    </div>

	    <!-- Color -->
	    <div class="control-group last">
		<h3>Color</h3> 
		<fieldset>
		    <input class="color" value="66ff00" />	
		</fieldset>	
	    </div>	   
	    <!-- Weight  
	    <div>
		<label>Weight </label> 
		<input class="weight " type="text"/>		
	    </div>
	    -->
	    <!-- Weight  
	    <div>
		<label>Visibility </label> 
		<input checked="checked" type="checkbox" class="visibility " type="text"/>		
	    </div>
	    -->
	    <!-- Inverse lightness 
	    <div>
		<label>Inverse lightness </label> 
		<input type="checkbox" class="inverse-lightness" type="text"/>		
	    </div>
	    -->
	</div>
    </div>



    <?php wp_editor("", "___hiddenEditor___"); ?>    
</div>
