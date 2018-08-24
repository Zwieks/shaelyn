<script type="text/javascript">
    $(document).ready(function(){
        //Create the autocomplete list
        var owl = $('.owl-carousel');

	    setTimeout(function(){
	    	var i = 0;
	    		$('.owl-item').each(function(){
					var name = $(this).children().attr('class').split(' ').pop();
					$( ".owl-dot:eq("+i+") span" ).text(name);
					i++;
				});
	    }, 1000);

        owl.owlCarousel({
        	items: 1,
        	dots: true
        });
    });
</script>