;(function($) {

	// This script works with youtube.less in the 'core' and 'project' folders
	// This script needs /js/device.js to recognize desktop devices

	$('.comp-youtube').each(function(){
		// Youtube variable
		var $video = $(this);

		// If the video has autoplay and is on a desktop device: do not execute further Javscript (images and overlay are not set
		if($video.hasClass('has-autoplay') && $('html').hasClass('desktop')) {
			return;
		}

		var overiFrame = false,
			isBlurred = false;

		// Set variable on iframe hover
		$video.hover(function(){
			overiFrame = true;
		}, function(){
			overiFrame = false;
			if( isBlurred ){
				$(window).focus();
				isBlurred = false;
			}
		});

		// Detect click in iframe (also right click, which doesn't play the video, kinda buggy)
		$(window).blur(function(){
			isBlurred = true;
			if( overiFrame ) {
				$video.addClass('hideoverlay');
				$(window).focus();
			}
		});
	});

})(jQuery);