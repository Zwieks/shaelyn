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
  	const friends_online = document.getElementById('firebase-online-users');
  	const friends_offline = document.getElementById('firebase-offline-users'); 
  	const chat_list = document.getElementById('firebase-chats'); 	
  	const chat_friends_online = document.getElementById('firebase-online-users-chat');
  	const chat_friends_offline = document.getElementById('firebase-offline-users-chat');
  	const chat_conversation_wrapper = document.getElementById('firebase-chat-conversations');
  	const chat_meta = document.getElementById('firebase-chat-meta');
  	const chat_friends = document.getElementById('firebase-chat-friends');
  	const chat_window = document.getElementById('firebase-chat-window');
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
  	const ChatsRef = ref.child('BetaChat');
 	const chatAttendeesRef = ref.child('ChatAttendees');
 	const chatMessagesRef = ref.child('ChatMessages'); 	
  	const userChatsRef = ref.child('UsersChat'); 	
  	const listItemsRef = ref.child('listItems');
  	const friendsRef = ref.child('Friends');

  	function getChatMessages(listId, cb, chat_window) {
  		var chat_window = document.getElementById(chat_window),
  			parent = document.getElementById(chat_window.childNodes[0].id+'_container');

		if (parent == null) {
			parent = chat_window;
		}

  		chatMessagesRef.child(listId).orderByChild('order').limitToLast(50).on('child_added', snap => {
  			let userRef = usersRef.child(snap.val().from);
  			userRef.on('value', snapuser => {
				if(snapuser.val() != null) {
					var message = HTMLcreateChatMessage(listId, snapuser, snap);

		  			//Put the HTML in the container
					$.fn.updateOrPrependHTML("chat-message-"+snap.key, message, parent);					
				}
  			});
  		});
  	}

  	function getChatAttendees(listId, cb) {
  		chatAttendeesRef.child(listId).on('child_added', snap => {
  			let userRef = usersRef.child(snap.key);

  			userRef.on('value', snap => {
  				if(snap.val() != null) {
	  				//Renders the friends that are invited for the specific list
	  				var friend = HTMLcreateListFriend(listId, snap);
					//Put the HTML in the container
					var friends_list = document.getElementById('friends-'+listId);
					//console.log(snap.val());
					//$.fn.updateOrPrependHTML(listId+"friend-"+snap.key, friend, friends_list);
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
  	}

  	function getChatOverviewItem(snap) {
  		//Check if the chat is a single or a group
  		if(snap.type != 'group') {
  			let userRef = chatAttendeesRef.child(snap.key);

  			userRef.on('value', snapuser => {
	  			snapuser.forEach(function(childSnapshot) {
	  				if(childSnapshot.key != firebase.auth().currentUser.uid) {
	  					let userRef = usersRef.child(childSnapshot.key);

			  			userRef.on('value', snap => {
			  				//Renders the friends that are invited for the specific list
			  				var friend = HTMLcreateFriend(snap, 'chat-');
							//Put the HTML in the container
							$.fn.updateOrPrependHTML("chat-userfriend-"+snap.key, friend, chat_list);
			  			});	  					
	  				}
  				});
  			});
  		}else {
			var group = HTMLcreateGroup(snap);
			//Put the HTML in the container
  		}	

  		$.fn.updateOrPrependHTML("chat-"+snap.key, group, chat_list);
  	}

  	// function getChatOverviewItem(snap,cb) {
  	// 	//Check if the chat is a single or a group
  	// 	if(snap.val().type != 'group') {
  	// 		let userRef = chatAttendeesRef.child(snap.key);

  	// 		userRef.on('value', snapuser => {
	  // 			snapuser.forEach(function(childSnapshot) {
	  // 				if(childSnapshot.key != firebase.auth().currentUser.uid) {
	  // 					let userRef = usersRef.child(childSnapshot.key);

			//   			userRef.on('value', snap => {
			//   				if(snap.val() != null) {
			// 	  				//Renders the friends that are invited for the specific list
			// 	  				var friend = HTMLcreateFriend(snap, 'chat-');
			// 					//Put the HTML in the container
			// 					$.fn.updateOrPrependHTML("chat-userfriend-"+snap.key, friend, chat_list);
			// 				}	
			//   			});	  					
	  // 				}
  	// 			});
  	// 		});
  	// 	}else {
  	// 		if(snap.val() != null) {
			// 	var group = HTMLcreateGroup(snap);
			// 	//Put the HTML in the container
			// 	$.fn.updateOrPrependHTML("chat-"+snap.key, group, chat_list);
  	// 		}
  	// 	}	
  	// }

  	function getChats(user, cb) {
  		// Make sure we remove all previous listeners.
  // 		ChatsRef.off();

  // 		// Loads the last 12 messages and listen for new ones.
		// var setMessage = function(data) {
		// 	var val = data.val();
		//     this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
		// }.bind(this);
		// this.messagesRef.limitToLast(12).on('child_added', setMessage);
		//this.messagesRef.limitToLast(12).on('child_changed', setMessage);


	 //  	var array = [];
	 //  	var count = 0;

  // 		userChatsRef.child(user).once('value', snap => {
	 //  		var chat_window = HTMLcreateChatWindow(snap);

		// }).then(snap => {
	 //  		const promises = [];
	 //  		snap.forEach(function(childSnapshot) {
	 //  			let Chat = ChatsRef.child(childSnapshot.key);

	 //  			var promise = Chat.once('value', function(friendshot) {
	 //  				if(friendshot.val() != '') {
		// 		      	array[count] = friendshot.val();
		//   				array[count]['key'] = friendshot.key;


		// 		  		if(friendshot.val().type != 'group') {
		// 		  			let userRef = chatAttendeesRef.child(friendshot.key);
		// 		  			userRef.once('value', snapuser => {
		// 		  				const sec_promises = [];

		// 			  			snapuser.forEach(function(childSnapshot) {
		// 			  				if(childSnapshot.key != firebase.auth().currentUser.uid) {
		// 			  					let userRef = usersRef.child(childSnapshot.key);

		// 					  			var promisess = userRef.once('value', snaper => {
		// 					  				console.log(count);
		// 					  				//console.log(array[count]);
		// 					  				array[count]['user'] = snap.val();
		// 					  				//return snaper.val();
		// 					  			}).then(snaps => {
		// 					  				//HERE IS THE USER INFORMATION NOW PUT THIS IN THE RIGHT PLACE
		// 					  				//array[count]['user'] = snaps.val();
		// 					  			});		
		// 			  				}

		// 			  				sec_promises.push(promisess);
		// 		  				});

		// 		  				return Promise.all(sec_promises);
		// 		  			});
		// 		  		}

		// 				array.sort(function(a,b){
		// 				  	return new Date(a.time) - new Date(b.time);
		// 				});

		// 				count++;
	 //  				}
	 //  			});
	  							
	 //  			promises.push(promise);
	 //  		});

	 //  		return Promise.all(promises);
		// }).then(snaps => {
		// 	console.log(array);
		// 	//$.fn.updateOrPrependHTML("chat-window-"+childSnapshot.key, chat_window, chat_conversation_wrapper);

		// 	//Check the window width
		// 	// if ($(window).width()>768) {
		// 	// 	//Init the scrollbar
	 //  //           $("#chat-window-"+childSnapshot.key).mCustomScrollbar({
	 //  //               theme:"light-3",
	 //  //               autoHideScrollbar: true
	 //  //           }).mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
		// 	// }
		// 	array.forEach(function(item) {
		// 		getChatOverviewItem(item);
		// 	});
		// });
	}
  		      		//console.log(array);


  		
  		// 		let Chat = ChatsRef.child(childSnapshot.key);
  		// 		var chat_window = HTMLcreateChatWindow(childSnapshot);

  	 // 			//Put the HTML in the container
				// $.fn.updateOrPrependHTML("chat-window-"+childSnapshot.key, chat_window, chat_conversation_wrapper);

				// //Check the window width
				// if ($(window).width()>768) {
				// 	//Init the scrollbar
	   //              $("#chat-window-"+childSnapshot.key).mCustomScrollbar({
	   //                  theme:"light-3",
	   //                  autoHideScrollbar: true
	   //              }).mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
				// }


				// Chat.on('value', snapchat => {
	  	// 			if(snapchat.val() != null) {
	  	// 		// 		test[snapchat.val().time] = snapchat;
	  	// 		// 		// Get the array of keys
				// 		// var keys = Object.keys( test );

				// 		// // Sort the keys in descending order
				// 		// keys.sort( function ( a, b ) { return b - a; } );
				// 		// keys.reverse();

				// 		// // Iterate through the array of keys and access the corresponding object properties
				// 		// for ( var i = 0; i < keys.length; i++ ) {
				// 		//     getChatOverviewItem(test[ keys[i] ], snap => console.log(snap.val()));
				// 		// }

				// 		console.log(snapchat.val());

				// 		var meta = HTMLcreateChatMeta(snapchat);
				//   		$.fn.updateOrPrependHTML("chat-meta-"+snap.key, meta, chat_meta);
		  // 			}
	  	// 		});
  		// 	});	


  	// 		let Chat = ChatsRef.child(snap.key);

  	// 		var chat_window = HTMLcreateChatWindow(snap);

  	// 		//Put the HTML in the container
			// $.fn.updateOrPrependHTML("chat-window-"+snap.key, chat_window, chat_conversation_wrapper);

			// if ($(window).width()>768) {
			// 	//Init the scrollbar
   //              $("#chat-window-"+snap.key).mCustomScrollbar({
   //                  theme:"light-3",
   //                  autoHideScrollbar: true
   //              }).mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
			// }

  	// 		Chat.on('value', snapchat => {
  	// 			if(snapchat.val() != null) {
  	// 				test[snapchat.val().time] = snapchat;
  	// 				// Get the array of keys
			// 		var keys = Object.keys( test );

			// 		// Sort the keys in descending order
			// 		keys.sort( function ( a, b ) { return b - a; } );
			// 		keys.reverse();

			// 		// Iterate through the array of keys and access the corresponding object properties
			// 		for ( var i = 0; i < keys.length; i++ ) {
			// 		    getChatOverviewItem(test[ keys[i] ], snap => console.log(snap.val()));
			// 		}

			// 		var meta = HTMLcreateChatMeta(snapchat);
			//   		$.fn.updateOrPrependHTML("chat-meta-"+snap.key, meta, chat_meta);
	  // 			}
  	// 		});



  	// 		//TODO:
  	// 		//Function above needs to send back test otherwise the object will be empty, now the order of the chat overview is always the same..
  	// 		//LAST CHANGED have to be on top




  	// 		//Get the chat attendees
  	// 		getChatAttendees(snap.key, snap => console.log(snap.val()));


  	// 		//Get the chat messages
  	// 		getChatMessages(snap.key, snap => console.log(snap.val()), "chat-window-"+snap.key);

  	function searchUsers(search) {
  		usersRef
  			.orderByChild("nameToLower")
  			.limitToFirst(9)
  			.startAt(search.toLowerCase())
  			.endAt(search.toLowerCase() + "\uf8ff")
  			.on("value", function(snapshot) {
  				if(snapshot.val() != null && snapshot.key != firebase.auth().currentUser.uid) {	
  					var search_users_results = document.getElementById('firebase-search-users-results');
  					search_users_results.innerHTML = '';
	  				snapshot.forEach(function(childSnapshot) {
	  					if(childSnapshot.key != firebase.auth().currentUser.uid) {
		  					friendsRef.child(firebase.auth().currentUser.uid+'/'+childSnapshot.key).once('value', function(friendshot) {
		  						if (!friendshot.exists()) {
		  							var searchItem = HTMLcreateFriend(childSnapshot);
		  					
		  							search_users_results.appendChild(searchItem);
		  						};
		  					});
		  				}	
	  				});
  				}
			});
  	}

  	function searchFriends(search, listId) {
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
					  			listAttendeesRef.child(listId+'/'+childSnapshot.key).once('value', function(friendshot) {
					  				if(!friendshot.exists()) {
										var searchItem = HTMLcreateFriend(childSnapshot);
	  					
	  									search_users_results.appendChild(searchItem);
					  				}
					  			});	
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
		$.fn.updateOrPrependHTML("firebase-image-wrapper", userImage, image);
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
	  				var friend = HTMLcreateFriend(snap, ''),
	  					parent = document.getElementById(chat_friends.childNodes[0].id+'_container');

	  				if (parent == null) {
	  					parent = lists;
	  				}

	  				if(document.getElementById("userfriend-"+snap.key) != null) {
						document.getElementById("userfriend-"+snap.key).remove();
					}  

	  				if(document.getElementById("chat-userfriend-"+snap.key) != null) {
						document.getElementById("chat-userfriend-"+snap.key).remove();
					}  

	  				if(snap.val().online != true){
						$.fn.updateOrPrependHTML("userfriend-"+snap.key, friend, friends_offline);
	  				}else {
	  					$.fn.updateOrPrependHTML("userfriend-"+snap.key, friend, friends_online);
	  				}
					
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

  			$("#firebase-lists .remove-list").removeClass('show');

  			listRef.on('value', snap => {
  				if(snap.val() != null) {
  					let userRef = usersRef.child(snap.val().listOwner);
  					var ownerImage = '';
  					userRef.on('value', snap => {
  						if(snap.val() != null) {
  							if(snap.key != user) {
  								ownerImage = snap.val().thumb_image;
  							}
  						}

  						return ownerImage;
  					});	

	  				var list_overview_item = HTMLcreateListOverviewItem(snap, ownerImage),
	  					focusCheck = checkFocus(),
	  					show = false;

	  				//HTML for the main title of the list
	  				if($("#list-title-"+snap.key).children().hasClass('show')) {
	  					show = true;
	  				}
	  				var list_main_title = HTMLcreateListMainTitle(snap, focusCheck, show);

	  				//Renders the list overview
	  				if(snap.val().userCount != 0) {

						//Set the focus position of the cursor
						if(focusCheck != '') {
							var contentEditable = doGetCaretPosition(document.querySelectorAll('[uni='+focusCheck+']')[0]);
						}

		  				//$(lists).mCustomScrollbar("scrollTo","top");
		  				var parent = document.getElementById(lists.childNodes[0].id+'_container');

		  				if (parent == null) {
		  					parent = lists;
		  				}

		  				//Put the HTML in the container
		  				$.fn.updateOrPrependHTML("list-"+snap.key, list_overview_item, parent);
		  				$.fn.updateOrPrependHTML("list-title-"+snap.key, list_main_title, lists_title);

		  				//Set the cursor position
						if(contentEditable != 0 && focusCheck != '') {
							setCaretPosition(document.querySelectorAll('[uni='+focusCheck+']')[0],contentEditable);	
						}
	  				}
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

					$.fn.updateOrPrependHTML(listId+"friend-"+snap.key, friend, friends_list);
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

					userRef.once('value', snapshot => {
						user = snapshot.val();
					}).then(snap => {
						return user;
					});

					var focusCheck = checkFocus();
					var item = HTMLcreateListItem(listId, snap, focusCheck, user, active_remove);

					//Set the focus position of the cursor
					if(focusCheck != '') {
						var contentEditable = doGetCaretPosition(document.querySelectorAll('[uni='+focusCheck+']')[0]);
					}

	  				var parent = document.getElementById(items_wrapper.childNodes[0].id+'_container');

	  				if ($(window).width()<768 && parent == null) {
	  					parent = lists;
	  				}else {
		  				//Init the scrollbar
						$(items_wrapper).mCustomScrollbar({
				            theme:"light-3",
				            autoHideScrollbar: true
				        });

				        parent = true;
	  				}

					if(parent != null) {
			        	//$(items_wrapper).mCustomScrollbar("scrollTo","top");   	

						if(focusCheck != '') {
							$.fn.updateOrPrependHTML(snap.key, item, document.getElementById(listId+"-items-unchecked"));

							//Set the cursor position
							if(contentEditable != 0) {
								setCaretPosition(document.querySelectorAll('[uni='+focusCheck+']')[0],contentEditable);	
							}
						}else {
							if(document.getElementById(snap.key) != null) {
								document.getElementById(snap.key).remove();
							}  

				        	if(snap.val().ticked != false) {
								$.fn.updateOrPrependHTML(snap.key, item, document.getElementById(listId+"-items-checked"));
				        	}else {
				        		$.fn.updateOrPrependHTML(snap.key, item, document.getElementById(listId+"-items-unchecked"));
				        	}
						}

						//Reset the textarea height
						autosize(document.querySelectorAll('textarea:not(.chat-message-input)'));
					}
 					
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

	$.fn.getHeighestAttrNum = function(item) {
		var num = item.map(function() {
		    return $(this).data('order');
		}).get();//get all data values in an array

		var highest = Math.max.apply(Math, num);//find the highest value from them
		item.filter(function(){
		    return $(this).data('order') == highest;//return the highest div
		});

		return highest;
	};

	$.fn.updateOrPrependHTML = function(id, HTML_object, parent) {
		if(document.getElementById(id) != null) {
			var update_item_list = document.getElementById(id);
				update_item_list.innerHTML = HTML_object.innerHTML;
		}else if($('#firebase-chat-conversations').hasClass('loaded') &&
				id.toLowerCase().indexOf("chat-message-") >= 0){
			parent.append(HTML_object);
		}else {
			parent.prepend(HTML_object);
		}

		//Set focus if element got class FOCUS
		if(typeof document.querySelectorAll('[focus="true"]')[0] != 'undefined')
		{
			var focused = document.querySelectorAll('[focus="true"]')[0];
			$(focused).focus();

			//setEndOfContenteditable(focused);
		}
  	};

  	$.fn.checkTimestamp = function(timeStamp) {
		var one_day=1000*60*60*24;    // Convert both dates to milliseconds
		var date1_ms = new Date(Date.now());  
		var date2_ms = new Date(timeStamp);    // Calculate the difference in milliseconds  
		var yesterday = new Date(Date.now() - 864e5);

		var date = new Date(timeStamp);
		var day = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();

		var date1 = new Date(year+'/'+month+'/'+day);

		var date = new Date(Date.now());
		var day = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();

		var date2 = new Date(year+'/'+month+'/'+day);

		var difference_ms = date2 - date1;        // Convert back to days and return   
		var diffDays = Math.ceil(difference_ms / (1000 * 3600 * 24)); 

		return diffDays; 
  	};

  	function updateOrAppendHTML(id, HTML_object, parent) {
		if(document.getElementById(id) != null) {
			var update_item_list = document.getElementById(id);
				update_item_list.innerHTML = HTML_object.innerHTML;
		}else {
			parent.append(HTML_object);
		}

		//Set focus if element got class FOCUS
		if(typeof document.querySelectorAll('[focus="true"]')[0] != 'undefined')
		{
			var focused = document.querySelectorAll('[focus="true"]')[0];
			$(focused).focus();

			//setEndOfContenteditable(focused);
		}
  	}

	firebase.auth().onAuthStateChanged((user) => {
	  	if (user) {
	  		getUser(user.uid, snap => console.log(snap.val()));

	  		getFriends(user.uid, snap => console.log(snap.val()));

	  		getLists(user.uid, snap => console.log(snap.val()));

	  		getChats(user.uid, snap => console.log(snap.val()));

	  		$(document).on("input",".firebase-search-friends",function(e) {
				var dInput = this.value,
					listId = $('#js-invite-friends').attr('data-list');

				if(typeof dInput == 'undefined') {
					dInput = $(this).text();
				}

				if(typeof listId == 'undefined') {
					listId = $(this).text();
				}

				if(dInput.trim() != '' && typeof listId != 'undefined') {
					searchFriends(dInput, listId);
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
					value = $(this).attr('value'),
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