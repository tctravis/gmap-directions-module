gmap-directions-module
======================

A repsonsive jQuery Google Maps route finder plugin.

A working version of the plugin can [viewed here](http://www.silverstone.co.uk/visiting/)

**Notes**

* This is not a stand-alone jQuery module, but has been extracted from a [larger project](http://www.silverstone.co.uk/visiting/), and has dependencies (e.g. images, SASS variables) not included in this repo.
* It was a proof of concept for a rapid prototype and has significant tasks outstanding, particularly to make it follow progressive enhancement principles.

**Use**

Requires minimum jQuery v1.9.0

To save loading the Google Maps API unnecessarily, check whether the module is required on the page. If it is, asynchronously [load the API files](https://developers.google.com/maps/documentation/javascript/tutorial#Loading_the_Maps_API) from the CDN.

```
(function($) {

	initDirectionsMap();

	function initDirectionsMap(){
		var directionsMap = $('.directions-map');
		if(directionsMap.length > 0){
			var script = $('<script />');
			script.attr('type','text/javascript');
			script.attr('src','http://maps.googleapis.com/maps/api/js?key=&sensor=false&callback=loadDirectionsMap');
			$('body').append(script);
		}
	}

})(jQuery);
```

Provide a callback function in the global scope to instantiate the module once the Maps API has loaded.

```
function loadDirectionsMap(){
	$('.directions-map').directionsMap();
}
```
