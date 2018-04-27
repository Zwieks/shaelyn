(function() {
   	// Initialize Firebase
	const config = {
    	apiKey: "AIzaSyBIPCHDWClIz_8FeoqLwM5bEYzLkV0QSc0",
    	authDomain: "shaelyn-487ff.firebaseapp.com",
    	databaseURL: "https://shaelyn-487ff.firebaseio.com",
    	projectId: "shaelyn-487ff",
    	storageBucket: "shaelyn-487ff.appspot.com",
    	messagingSenderId: "188207705889"
  	};
  	firebase.initializeApp(config);

  	//Set the base containers
  	const username = document.getElementById('firebase-username');
  	const user_setting_mail = document.getElementById('firebase-setting-mail');
  	const user_setting_notifications = document.getElementById('firebase-setting-notifications');  	
  	const image = document.getElementById('firebase-image');
  	const friends = document.getElementById('firebase-friends');
  	const feeds = document.getElementById('firebase-feeds');
  	const lists = document.getElementById('firebase-lists');
  	const lists_details = document.getElementById('firebase-list-details');
  	const lists_title = document.getElementById('firebase-list-title');

	firebase.auth().onAuthStateChanged((user) => {
	  	if (user) {
	      	// Create references
		  	const dbRefUserObject = firebase.database().ref().child('Users/'+user.uid);
		  	const dbRefUserSettingsObject = firebase.database().ref().child('UserSettings/'+user.uid);
		  	const dbRefChatObject = firebase.database().ref().child('Chat/'+user.uid);
		  	const dbRefFriendsObject = firebase.database().ref().child('Friends/'+user.uid);
		  	const dbRefFeedsObject = firebase.database().ref().child('feed/'+user.uid);
		  	const dbRefListsObject = firebase.database().ref().child('lists/'+user.uid);
			const dbRefMessagesObject = firebase.database().ref().child('messages/'+user.uid);
			const dbRefNotificationsObject = firebase.database().ref().child('notifications/'+user.uid);

			// LISTS changes
			dbRefFeedsObject.on('value', snap => {
				if(lists) {
		  			var feeds_object = snap.val(),
		  				owner_array = [],
		  				messages_array = [],
		  				friend_array = [],
		  				friend_list = '',
						list_object = {};

					$.each( feeds_object, function( key, item ) {
						var type = item.type;

						if(type == 'list') {
							friend_array = item.partyPeople.split(';');

							var owner = item.owner,
								friend_count = friend_array.length,
								owner_image = '',
								message = item.message;

								list_object[message] = [];

							if(user.uid != owner) {
								firebase.database().ref().child('Users/'+owner).on('value', snap => {
									list_object[message]['image'] = snap.val().image.toString();
								});
							}

							owner_array.push(owner);
							messages_array.push(message);

							list_object[message]['title'] = item.title;
							list_object[message]['count'] = friend_count;
						}
					});

					friend_array.forEach(function (user, i) {
						firebase.database().ref().child('Users/'+user).on('value', snap => {
							friend_list = friend_list+'<li class="member"><img class="avatar" src="'+snap.val().image+'" title="'+snap.val().name+'" alt="member"/></li>';
						});
					});	

					owner_array.forEach(function (value, i) {
						firebase.database().ref().child('lists/'+owner_array[i]+'/'+messages_array[i]).on('value', snap => {
							if (messages_array[i] in list_object){
								var list_items = '',
									count = Object.keys(snap.val()).length;
									value = messages_array[i];

								$.each( snap.val(), function( key, value ) {
									list_items = list_items+'<li id="'+key+'"><span class="firebase-remove-item remove-item"></span><div class="list-wrapper"><span class="list-item-title">'+value.title+'</span><div class="list-item-detail">'+value.detail+'</div></div><form><fieldset><ul class="velden"><li class="form-input-checkbox"><input class="checkbox" type="checkbox" id="filter-'+key+'"/><label for="filter-'+key+'" class="option-label"></label></li></ul><fiedset></form></li>';
								});	

								var html = '<div list="'+value+'" class="card list js-list '+value+'"><div class="card-content-wrapper"><div class="card-description"><span class="card-meta friends">'+list_object[messages_array[i]]['count']+'</span><span class="card-meta items">'+count+'</span></div></div><div class="card-indicator"><div class="owner-indicator"><img class="avatar" src="'+list_object[messages_array[i]]['image']+'" alt="Owner image"/></div></div></div>';
								var html_details = '<div class="detail-item detail-'+value+'"><ul class="detail-members">'+friend_list+'</ul><ul class="card-main">'+list_items+'</ul></div>';
								var html_title ='<h3 class="list-item-title title-'+value+'">'+list_object[messages_array[i]]['title']+'</h3>';

								if(lists.getElementsByClassName(value).length > 0){
									lists.getElementsByClassName(value)[0].innerHTML = html;
								}else {
								  	lists.innerHTML += html;
								}

								if(lists_details.getElementsByClassName('detail-'+value).length > 0){
									var object = $(lists_details.getElementsByClassName('detail-'+value)),
										show = false;
									if (object.hasClass('show')) {
										show = true;
										html_details = $(html_details).addClass('show');
									}

									object.replaceWith(html_details);

								}else {
								  	lists_details.innerHTML += html_details;
								}	

								if(lists_title.getElementsByClassName('title-'+value).length > 0) {
									var object = $(lists_title.getElementsByClassName('title-'+value)),
										show = false;
									if (lists_details.hasClass('show')) {
										show = true;
										html_title = $(html_title).addClass('show');
									}

									object.replaceWith(html_title);
								}else {
									lists_title.innerHTML += html_title;
								}						
							}
						});		
					});
				}
			});

			// Sync object USER FRIENDS changes
		  	dbRefFriendsObject.on('value', snap => {
		  		if(friends) {
		  			//Get the user key
		  			var i;
		  			var friends_array = Object.keys(snap.val()).toString().split(',');

					friends_array.forEach(function (value, i) {
						firebase.database().ref().child('Users/'+friends_array[i]).on('value', snap => {
						 	var name = snap.val().name;
						 	var description = snap.val().description;
						 	var avatar = snap.val().image;
						 	var status = snap.val().online;

						 	if(status != 'true') {
						 		status = '';
						 	}else {
						 		status = 'online';
						 	}

						 	var html = '<div class="card '+value+' '+status+'"><figure class="card-image-wrapper"><img class="avatar" src="'+avatar+'" alt=""/><div class="arc"></div></figure><div class="card-content-wrapper"><span class="card-title">'+name+'</span><span class="card-description">'+description+'</span></div><div class="card-indicator"><div class="online-indicator"></div></div></div>';

							if(friends.getElementsByClassName(value).length > 0){
								friends.getElementsByClassName(value)[0].innerHTML = html;
							}else {
							  	friends.innerHTML += html;
							}
						});
					});
		  		}
		  	});	

		  	// Sync object USER changes
		  	dbRefUserObject.on('value', snap => {
		  		if(username) {
		  			username.value = snap.val().name;
		  		}

		  		if(image) {
					image.src = snap.val().image
		  		}
		  	});

		  	// Sync object USER SETTING MAIL changes
		  	dbRefUserSettingsObject.on('value', snap => {
		  		if(user_setting_notifications) {
		  			user_setting_notifications.checked = snap.val().notifications;
		  		}
		  	});

		  	// Sync object USER SETTING NOTIFICATIONS changes
		  	dbRefUserSettingsObject.on('value', snap => {
		  		if(user_setting_mail) {
		  			user_setting_mail.checked = snap.val().sendmail;
		  		}
		  	});

			$('.firebase-set').on("input", function() {
				var field = $(this).attr('field'),
					item = $(this).attr('item'),
					dInput = this.value;

			    UpdateField(field, user.uid, dInput, item);
			});

			$(".firebase-set-checkbox").change(function() {
				var field = $(this).attr('field'),
					item = $(this).attr('item'),
					dInput = $(this).prop('checked');

			    UpdateField(field, user.uid, dInput, item);
			});

			// Update fields
			function UpdateField(field, uid, content, item) {
			  	// Write the new post's data.
			  	var updates = {};
			  	updates[field+'/'+uid+'/'+item] = content;

			  	return firebase.database().ref().update(updates);
			}
	  	}
	});
}());


// SHOW DETAIL LIST
$(document).on("click",".js-list",function() {
	var list_id = 'detail-'+$(this).attr('list');
	var title_id = 'title-'+$(this).attr('list');

	$(this).closest('.item-wrapper').find('.item').addClass('details').delay(200).queue(function(next){
    	$(this).addClass("active");
    	next();
	});
	$(this).closest('.item-wrapper').find('.'+list_id).addClass('show');
	$(this).closest('.item-wrapper').find('.'+title_id).addClass('show');
});

$(document).on("click",".js-list-back",function() {
	$(this).closest('.item-wrapper').find('.item').removeClass('details active');
	$(this).parent().parent().parent().find('.show').removeClass('show');
	$('#js-remove-list-items').removeClass('active');
});	

$(document).on("click","#js-remove-list-items",function() {
	$(this).toggleClass('active');
	$(this).parent().find('.remove-item').toggleClass('show');
});