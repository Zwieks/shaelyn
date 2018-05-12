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

  	function searchUsers(search) {
  		usersRef
  			.orderByChild("nameToLower")
  			.limitToFirst(9)
  			.startAt(search.toLowerCase())
  			.endAt(search.toLowerCase() + "\uf8ff")
  			.on("value", function(snapshot) {
  				if(snapshot.val() != null) {
  					var search_users_results = document.getElementById('firebase-search-users-results');
  					search_users_results.innerHTML = '';
	  				snapshot.forEach(function(childSnapshot) {
	  					var searchItem = HTMLcreateFriend(childSnapshot);
	  					
	  					search_users_results.appendChild(searchItem);
	  				});
  				}
			});
  	}

  	function searchFriends(search) {
  		usersRef
  			.orderByChild("nameToLower")
  			.limitToFirst(9)
  			.startAt(search.toLowerCase())
  			.endAt(search.toLowerCase() + "\uf8ff")
  			.on("value", function(snapshot) {
  				if(snapshot.val() != null) {
  					var search_users_results = document.getElementById('firebase-search-friends-results');
  					search_users_results.innerHTML = '';
	  				snapshot.forEach(function(childSnapshot) {

					  	friendsRef.child(firebase.auth().currentUser.uid+'/'+childSnapshot.key).once('value', function(snapshot) {
					  		if (snapshot.exists()) {
	  							var searchItem = HTMLcreateFriend(childSnapshot);
	  					
	  							search_users_results.appendChild(searchItem);
					  		}
						});

	  				});
  				}
			});
  	}

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

					updateOrAppendHTML("userfriend-"+snap.key, friend, document.getElementById(friends.childNodes[0].id+'_container'));
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
	  				$(lists).mCustomScrollbar("scrollTo","top");
	  				//Put the HTML in the container
	  				updateOrAppendHTML("list-"+snap.key, list_overview_item, document.getElementById(lists.childNodes[0].id+'_container'));
	  				updateOrAppendHTML("list-title-"+snap.key, list_main_title, lists_title);
	  			}	
  			});
  		});
  		//Add the controls
	  	var listControls = HTMLcreateListOverviewControls();
		lists.appendChild(listControls);		
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

  		listAttendeesRef.on('child_removed', snap => {
  			var removed_list = snap.key;
  			Object.keys(snap.val()).forEach(function(key, index) {
  				if(listId == removed_list){
	  				let userListRef = userListsRef.child(key+'/'+listId);
	  				userListRef.remove();
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

  		//Put the list items in the list
  		list.appendChild(items_wrapper);

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
						$(items_wrapper).mCustomScrollbar({
				            theme:"light-3",
				            autoHideScrollbar: true
				        });
						if(document.getElementById(items_wrapper.childNodes[0].id+'_container') != null) {
				        	$(items_wrapper).mCustomScrollbar("scrollTo","top");
							updateOrAppendHTML(snap.key, item, document.getElementById(items_wrapper.childNodes[0].id+'_container')); 
						}
 					});	
				}	
			});
  		});

  		//Put the friends list in the list
  		list.appendChild(friends_list);

  		//Append the list to the HTML wrapper
  		lists_details.appendChild(list);

  		//Add the controls
	  	var listControls = HTMLcreateListItemControls();
		list.appendChild(listControls);
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
			var update_item_list = document.getElementById(id);
				update_item_list.innerHTML = HTML_object.innerHTML;
		}else {
			parent.prepend(HTML_object);
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

	  		$(document).on("input",".firebase-search-friends",function(e) {
				var dInput = this.value;

				if(typeof dInput == 'undefined') {
					dInput = $(this).text();
				}

				if(dInput.trim() != '') {
					searchFriends(dInput);
				}
	  		});

	  		$(document).on("input",".firebase-search-users",function(e) {
				var dInput = this.value;

				if(typeof dInput == 'undefined') {
					dInput = $(this).text();
				}

				if(dInput.trim() != '') {
					searchUsers(dInput);
				}
	  		});

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
	  	}
	});
}());