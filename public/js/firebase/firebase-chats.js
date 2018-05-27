/*
	---FIREBASE LIST FUNCTIONALITIES----
*/

;(function($) {
	//Removes single LIST
	$.fn.firebase_getUserChat = function(userId) {
		console.log(userId);
		// $('#list-'+listId).slideUp("normal", function() { 
		// 	$(this).remove(); 
		// });

	 //  	var updates = {},
	 //  		currentUser = firebase.auth().currentUser.uid;

	 //  	updates['UsersLists/' + currentUser + '/' + listId] = null;
	 //  	updates['listAttendees/' + listId  + '/' + currentUser] = null;

	 // 	return firebase.database().ref().update(updates);
	};

	// Toggle the chat window of the user
	$(document).on("click","#firebase-chat-friends .card-wrapper",function(){
		var userId = $(this).attr("id").replace('chat-userfriend-', '');
		
		$.fn.firebase_getUserChat(userId);
	});
})(jQuery);