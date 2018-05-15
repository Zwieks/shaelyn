/*
	---FIREBASE LIST FUNCTIONALITIES----
*/

;(function($) {
	//Removes single LIST
	$.fn.firebase_removeList = function(listId) {
		$('#list-'+listId).slideUp("normal", function() { 
			$(this).remove(); 
		});

	  	var updates = {},
	  		currentUser = firebase.auth().currentUser.uid;

	  	updates['UsersLists/' + currentUser + '/' + listId] = null;
	  	updates['listAttendees/' + listId  + '/' + currentUser] = null;

	 	return firebase.database().ref().update(updates);
	};

	$.fn.firebase_invite_user = function(inviteUserId) {
	 	if (typeof inviteUserId != 'undefined') {
			writeNewUserInvite(inviteUserId, firebase.auth().currentUser.uid);
	 	}
	};

	$.fn.firebase_invite_friends = function(inviteUserId, listId) {
	 	if (typeof inviteUserId != 'undefined') {
			writeNewFriendsInvite(inviteUserId, firebase.auth().currentUser.uid, listId);
	 	}
	};


	//Removes single LIST ITEM
	$.fn.firebase_removeListItem = function(listId, itemId) {
		$('#'+itemId).slideUp();
		return firebase.database().ref().child('listItems/'+listId+'/'+itemId).remove();
	};

	/**
		REMOVING LIST AND LIST ITEMS
	**/
	// Toggles the remove icons for LISTS
	$(document).on("click","#js-remove-list",function() {
		$(this).toggleClass('active');
		$(this).parent().parent().find('.remove-list').toggleClass('show');
	});
	
	//Triggerd when clicked on remove icon and REMOVING the item from DB
	$(document).on("click",".firebase-remove-list",function() {
		var listId = $(this).closest('.js-list').attr('sub');
		
		$.fn.firebase_removeList(listId);
	});


	// Toggles the remove icons for LIST ITEMS
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
	// Add a new LIST ITEM
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

	// Add a new LIST
	$(document).on("click","#js-add-list",function() {
		var image = '';
		
		$(this).parent().parent().find('.remove-list').removeClass('show');
		$("#js-remove-list").removeClass('active');

		//Get the user image
		firebase.database().ref("Users/"+firebase.auth().currentUser.uid).once('value', snap => {
		   image = snap.val().thumb_image;

		   return image;
		});

		var itemCount = 0,
			name = "",
			ownerImage = image,
			time = '',
			userCount = 1;

		var newPostKey = writeNewList(itemCount, name, ownerImage, time, userCount);
			writeNewListItem(newPostKey, "", 0, false, "");
	});


	/**
		LIST DETAILS
	**/
	// Show list details
	$(document).on("click",".js-list",function(e) {
		if(!$(e.target).is('.firebase-remove-list')) {
			var list_id = 'detail-'+$(this).attr('sub');
			var title_id = 'title-'+$(this).attr('sub');

			$(this).closest('.item-wrapper').find('.item').addClass('details').delay(100).queue(function(next){
		    	$(this).addClass("active");
		    	next();
			});
			$(this).closest('.item-wrapper').find('.'+list_id).addClass('show');
			$(this).closest('.item-wrapper').find('.'+title_id).addClass('show');

			$('#js-remove-list').attr("id","js-remove-list-items");
			$('#js-add-list').attr("id","js-add-list-items");
			$('#js-remove-list-items').removeClass('active');
			$(this).parent().parent().find('.remove-item').removeClass('show');
		};	
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
		$('#js-remove-list-items').attr("id","js-remove-list");
		$('#js-add-list-items').attr("id","js-add-list");
		$('#focus').removeAttr('id');
	});

	function writeNewList(itemCount, name, ownerImage, time, userCount) {
		// A post entry.
		var postData = {
	    	itemCount: itemCount,
	    	name: name,
	    	ownerImage : ownerImage,
	    	time : time,
	    	userCount : userCount
		};

	  	// Get a key for a new Post.
		var newPostKey = firebase.database().ref().child('lists').push().key;

		// Write the new post's data simultaneously in the posts list and the user's post list.
		var updates = {};

		updates['lists/'+ newPostKey] = postData;
		updates['UsersLists/' + firebase.auth().currentUser.uid + '/' + newPostKey] = true;
		updates['listAttendees/' + newPostKey + '/' + firebase.auth().currentUser.uid] = true;

		firebase.database().ref().update(updates);

		return newPostKey;
	}

	function writeNewFriendsInvite(inviteUserId, uId, listId) {
	  	// Write the new post's data simultaneously in the posts list and the user's post list.
	  	var updates = {};

		updates['UsersLists/'+ inviteUserId +'/'+ listId] = true;
		updates['listAttendees/'+ listId +'/'+ inviteUserId] = true;

		return firebase.database().ref().update(updates);		
	}

	function writeNewUserInvite(inviteUserId, uId) {
		// A post entry.
	  	var postData = {
    		from: uId,
    		type: "request"
	  	};

		// Get a key for a new Post.
		var newPostKey = firebase.database().ref().child('notifications/'+ inviteUserId).push().key;
		
	  	// Write the new post's data simultaneously in the posts list and the user's post list.
	  	var updates = {};

		updates['notifications/'+ inviteUserId +'/'+ newPostKey] = postData;

		return firebase.database().ref().update(updates);
	}

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