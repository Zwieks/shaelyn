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