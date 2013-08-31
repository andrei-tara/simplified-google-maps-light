<?php $DOC_URL = Cetabo_Registry::get('PLUGIN_URL') . "view/pro/"; ?>
<link rel="stylesheet" href="<?php echo $DOC_URL; ?>/main.css"></head>

<script type="text/javascript">
    function countdown() {
	var i = document.getElementById('counter');
	if (parseInt(i.innerHTML) <= 0) {
	    location.href = 'http://cmap.cetabo.com/';
	}
	i.innerHTML = parseInt(i.innerHTML) - 1;
    }
    setInterval(function() {
	countdown();
    }, 1000);
</script>
<div class="master-container">         
    <div class="container">   
	<div id="header">
	    <h1 id="logo">Cetabo</h1>
	    <small>Simplified Google Maps (pro)</small>
	</div> 
	<p>You will be redirected in <span id="counter">20</span> second(s).
	    If the redirect doesn't work   <a target="_blank" href="http://cmap.cetabo.com/" > click here </a></p>

    </div>
</div>