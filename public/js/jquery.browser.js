;(function($) {

	window.browserDetect = function() {

		// Set html variable because it is used multiple times
		var $html = $('html');

		// Add an IE11 class to the html-tag (only for IE11 off course)
		if( !!navigator.userAgent.match(/Trident.*rv\:11\./) ) {
			$html.addClass('ie11');
		}

		// Add an edge class to the html-tag (only for IE11 off course)
		if( /Edge\/12./i.test(navigator.userAgent) ) {
			$html.addClass('browser-edge');
		}

		// Detect touch devices
		if( 'ontouchstart' in window || navigator.msMaxTouchPoints ){
			$html.addClass('touch-device');
		}

	};

	browserDetect();

})(jQuery);