<script type="text/javascript">
    $(document).ready(function(){
        //Create the autocomplete list
        var owl = $('.owl-carousel');
        owl.on('initialized.owl.carousel', function(event) {
        	var i = 0;
    		$('.owl-item').each(function(){
				var name = $(this).children().attr('class').split(' ').pop();
				$( ".owl-dot:eq("+i+") span" ).text(name);
				i++;
			});
		});

        owl.owlCarousel({
        	items: 1,
        	dots: true,
        	responsiveClass:true,
		    responsive:{
		        0:{
		            items:1,
		            nav:true
		        },
		        640:{
		            items:1,
		            nav:true
		        }
		    }
        });
    });
</script>