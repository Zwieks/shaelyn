;(function ($) {

	/**
	 *  This script is called in jquery.acties.js
	 *
	 *  It sets a class on the html tag when it meets these 2 requirements:
	 *  1. scroll_offset: Scrolled a certain distance downwards
	 *  2. min_screen_width: The minimum screen width is required
	 */

	var $html = $('html'),
		tiny_header_class = 'tiny-header';

	window.setHeader = function(scroll_offset, min_screen_width) {

		// Check if 'scroll_offset' and 'min_screen_width' are reached
		if ($(window).scrollTop() > scroll_offset && real_window_width >= min_screen_width) {
			$html.addClass(tiny_header_class);
		} else {
			$html.removeClass(tiny_header_class);
		}
	};

})(jQuery);