;(function($) {

	/**
	 *  What does dit script do?
	 *  - You can create a complete responsive grid lay-out without setting any breakpoints.
	 *  - Just set a data-width on the wrapper and every column receives a minimum width of this number
	 *
	 *  Example html for usage:
	 *
	 *  <section class="page-extracontent page-overview" data-width="200" data-gutter="1">
	 *      <div class="page-overview-block">
	 *          <a href="#" class="page-overview-block-inner">
	 *              <h2>Hier een blokje</h2>
	 *              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias architecto autem corporis deserunt dolor eius facere harum incidunt inventore labore magnam, nam natus neque, non quae quis quod voluptates.</p>
	 *          </a>
	 *      </div>
	 *
	 *      <div class="page-overview-block">
	 *          <a href="#" class="page-overview-block-inner">
	 *              <h2>Hier een blokje</h2>
	 *              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias architecto autem corporis deserunt dolor eius facere harum incidunt inventore labore magnam, nam natus neque, non quae quis quod voluptates.</p>
	 *          </a>
	 *      </div>
	 *  </section>
	 *
	 *  USAGE:
	 *  - You always need a class 'page-overview' on the wrapper
	 *  - You need to set a 'data-width' on the wrapper. This is a number that set's a minimum width on each overview block
	 *  - You always need a class 'page-ocerview-block' on each block
	 *  - You always need a class 'page-overview-block-inner' in the first child of the overview block
	 *
	 */

	var grid_set = false,
		grid_timer,
		grid_resize_delay = 100;

	window.setGrid = function() {
		$('[data-width]').each(function(){

			// Main variables
			var $this = $(this),
				wrapper_width = $this.outerWidth(),
				column_width = $this.data('width'),
				added_columns = Math.floor(wrapper_width / column_width);

			// Remove the extra columns for resizing
			$this.find('.extra-column-wrapper').remove();

			// Do not execute when there's only 1 column necessary
			if(wrapper_width / column_width >= 2) {
				for(var i = 0; i < added_columns; i++) {
					$this.append('<div class="extra-column-wrapper">');
				}

				// Set the correct CSS on the columns depending in the 'data-width' attribute
				$this.children('.page-overview-block, .extra-column-wrapper').css({
					minWidth: column_width,
					flexBasis: column_width
				});
			}

			grid_set = true;

			if( grid_set === true ) {
				$this.addClass('wrapper-is-loaded');
			}
		});
	};

	setGrid();

	$(window).on('resize', function(){

		clearTimeout(grid_timer);
		grid_timer = setTimeout(setGrid, grid_resize_delay);

	});

})(jQuery);