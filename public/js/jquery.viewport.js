var real_window_width,
	scrollbar_visible = false,
	scrollbar_width;

(function ($) {

	// Calculate the exact viewportWidth excluding the scroll bar (for Windows e.g.)
	// Note: You van return the window width in Javascript by calling 'real_window_width'.

	window.getViewportWidth = function () {
		var $scroll_bar_div = $('<div class="scrollbar-measure" id="scrollbar-measure"></div>');

		$('body').append($scroll_bar_div);

		var scroll_div = document.getElementById('scrollbar-measure'),
			window_width = $(window).width(),

		scroll_bar_width = scroll_div.offsetWidth - scroll_div.clientWidth;

		$scroll_bar_div.remove();

		if ($('html').outerHeight() > $(window).outerHeight()) {
			scrollbar_visible = true;
			real_window_width = window_width + scroll_bar_width;
		} else {
			scrollbar_visible = false;
			real_window_width = window_width;
		}
	};

	window.getViewportWidth();

	window.addEventListener('resize', getViewportWidth);

})(jQuery);