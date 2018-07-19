// part 24 in tutorial
'use strict'
const gcs = require('@google-cloud/storage')();
const Vision = require('@google-cloud/vision');
const vision = new Vision();
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.tickedBoxesCount = functions.database.ref('/listItems/{list_id}/{list_item_id}/ticked').onUpdate((event, context) => {
	const list_id = context.params.list_id;
	const list_item_id = context.params.list_item_id;

	return admin.database().ref(`/listItems/${list_id}/${list_item_id}/ticked`).once('value').then(snap => {
		const status = snap.val();

		return admin.database().ref(`/lists/${list_id}`).once('value').then(snap => {
			const total_ticked = snap.val().tickedCount;

			if(status) {
				admin.database().ref(`/lists/${list_id}/tickedCount`).set(total_ticked+1);
			}else {
				admin.database().ref(`/lists/${list_id}/tickedCount`).set(total_ticked-1);
			}
	    	return null;
		});
	});	
});

exports.increaseUserListCount = functions.database.ref('/listAttendees/{list_id}/{user_id}').onCreate((event, context) => {
	const list_id = context.params.list_id;
	
	return admin.database().ref(`/lists/${list_id}`).once('value').then(snap => {
		const total_items = snap.val().userCount;
		
		admin.database().ref(`/lists/${list_id}/userCount`).set(total_items+1);
		return null;
	})
});

exports.decreaseUserListCount = functions.database.ref('/listAttendees/{list_id}/{user_id}').onDelete((event, context) => {
	const list_id = context.params.list_id;
	
	return admin.database().ref(`/lists/${list_id}`).once('value').then(snap => {
		const total_items = snap.val().userCount;
		
		admin.database().ref(`/lists/${list_id}/userCount`).set(total_items-1);

		if(total_items-1 <= 0) {
			admin.database().ref(`/lists/${list_id}`).remove();
		}

		return null;
	})
});

exports.increaseListItemsCount = functions.database.ref('/listItems/{list_id}/{list_item_id}').onCreate((event, context) => {
	const list_id = context.params.list_id;


	return admin.database().ref(`/lists/${list_id}`).once('value').then(snap => {
		const total_items = snap.val().itemCount;

    	admin.database().ref(`/lists/${list_id}/itemCount`).set(total_items+1);
    	return null;
	});	
});
 
exports.decreaseListItemsCount = functions.database.ref('/listItems/{list_id}/{list_item_id}').onDelete((event, context) => {
	const list_id = context.params.list_id;


	return admin.database().ref(`/lists/${list_id}`).once('value').then(snap => {
		const total_items = snap.val().itemCount;

    	admin.database().ref(`/lists/${list_id}/itemCount`).set(total_items-1);
    	return null;
	});	
});

exports.sendNotification = functions.database.ref('/notifications/{user_id}/{notification_id}').onWrite(event => {
   
    const user_id = event.params.user_id;
    const notification_id = event.params.notification_id;
   
    console.log('We have a notification : ', user_id);
   
    if (!event.data.val()){
        return console.log('A notification has been deleted from the database', notification_id);
    }
   
    const fromUser = admin.database().ref(`/notifications/${user_id}/${notification_id}`).once('value');
    return fromUser.then(fromUserResult => {
       
        const from_user_id = fromUserResult.val().from;
           
        console.log('You have a new notification from: ', from_user_id);
       
        const userQuery = admin.database().ref(`/Users/${from_user_id}/name`).once('value');
        return userQuery.then(userResult => {
           
            const userName = userResult.val();
           
            console.log('senders name is: ', userName);
 
           
            const deviceToken = admin.database().ref(`/Users/${user_id}/device_token`).once('value');
           
            return deviceToken.then(result => {
               
                const token_id = result.val();
               
                const payload = {
                    notification: {
                        title: `${userName} wants to be your friend!`,
                        body: "What do you say?",
                        icon: "default",
                        click_action: "com.stella.dennis.shaelyn_TARGET_NOTIFICATION"
                    },
                    data: {
                        from_user_id: from_user_id
                    }
                };
           
                return admin.messaging().sendToDevice(token_id, payload).then(response => {
                    console.log('This was the notification feature');

                    return {results: []};
                });
               
            });
           
        });
           
    });
   
});

// Sends a notifications to all users when a new message is posted.
exports.sendNotifications = functions.database.ref('/ChatMessages/{groupId}/{messageId}').onCreate((snapshot, context) => {

	const userId = snapshot.val().from;
	const groupId = context.params.groupId;
	const text = snapshot.val().message;
	let tokens = []; // All Device tokens to send a notification to.
	const payload = {
		notification: {
  			title: `${snapshot.val().name} posted ${text ? 'a message' : 'an image'}`,
  			body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : '',
  			click_action: `https://shaelyn.io`,
		}
	};

	//Get the user info
	return admin.database().ref('Users').child(userId).once('value').then((userInfo) => {
		payload.notification.icon = userInfo.val().thumb_image || '/img/logo-3d.png'

		return null;
	}).then(() => {
		//Get the chat attendees
		return admin.database().ref(`/ChatAttendees/${groupId}`).once('value').then((chatAttendeesResult) => {
			chatAttendeesResult.forEach((result, index) => {
			   	const error = result.error;
			   	if (error) {
			     	console.error('Failure creating chat attendees and tokens match');
			   	}else {
			   		if(result.val().token !== "" && result.val().notification === true && userId !== result.key ) {
			   			tokens.push(result.val().token);
			   		}
			   	}
			});
			// Send notifications to all tokens.
			if (tokens.length) {
	      		return admin.messaging().sendToDevice(tokens, payload);
	      	}else {
	      		return null;
	      	}
		}).then((response) => {
			return cleanupTokens(response, groupId, tokens);
		}).then(() => {
			console.log('Notifications have been sent and tokens cleaned up.');
			return null;
		});
	});	


  	// Notification details.
  	// const text = snapshot.val().message;
  	// const payload = {
   //  	notification: {
   //    		title: `${snapshot.val().name} posted ${text ? 'a message' : 'an image'}`,
   //    		body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : '',
	  // 		//icon: snapshot.val().photoUrl || '/images/profile_placeholder.png',
   //    		icon: '/img/logo-3d.png',
   //    		click_action: `https://shaelyn.io`,
   //  	}
  	// };

  	// let tokens = []; // All Device tokens to send a notification to.
  	// // Get the list of device tokens.
  	// return admin.database().ref('fcmTokens').once('value').then((allTokens) => {
   //  	if (allTokens.val()) {
   //    		// Listing all tokens.
   //    		tokens = Object.keys(allTokens.val());

   //    		// Send notifications to all tokens.
   //    		return admin.messaging().sendToDevice(tokens, payload);
   //  	}
   //  	return {results: []};
  	// }).then((response) => {
   //  	return cleanupTokens(response, tokens);
  	// }).then(() => {
   //  	console.log('Notifications have been sent and tokens cleaned up.');
   //  	return null;
  	// });
});

// Cleans up the tokens that are no longer valid.
function cleanupTokens(response, groupId, tokens) {
	// For each notification we check if there was an error.
	const tokensToRemove = {};
	response.results.forEach((result, index) => {
		const error = result.error;
		if (error) {
	 		console.error('Failure sending notification to', tokens[index], error);
	 		//Cleanup the tokens who are not registered anymore.
			if (error.code === 'messaging/invalid-registration-token' || error.code === 'messaging/registration-token-not-registered') {
				//tokensToRemove[];
				//tokensToRemove[`/ChatAttendees/${groupId}/${tokens[index]}`] = null;
			}
		}
	});
	return null;
	//return admin.database().ref().update(tokensToRemove);
}

// Sends a notifications to all users when a new message is posted.
// exports.sendNotifications = functions.database.ref('/ChatMessages/{chatId}/{messageId}').onCreate(snapshot => {
//   	// Notification details.
//   	const text = snapshot.val().message;
//   	const payload = {
//     	notification: {
//       		title: `${snapshot.val().name} posted ${text ? 'a message' : 'an image'}`,
//       		body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : '',
//       		//icon: snapshot.val().photoUrl || '/images/profile_placeholder.png',
//       		icon: '/img/logo-3d.png',
//       		click_action: `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com`,
//     	}
//   	};

//   	let tokens = []; // All Device tokens to send a notification to.
//   	// Get the list of device tokens.
//   	return admin.database().ref('fcmTokens').once('value').then(allTokens => {
//     	if (allTokens.val()) {
//       		// Listing all tokens.
//       		tokens = Object.keys(allTokens.val());

//       		// Send notifications to all tokens.
//       		return admin.messaging().sendToDevice(tokens, payload);
//     	}
//     	return {results: []};
//   	}).then(response => {
//     	// For each notification we check if there was an error.
//     	const tokensToRemove = {};
//     	response.results.forEach((result, index) => {
//       		const error = result.error;
//       		if (error) {
//         		console.error('Failure sending notification to', tokens[index], error);
//         		// Cleanup the tokens who are not registered anymore.
//         		if (error.code === 'messaging/invalid-registration-token' ||
//             		error.code === 'messaging/registration-token-not-registered') {
//           				tokensToRemove[`/fcmTokens/${tokens[index]}`] = null;
//         		}
//       		}
//     	});
//     	return admin.database().ref().update(tokensToRemove);
//   	}).then(() => {
//     	console.log('Notifications have been sent and tokens cleaned up.');
//     	return null;
//   	});
// });


// Adds a message that welcomes new users into the chat.
exports.addWelcomeMessages = functions.auth.user().onCreate(user => {
  	console.log('A new user signed in for the first time.');
  	const fullName = user.displayName || 'Anonymous';
  	const chatId = snapshot.val().text;

  	return admin.database().ref('/BetaChat').push({
    	chatOwner: firebase.auth().currentUser.uid,
    	groupImage: '/images/logo-3d.png', // Firebase logo
    	name: 'Shaelyn bot', // Using back-ticks.
    	order: -admin.database.ServerValue.TIMESTAMP,
    	time: admin.database.ServerValue.TIMESTAMP,
    	type: 'single',
    	userCount: 2,

  	}).then(() => {
    	console.log('Moderator chat generated in the database.');
    	return null;
  	});


 	// Saves the new welcome message into the database
  	// which then displays it in the FriendlyChat clients.
  	// return admin.database().ref('/ChatMessages/{chatId}').push({
   //  	name: 'Firebase Bot',
   //  	photoUrl: '/images/logo-3d.png', // Firebase logo
   //  	text: `${fullName} signed in for the first time! Welcome!`, // Using back-ticks.
  	// }).then(() => {
   //  	console.log('Welcome message written to database.');
   //  	return null;
  	// });
});

// Blurs uploaded images that are flagged as Adult or Violence.
exports.blurOffensiveImages = functions.storage.object().onFinalize(object => {
  const image = {
    source: {imageUri: `gs://${object.bucket}/${object.name}`},
  };

  // Check the image content using the Cloud Vision API.
  return vision.safeSearchDetection(image).then(batchAnnotateImagesResponse => {
    const safeSearchResult = batchAnnotateImagesResponse[0].safeSearchAnnotation;
    const Likelihood = Vision.types.Likelihood;
    if (Likelihood[safeSearchResult.adult] >= Likelihood.LIKELY ||
        Likelihood[safeSearchResult.violence] >= Likelihood.LIKELY) {
      console.log('The image', object.name, 'has been detected as inappropriate.');
      return blurImage(object.name, object.bucket);
    } else {
      console.log('The image', object.name,'has been detected as OK.');
      return null;
    }
  });
});

// Blurs the given image located in the given bucket using ImageMagick.
function blurImage(filePath, bucketName, metadata) {
  const tempLocalFile = path.join(os.tmpdir(), path.basename(filePath));
  const groupId = filePath.split(path.sep)[1];
  const messageId = filePath.split(path.sep)[2];
  const bucket = gcs.bucket(bucketName);
  // Download file from bucket.
  return bucket.file(filePath).download({destination: tempLocalFile}).then(() => {
    console.log('Image has been downloaded to', tempLocalFile);
    // Blur the image using ImageMagick.
    return spawn('convert', [tempLocalFile, '-channel', 'RGBA', '-blur', '0x24', tempLocalFile]);
  }).then(() => {
    console.log('Image has been blurred');
    // Uploading the Blurred image back into the bucket.
    return bucket.upload(tempLocalFile, {destination: filePath});
  }).then(() => {
    console.log('Blurred image has been uploaded to', filePath);
    // Deleting the local file to free up disk space.
    fs.unlinkSync(tempLocalFile);
    console.log('Deleted local file.');
    // Indicate that the message has been moderated.
    return admin.database().ref(`/ChatMessages/${groupId}/${messageId}`).update({moderated: true});
  }).then(() => {
    console.log('Marked the image as moderated in the database.');
    return null;
  });
}