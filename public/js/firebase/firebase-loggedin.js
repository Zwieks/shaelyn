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
		  				user_feeds = {},
		  				owner_array = [],
		  				messages_array = [],
		  				friend_array = [],
		  				friend_count = '';

					$.each( feeds_object, function( key, item ) {
						var type = item.type;

						if(type == 'list') {
							var owner = item.owner,
								owner_image = '',
								message = item.message;

							friend_array = item.partyPeople.split(';');
							friend_count = friend_array.length;
							user_feeds[message] = [];

							user_feeds[message]['listId'] = key;
							user_feeds[message]['userId'] = user.uid;
							user_feeds[message]['owner'] = owner;
							user_feeds[message]['title'] = item.title;
							user_feeds[message]['friendsCount'] = friend_count;
							user_feeds[message]['friends'] = friend_array;

							if(user.uid != owner) {
								firebase.database().ref().child('Users/'+owner).on('value', snap => {
									user_feeds[message]['ownerImage'] = snap.val().image.toString();
								});
							} else {
								user_feeds[message]['ownerImage'] = '';
							}

							owner_array.push(owner);
							messages_array.push(message);
						}
					});

					$.each( user_feeds, function( key, items ) {
						var HTML_friend_list = '',
							HTML_owner_image = '',
							firebase_settings = '',
							HTML_list_items = '';

						items['friends'].forEach(function (friend, i) {
							HTML_friend_list = '';

							firebase.database().ref().child('Users/'+friend).on('value', snap => {
								HTML_friend_list = HTML_friend_list+'<li class="member"><img class="avatar" src="'+snap.val().image+'" title="'+snap.val().name+'" alt="member"/></li>';
							});
						});

						firebase.database().ref().child('lists/'+items['owner']+'/'+items['listId']).on('value', snap => {
							HTML_list_items = '';
							HTML_owner_image = '';
							firebase_settings = '';

							if (snap.val() != null) {
								items['totalItems'] = Object.keys(snap.val()).length;
								items['items'] = snap.val();

								$.each( snap.val(), function( key, value ) {
									var focus = '',
										checked = '';
									//Check if there is a focused item
							 		if($('.firebase-set[itd="'+key+'"]').is(':focus')) {
							 			focus = "id=focus ";
							 		}

							 		if(value.ticked == true) {
							 			checked = 'checked';
							 		}

									firebase_settings = ''+focus+'class="list-item-title firebase-set" own="'+items['owner']+'" sub="'+items['listId']+'" field="lists" itd="'+key+'" item="title"';
									HTML_list_items = HTML_list_items+'<li id="'+key+'"><span class="firebase-remove-item remove-item"></span><div class="list-wrapper"><div '+firebase_settings+' contentEditable="true">'+value.title+'</div><div class="list-item-detail firebase-set">'+value.detail+'</div></div><form><fieldset><ul class="velden"><li class="form-input-checkbox"><input class="checkbox" type="checkbox" id="filter-'+key+'" '+checked+'/><label for="filter-'+key+'" class="option-label"></label></li></ul><fiedset></form></li>';
								});
							}else {
								items['totalItems'] = 0;
								items['items'] = 'empty';
							}

							if(items['ownerImage'] != ''){
								HTML_owner_image = '<img class="avatar" src="'+items['ownerImage']+'" alt="Owner image"/>';
							}

							//Set the HTML elements
							var html = '<div list="'+items['listId']+'" class="card list js-list '+items['listId']+'"><div class="card-content-wrapper"><span class="card-title">'+items['title']+'</span><div class="card-description"><span class="card-meta friends">'+items['friendsCount']+'</span><span class="card-meta items">'+items['totalItems']+'</span></div></div><div class="card-indicator"><div class="owner-indicator">'+HTML_owner_image+'</div></div></div>';
							var html_details = '<div own="'+items['owner']+'" ref="'+items['userId']+'" class="detail-item detail-'+items['listId']+'"><ul class="detail-members">'+HTML_friend_list+'</ul><ul class="card-main">'+HTML_list_items+'</ul></div>';
							var html_title ='<h3 class="list-item-title title-'+items['listId']+'">'+items['title']+'</h3>';

							if(lists.getElementsByClassName(items['listId']).length > 0){
								lists.getElementsByClassName(items['listId'])[0].innerHTML = html;
							}else {
							  	lists.innerHTML += html;
							}

							if(lists_details.getElementsByClassName('detail-'+items['listId']).length > 0){
								var object = $(lists_details.getElementsByClassName('detail-'+items['listId'])),
									show = false,
									focus = false;
								if (object.hasClass('show')) {
									show = true;

									html_details = $(html_details).addClass('show');
								}

								object.replaceWith(html_details);

							}else {
							  	lists_details.innerHTML += html_details;
							}

							if(lists_title.getElementsByClassName('title-'+items['listId']).length > 0) {
								var object = $(lists_title.getElementsByClassName('title-'+items['listId'])),
									show = false;
								if (object.hasClass('show')) {
									show = true;
									html_title = $(html_title).addClass('show');
								}

								object.replaceWith(html_title);
							}else {
								lists_title.innerHTML += html_title;
							}

							//Set focus if element got class FOCUS
							if(document.getElementById("focus"))
							{
								$(document.getElementById('focus')).focus();
								setEndOfContenteditable(document.getElementById('focus'));
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
			$(document).on("input",".firebase-set",function(e) {
				var field = $(this).attr('field'),
					item = $(this).attr('item'),
					itemid = $(this).attr('itd'),
					fieldid = $(this).attr('sub'),
					owner = $(this).attr('own'),
					dInput = this.value;

				if(typeof dInput == 'undefined') {
					dInput = $(this).text();
				}

			    UpdateField(field, user.uid, fieldid, owner, dInput, item, itemid);
			});

			$(".firebase-set-checkbox").change(function() {
				var field = $(this).attr('field'),
					item = $(this).attr('item'),
					itemid = $(this).attr('itd'),
					fieldid = $(this).attr('sub'),
					owner = $(this).attr('own'),
					dInput = $(this).prop('checked');

			    UpdateField(field, user.uid, fieldid, owner, dInput, item, itemid);
			});

			// Update fields
			function UpdateField(field, uid, fieldid, owner, content, item, itemid) {
			  	// Write the new post's data.
			  	var updates = {};

			  	if(typeof fieldid != 'undefined') {
			  		fieldid = '/'+fieldid;
			  	}else {
			  		fieldid = '';
			  	}

			  	if(typeof owner != 'undefined') {
			  		uid = owner;
			  	}

			  	if(typeof itemid != 'undefined') {
			  		itemid = '/'+itemid;
			  	}else {
			  		itemid = '';
			  	}

			  	updates[field+'/'+uid+fieldid+itemid+'/'+item] = content;

			  	return firebase.database().ref().update(updates);
			}
	  	}
	});
}());