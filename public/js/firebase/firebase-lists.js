/*
	---FIREBASE LIST FUNCTIONALITIES----
*/

;(function($) {
	//Removes single list items
	$.fn.firebase_removeListItem = function(listId, itemId) {
		$('#'+itemId).remove();
		return firebase.database().ref().child('listItems/'+listId+'/'+itemId).remove();
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
		var listId = $(this).closest('.detail-item').attr('ref'),
			itemId = $(this).parent().attr('id');
		
		$.fn.firebase_removeListItem(listId, itemId);
	});

	/**
		ADDING LIST ITEMS
	**/
	// Toggles the add functionality
	$(document).on("click","#js-add-list-items",function() {
		$(this).parent().parent().find('.remove-item').removeClass('show');
		$("#js-remove-list-items").removeClass('active');

		$(this).toggleClass('active');
		var object = $('#firebase-list-details').find('.show'),
			owner = '',
			listId = object.attr('ref'),
			detail = '',
			orderNumber = 0,
			ticked = false,
			title = '';

	 	if (typeof listId != 'undefined') {
			writeNewListItem(listId, detail, orderNumber, ticked, title);
	 	}
	});


	/**
		LIST DETAILS
	**/
	// Show list details
	$(document).on("click",".js-list",function() {
		var list_id = 'detail-'+$(this).attr('sub');
		var title_id = 'title-'+$(this).attr('sub');

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
		$('#focus').removeAttr('id');
	});

	function writeNewListItem(listId, detail, orderNumber, ticked, title) {
	  // A post entry.
	  var postData = {
    	detail: detail,
    	orderNumber: orderNumber,
    	ticked : ticked,
    	changedBy : firebase.auth().currentUser.uid,
    	title : title
	  };

	  // Get a key for a new Post.
	  var newPostKey = firebase.database().ref().child('listItems/'+listId).push().key;

	  // Write the new post's data simultaneously in the posts list and the user's post list.
	  var updates = {};

	  updates['listItems/'+ listId +'/'+ newPostKey] = postData;
	  //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

	  return firebase.database().ref().update(updates);
	}

})(jQuery);