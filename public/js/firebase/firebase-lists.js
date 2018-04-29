/*
	---FIREBASE LIST FUNCTIONALITIES----
*/

;(function($) {
	//Removes single list items
	$.fn.firebase_removeListItem = function(uId, listId, itemId) {
		return firebase.database().ref().child('lists/'+uId+'/'+listId+'/'+itemId).remove();
	};

	/**
		REMOVING LIST ITEMS
	**/
	// Toggles the remove icons
	$(document).on("click","#js-remove-list-items",function() {
		$(this).toggleClass('active');
		$(this).parent().parent().find('.remove-item').toggleClass('show');
	});

	//Triggerd when clicked on remove icon and REMOVING the item from DB
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

	/**
		ADDING LIST ITEMS
	**/
	// Toggles the add functionality
	$(document).on("click","#js-add-list-items",function() {
		$(this).toggleClass('active');
		var key = 0;
		$('.card-main').prepend('<li class="new-item" id="'+key+'"><span class="firebase-remove-item remove-item"></span><div class="list-wrapper"><span class="list-item-title"></span><div class="list-item-detail"></div></div><form><fieldset><ul class="velden"><li class="form-input-checkbox"><input class="checkbox" type="checkbox" id="filter-'+key+'"/><label for="filter-'+key+'" class="option-label"></label></li></ul><fiedset></form></li>').delay(100).queue(function(next){
	    	$('#'+key).addClass("show");
	    	next();
		});
	});


	/**
		LIST DETAILS
	**/
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


	/**
		BACK TO LIST OVERVIEW
	**/
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
		$('.card-main .new-item').remove();
		$('#js-remove-list-items, #js-add-list-items').removeClass('active');
	});
})(jQuery);