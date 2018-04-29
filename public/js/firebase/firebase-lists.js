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
		var object = $('#firebase-list-details').find('.show'),
			owner = '',
			listId = '',
			detail = '',
			orderNumber = '',
			ticked = false,
			title = '';

	 	if (object.attr('class').indexOf("detail--") >= 0) {
	 		var classes = object.attr('class').split(' '),
	 			
	 		owner = object.attr('own');

			classes.forEach(function (item, i) {
			 	if (item.indexOf("detail--") >= 0) {
			 		listId = item.replace("detail-", "");
			 	}
			});

			orderNumber = object.find('.card-main > li').length + 1;

			writeNewListItem(owner, listId, detail, orderNumber, ticked, title);
	 	}
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
		$('#focus').removeAttr('id');
	});

	function writeNewListItem(owner, listId, detail, orderNumber, ticked, title) {
	  // A post entry.
	  var postData = {
    	detail: detail,
    	orderNumber: orderNumber,
    	ticked : ticked,
    	title : title
	  };

	  // Get a key for a new Post.
	  var newPostKey = firebase.database().ref().child('lists/'+owner+'/'+listId).push().key;

	  // Write the new post's data simultaneously in the posts list and the user's post list.
	  var updates = {};
	  updates['lists/'+owner+'/'+listId +'/'+ newPostKey] = postData;
	  //updates['/user-posts/' + uid + '/' + newPostKey] = postData;

	  return firebase.database().ref().update(updates);
	}

})(jQuery);