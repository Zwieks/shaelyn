/*
	---FIREBASE LIST FUNCTIONALITIES----
*/

;(function($) {
	//Removes single list items
	$.fn.firebase_removeListItem = function(uId, listId, itemId) {
		return firebase.database().ref().child('lists/'+uId+'/'+listId+'/'+itemId).remove();
	};

	// Toggles the remove icons
	$(document).on("click","#js-remove-list-items",function() {
		$(this).toggleClass('active');
		$(this).parent().find('.remove-item').toggleClass('show');
	});


	// Show list details
	$(document).on("click",".js-list",function() {
		var list_id = 'detail-'+$(this).attr('list');
		var title_id = 'title-'+$(this).attr('list');

		$(this).closest('.item-wrapper').find('.item').addClass('details').delay(100).queue(function(next){
	    	$(this).addClass("active");
	    	next();
		});
		$(this).closest('.item-wrapper').find('.'+list_id).addClass('show');
		$(this).closest('.item-wrapper').find('.'+title_id).addClass('show');
	});

	// Returns the user back to the overview of all lists
	$(document).on("click",".js-list-back",function() {
		$(this).closest('.item-wrapper').find('.item').delay(100).queue(function(next){
	    	$(this).removeClass("active").delay(100).queue(function(next){
		    	$(this).removeClass("details");
		    	next();
			});
	    	next();
		});
		$(this).parent().parent().parent().find('.show').removeClass('show');
		$('#js-remove-list-items').removeClass('active');
	});

	//Triggerd when clicked on remove icon
	$(document).on("click",".firebase-remove-item",function() {
		var classes = $(this).closest('.detail-item').attr('class').split(' '),
			uid = $(this).closest('.detail-item').attr('ref'),
			itemId = $(this).parent().attr('id'),
			feedId = '';

		classes.forEach(function (item, i) {
		 	if (item.indexOf("detail--") >= 0) {
		 		feedId = item.replace("detail-", "");
		 	}
		});
		
		if(feedId != '' && typeof uid != 'undefined') {
			var people = $.fn.firebase_getPartyPeople(uid, feedId);

			people.forEach(function (user, i) {
				$.fn.firebase_removeListItem(user, feedId, itemId);
			});
		}
	});
})(jQuery);