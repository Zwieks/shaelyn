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
  	const image = document.getElementById('firebase-image-wrapper');
  	const friends = document.getElementById('firebase-friends');
  	const feeds = document.getElementById('firebase-feeds');
  	const lists = document.getElementById('firebase-lists');
  	const lists_details = document.getElementById('firebase-list-details');
  	const lists_title = document.getElementById('firebase-list-title');

  	// Create references
  	const ref = firebase.database().ref();
  	const usersRef = ref.child('Users');
  	const userSettings = ref.child('UserSettings');
  	const listAttendeesRef = ref.child('listAttendees');
  	const listsRef = ref.child('lists');
  	const userListsRef = ref.child('UsersLists');
  	const listItemsRef = ref.child('listItems');
  	const friendsRef = ref.child('Friends');

  	function getUser(user, cb) {
		usersRef.child(user).on('value', snap => {
			if(snap.val() != null) {
				//Username
				username.setAttribute("sub", user);
				username.value = snap.val().name;

				getUserProfileImage(snap);
				getUserSettings(user);
			};
		});
  	}

  	function getUserProfileImage(snap) {
		var userImage = HTMLcreateUserProfile(snap);
		updateOrAppendHTML("firebase-image-wrapper", userImage, image);
  	}

  	function getUserSettings(user) {
		userSettings.child(user).on('value', snap => {
			if(snap.val() != null) {
				//Setting Mail
				user_setting_mail.setAttribute("sub", user);
				user_setting_mail.checked = snap.val().sendmail;

				//Setting Notifications
				user_setting_notifications.setAttribute("sub", user);
				user_setting_notifications.checked = snap.val().notifications;
			};
		});		
  	}

  	function getFriends(user, cb) {
  		friendsRef.child(user).on('child_added', snap => {
  			let userRef = usersRef.child(snap.key);

  			userRef.on('value', snap => {
				if(snap.val() != null) {
	  				//Renders the friends that are invited for the specific list
	  				var friend = HTMLcreateFriend(snap);
					updateOrAppendHTML("userfriend-"+snap.key, friend, friends);
				};	
  			});	
  		});		
  	}

  	function getLists(user, cb) {
  		userListsRef.child(user).on('child_added', snap => {
  			let listRef = listsRef.child(snap.key);
  			//Get the list items
  			getListDetailItems(snap.key, snap => console.log(snap.val()));
  			//Get the Friends
  			getFriendsOfList(snap.key, snap => console.log(snap.val()));

  			listRef.on('value', snap => {
  				if(snap.val() != null) {
	  				//Renders the list overview
	  				var list_overview_item = HTMLcreateListOverviewItem(snap);
	  				var show = false;

	  				//HTML for the main title of the list
	  				if($("#list-title-"+snap.key).children().hasClass('show')) {
	  					show = true;
	  				}
	  				var list_main_title = HTMLcreateListMainTitle(snap, checkFocus(), show);

	  				//Put the HTML in the container
	  				updateOrAppendHTML("list-"+snap.key, list_overview_item, lists);
	  				
	  				updateOrAppendHTML("list-title-"+snap.key, list_main_title, lists_title);
	  			}	
  			});
  		});
  	};

  	function getFriendsOfList(listId, cb) {
  		listAttendeesRef.child(listId).on('child_added', snap => {
  			let userRef = usersRef.child(snap.key);

  			userRef.on('value', snap => {
  				if(snap.val() != null) {
	  				//Renders the friends that are invited for the specific list
	  				var friend = HTMLcreateListFriend(listId, snap);
					//Put the HTML in the container
					var friends_list = document.getElementById('friends-'+listId);

					updateOrAppendHTML(listId+"friend-"+snap.key, friend, friends_list);
				}	
  			});
  		});
  	};

  	function getListDetailItems(listId, cb) {
  		//Create HTML for the list
  		var list = HTMLcreateList(listId);

  		//Create HTML for the friends list
  		var friends_list = HTMLcreateFriendsList(listId);

  		//Create HTML for the list wrapper
  		var items_wrapper = HTMLcreateListItemsWrapper(listId);

  		var user = firebase.auth().currentUser.uid;

  		var active_remove = false;

  		//Get the list items
  		listItemsRef.child(listId).on('child_added', snap => {
  			active_remove = false;
  			listItemsRef.child(listId+'/'+snap.key).on('value', snap => {
  				
  				if(snap.val() != null) {
  					let userRef = usersRef.child(snap.val().changedBy);
  					if(document.getElementById(snap.key) != null){
  						var remove_item = document.getElementsByClassName("remove-item show");
  						if(remove_item.length > 0) {
  							active_remove = true;
  						}else {
  							active_remove = false;
  						}
  					}

					userRef.on('value', snapshot => {
 						user = snapshot.val();
						
						var item = HTMLcreateListItem(listId, snap, checkFocus(), user, active_remove);
						updateOrAppendHTML(snap.key, item, items_wrapper); 
 					});	
				}	
			});
  		});

  		//Put the friends list in the list
  		list.appendChild(friends_list);

  		//Put the list items in the list
  		list.appendChild(items_wrapper);

  		//Append the list to the HTML wrapper
  		lists_details.appendChild(list);
  	};

  	function removeUsersList(key, cb) {
  		listAttendeesRef.child(key).on('child_removed', snap => {
  			let userRef = usersRef.child(snap.key);
  			userRef.once('value', snap => {
  				var scope = snap.val();
  				//TODO remove list and user from list
  			});
  		});
  	}

  	function checkFocus() {
  		var elements = document.querySelectorAll('[focus]');
  		
  		[].forEach.call(elements, function(element) {
		  	// do whatever
		  	element.removeAttribute("focus");
		});

  		var item = document.activeElement.getAttribute('uni');

  		if(item == null) {
  			item = '';
  		}

  		return item;
  	}

	//UPDATE all user name entries
	function updateName({ref, uid, name}) {
		const userEvents = ref.child();
		return userEvents.once('value').then(snap => {
			let eventKeys = Object.keys(snap.val());
			let updateObj = {};

			// Create an entry for each event attendance
			// eventKeys.forEach({
			// 	updateObj['listAttendees/'+key+'/'+uid+'/'+name] = name;
			// });

			// Create an entry for the user profile
			updateObj['users/'+uid+'/name'] =  name;

			// Update the database, return the promise
			return rootRef.update(updateObj);
		});
	};

  	function updateOrAppendHTML(id, HTML_object, parent) {

		if(document.getElementById(id) != null) {
			console.log(id);
			console.log(HTML_object);
			console.log(parent);
			var update_item_list = document.getElementById(id);
				update_item_list.innerHTML = HTML_object.innerHTML;
		}else {
			parent.appendChild(HTML_object);
		}


		//Set focus if element got class FOCUS
		if(typeof document.querySelectorAll('[focus="true"]')[0] != 'undefined')
		{
			var focused = document.querySelectorAll('[focus="true"]')[0];
			$(focused).focus();
			setEndOfContenteditable(focused);
		}
  	}

	firebase.auth().onAuthStateChanged((user) => {
	  	if (user) {
	  		getUser(user.uid, snap => console.log(snap.val()));

	  		getFriends(user.uid, snap => console.log(snap.val()));

	  		getLists(user.uid, snap => console.log(snap.val()));

	  		$(document).on("input",".firebase-set",function(e) {
				var field = $(this).attr('field'),
					item = $(this).attr('item'),
					itemid = $(this).attr('itd'),
					fieldid = $(this).attr('sub'),
					owner = $(this).attr('own'),
					changer = false,
					dInput = this.value;

				if(typeof dInput == 'undefined') {
					dInput = $(this).text();
				}

			    UpdateField(field, user.uid, fieldid, owner, dInput, item, itemid, changer);
	  		});	

			$(document).on("change",".firebase-set-checkbox",function(e) {
				var field = $(this).attr('field'),
					item = $(this).attr('item'),
					itemid = $(this).attr('itd'),
					fieldid = $(this).attr('sub'),
					owner = $(this).attr('own'),
					changer = true,
					dInput = $(this).prop('checked');

			    UpdateField(field, user.uid, fieldid, owner, dInput, item, itemid, changer);
			});

			function UpdateField(field, uid, fieldid, owner, content, item, itemid, changer) {
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

			  	if(changer == true) {
			  		updates[field+fieldid+itemid+'/changedBy'] = uid;
			  	}

			  	updates[field+fieldid+itemid+'/'+item] = content;

			  	return ref.update(updates);
			}


		 //  	const dbRefUserObject = ref.child('Users/'+user.uid);
		 //  	const dbRefUserSettingsObject = ref.child('UserSettings/'+user.uid);
		 //  	const dbRefChatObject = ref.child('Chat/'+user.uid);
		 //  	const dbRefFriendsObject = ref.child('Friends/'+user.uid);
		 //  	const dbRefFeedsObject = ref.child('feed/'+user.uid);
		 //  	const dbRefListsObject = ref.child('lists/'+user.uid);
			// const dbRefMessagesObject = ref.child('messages/'+user.uid);
			// const dbRefNotificationsObject = ref.child('notifications/'+user.uid);

			// // LISTS changes
			// dbRefFeedsObject.on('value', snap => {
			// 	if(lists) {
		 //  			var feeds_object = snap.val(),
		 //  				user_feeds = {},
		 //  				owner_array = [],
		 //  				messages_array = [],
		 //  				friend_array = [],
		 //  				HTML_friend_list = '',
		 //  				friend_count = '';

			// 		$.each( feeds_object, function( key, item ) {
			// 			var type = item.type;

			// 			if(type == 'list') {
			// 				var owner = item.owner,
			// 					owner_image = '',
			// 					message = item.message;

			// 				friend_array = item.partyPeople.split(';');
			// 				friend_count = friend_array.length;
			// 				user_feeds[message] = [];

			// 				user_feeds[message]['listId'] = key;
			// 				user_feeds[message]['userId'] = user.uid;
			// 				user_feeds[message]['owner'] = owner;
			// 				user_feeds[message]['title'] = item.title;
			// 				user_feeds[message]['friendsCount'] = friend_count;
			// 				user_feeds[message]['friends'] = friend_array;

			// 				if(user.uid != owner) {
			// 					firebase.database().ref().child('Users/'+owner).on('value', snap => {
			// 						user_feeds[message]['ownerImage'] = snap.val().image.toString();
			// 					});
			// 				} else {
			// 					user_feeds[message]['ownerImage'] = '';
			// 				}

			// 				owner_array.push(owner);
			// 				messages_array.push(message);
			// 			}
			// 		});

			// 		$.each( user_feeds, function( key, items ) {
			// 			var HTML_friend_list = '',
			// 				HTML_owner_image = '',
			// 				firebase_settings_title = '',
			// 				firebase_settings_detail = '',
			// 				HTML_list_items = '';

			// 			firebase.database().ref().child('lists/'+items['owner']+'/'+items['listId']).on('value', snap => {
			// 				HTML_list_items = '';
			// 				HTML_owner_image = '';
			// 				firebase_settings_title = '';
			// 				firebase_settings_detail ='';
			// 				HTML_friend_list = '';

			// 				items['friends'].forEach(function (friend, i) {
			// 					firebase.database().ref().child('Users/'+friend).on('value', snap => {
			// 						HTML_friend_list = HTML_friend_list+'<li class="member"><img class="avatar" src="'+snap.val().image+'" title="'+snap.val().name+'" alt="member"/></li>';
			// 					});
			// 				});

			// 				if (snap.val() != null) {
			// 					items['totalItems'] = Object.keys(snap.val()).length;
			// 					items['items'] = snap.val();

			// 					$.each( snap.val(), function( key, value ) {
			// 						var focus_title = '',
			// 							focus_detail = '',
			// 							initials = '',
			// 							checked = '';

			// 						firebase.database().ref().child('Users/'+value.changer).on('value', snap => {
			// 							if (snap.val()) {
			// 								initials =  getInitials(snap.val().name);
			// 							}
			// 						});

			// 						//Check if there is a focused item
			// 						if($('.firebase-set[uni="title-'+key+'"]').is(':focus')) {
			// 				 			focus_title = "id=focus ";
			// 				 		}else if($('.firebase-set[uni="detail-'+key+'"]').is(':focus')){
			// 				 			focus_detail = "id=focus ";
			// 				 		}

			// 				 		if(value.ticked == true) {
			// 				 			checked = 'checked';
			// 				 		}

			// 						firebase_settings = ''+focus_title+'class="list-item-title firebase-set" own="'+items['owner']+'" sub="'+items['listId']+'" field="lists" itd="'+key+'" item="title" uni="title-'+key+'"';
			// 						firebase_settings_detail = ''+focus_detail+'class="list-item-detail firebase-set" own="'+items['owner']+'" sub="'+items['listId']+'" field="lists" itd="'+key+'" item="detail" uni="detail-'+key+'"';
			// 						HTML_list_items = HTML_list_items+'<li id="'+key+'"><span class="firebase-remove-item remove-item"></span><div class="list-wrapper"><div '+firebase_settings+' contentEditable="true" placeholder="'+i18n.firebase.placeholder.title+'">'+value.title+'</div><div '+firebase_settings_detail+' contentEditable="true" placeholder="'+i18n.firebase.placeholder.detail+'">'+value.detail+'</div></div><form><fieldset><ul class="velden"><li class="form-input-checkbox"><input class="checkbox firebase-set-checkbox" type="checkbox" own="'+items['owner']+'" sub="'+items['listId']+'" field="lists" itd="'+key+'" item="ticked" id="filter-'+key+'" changer="'+items['userId']+'" '+checked+'/><label for="filter-'+key+'" class="option-label" init="'+initials+'"></label></li></ul><fiedset></form></li>';
			// 					});
			// 				}else {
			// 					items['totalItems'] = 0;
			// 					items['items'] = 'empty';
			// 				}

			// 				if(items['ownerImage'] != ''){
			// 					HTML_owner_image = '<img class="avatar" src="'+items['ownerImage']+'" alt="Owner image"/>';
			// 				}

			// 				//Set the HTML elements
			// 				var html = '<div list="'+items['listId']+'" class="card list js-list '+items['listId']+'"><div class="card-content-wrapper"><span class="card-title">'+items['title']+'</span><div class="card-description"><span class="card-meta friends">'+items['friendsCount']+'</span><span class="card-meta items">'+items['totalItems']+'</span></div></div><div class="card-indicator"><div class="owner-indicator">'+HTML_owner_image+'</div></div></div>';
			// 				var html_details = '<div own="'+items['owner']+'" ref="'+items['userId']+'" class="detail-item detail-'+items['listId']+'"><ul class="detail-members">'+HTML_friend_list+'</ul><ul class="card-main">'+HTML_list_items+'</ul></div>';
			// 				var html_title ='<h3 class="list-item-title title-'+items['listId']+'">'+items['title']+'</h3>';

			// 				if(lists.getElementsByClassName(items['listId']).length > 0){
			// 					lists.getElementsByClassName(items['listId'])[0].innerHTML = html;
			// 				}else {
			// 				  	lists.innerHTML += html;
			// 				}

			// 				if(lists_details.getElementsByClassName('detail-'+items['listId']).length > 0){
			// 					var object = $(lists_details.getElementsByClassName('detail-'+items['listId'])),
			// 						show = false,
			// 						focus = false;
			// 					if (object.hasClass('show')) {
			// 						show = true;

			// 						html_details = $(html_details).addClass('show');
			// 					}

			// 					object.replaceWith(html_details);

			// 				}else {
			// 				  	lists_details.innerHTML += html_details;
			// 				}

			// 				if(lists_title.getElementsByClassName('title-'+items['listId']).length > 0) {
			// 					var object = $(lists_title.getElementsByClassName('title-'+items['listId'])),
			// 						show = false;
			// 					if (object.hasClass('show')) {
			// 						show = true;
			// 						html_title = $(html_title).addClass('show');
			// 					}

			// 					object.replaceWith(html_title);
			// 				}else {
			// 					lists_title.innerHTML += html_title;
			// 				}

			// 				//Set focus if element got class FOCUS
			// 				if(document.getElementById("focus"))
			// 				{
			// 					$(document.getElementById('focus')).focus();
			// 					setEndOfContenteditable(document.getElementById('focus'));
			// 				} 
			// 			});
			// 		});
			// 	}
			// });

			// // Sync object USER FRIENDS changes
		 //  	dbRefFriendsObject.on('value', snap => {
		 //  		if(friends) {
		 //  			//Get the user key
		 //  			var i;
		 //  			var friends_array = Object.keys(snap.val()).toString().split(',');

			// 		friends_array.forEach(function (value, i) {
			// 			firebase.database().ref().child('Users/'+friends_array[i]).on('value', snap => {
			// 			 	var name = snap.val().name;
			// 			 	var description = snap.val().description;
			// 			 	var avatar = snap.val().image;
			// 			 	var status = snap.val().online;

			// 			 	if(status != 'true') {
			// 			 		status = '';
			// 			 	}else {
			// 			 		status = 'online';
			// 			 	}

			// 			 	var html = '<div class="card '+value+' '+status+'"><figure class="card-image-wrapper"><img class="avatar" src="'+avatar+'" alt=""/><div class="arc"></div></figure><div class="card-content-wrapper"><span class="card-title">'+name+'</span><span class="card-description">'+description+'</span></div><div class="card-indicator"><div class="online-indicator"></div></div></div>';

			// 				if(friends.getElementsByClassName(value).length > 0){
			// 					friends.getElementsByClassName(value)[0].innerHTML = html;
			// 				}else {
			// 				  	friends.innerHTML += html;
			// 				}
			// 			});
			// 		});
		 //  		}
		 //  	});	

		 //  	// Sync object USER changes
		 //  	dbRefUserObject.on('value', snap => {
		 //  		if(username) {
		 //  			username.value = snap.val().name;
		 //  		}

		 //  		if(image) {
			// 		image.src = snap.val().image
		 //  		}
		 //  	});

		 //  	// Sync object USER SETTING MAIL changes
		 //  	dbRefUserSettingsObject.on('value', snap => {
		 //  		if(user_setting_notifications) {
		 //  			user_setting_notifications.checked = snap.val().notifications;
		 //  		}
		 //  	});

		 //  	// Sync object USER SETTING NOTIFICATIONS changes
		 //  	dbRefUserSettingsObject.on('value', snap => {
		 //  		if(user_setting_mail) {
		 //  			user_setting_mail.checked = snap.val().sendmail;
		 //  		}
		 //  	});
			// $(document).on("input",".firebase-set",function(e) {
			// 	var field = $(this).attr('field'),
			// 		item = $(this).attr('item'),
			// 		itemid = $(this).attr('itd'),
			// 		fieldid = $(this).attr('sub'),
			// 		owner = $(this).attr('own'),
			// 		changer = $(this).attr('changer'),
			// 		dInput = this.value;

			// 	if(typeof dInput == 'undefined') {
			// 		dInput = $(this).text();
			// 	}

			//     UpdateField(field, user.uid, fieldid, owner, dInput, item, itemid, changer);
			// });

			// $(document).on("change",".firebase-set-checkbox",function(e) {
			// 	var field = $(this).attr('field'),
			// 		item = $(this).attr('item'),
			// 		itemid = $(this).attr('itd'),
			// 		fieldid = $(this).attr('sub'),
			// 		owner = $(this).attr('own'),
			// 		changer = $(this).attr('changer'),
			// 		dInput = $(this).prop('checked');

			//     UpdateField(field, user.uid, fieldid, owner, dInput, item, itemid, changer);
			// });

			// // Update fields
			// function UpdateField(field, uid, fieldid, owner, content, item, itemid, changer) {
			//   	// Write the new post's data.
			//   	var updates = {};

			//   	if(typeof fieldid != 'undefined') {
			//   		fieldid = '/'+fieldid;
			//   	}else {
			//   		fieldid = '';
			//   	}

			//   	if(typeof owner != 'undefined') {
			//   		uid = owner;
			//   	}

			//   	if(typeof itemid != 'undefined') {
			//   		itemid = '/'+itemid;
			//   	}else {
			//   		itemid = '';
			//   	}

			//   	if(typeof changer != 'undefined') {
			//   		updates[field+'/'+uid+fieldid+itemid+'/changer'] = changer;
			//   	}

			//   	updates[field+'/'+uid+fieldid+itemid+'/'+item] = content;

			//   	return firebase.database().ref().update(updates);
			// }
	  	}
	});
}());

