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
						list_object = {};

					$.each( feeds_object, function( key, item ) {
						var type = item.type;

						if(type == 'list') {
							var owner = item.owner,
								friend_count = item.partyPeople.split(';').length,
								owner_image = '',
								message = item.message;

							if(user.uid != owner) {
								firebase.database().ref().child('Users/'+owner).on('value', snap => {
									list_object[message].push(snap.val().image.toString());
								});
							}

							owner_array.push(owner);
							messages_array.push(message);

							list_object[message] = [];
							list_object[message].push(item.title);
							list_object[message].push(friend_count);
						}
					});
					owner_array.forEach(function (value, i) {
						firebase.database().ref().child('lists/'+owner_array[i]+'/'+messages_array[i]).on('value', snap => {
							if (messages_array[i] in list_object){
								var item_title = '',
									count = Object.keys(snap.val()).length;
									value = messages_array[i];

								$.each( snap.val(), function( key, value ) {
									item_title = item_title+'<li>'+value.title+'</li>';
								});	

								var html = '<div class="card list '+value+'"><div class="card-content-wrapper"><span class="card-title">'+list_object[messages_array[i]][0]+'</span><div class="card-description"><span class="card-meta friends">'+list_object[messages_array[i]][1]+'</span><span class="card-meta items">'+count+'</span></div></div><div class="card-indicator"><div class="owner-indicator"><img class="avatar" src="'+list_object[messages_array[i]][2]+'" alt="Owner image"/></div></div></div>';

								if(lists.getElementsByClassName(value).length > 0){
									lists.getElementsByClassName(value)[0].innerHTML = html;
								}else {
								  	lists.innerHTML += html;
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