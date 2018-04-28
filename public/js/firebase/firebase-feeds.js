/*
	---FIREBASE BASIC FUNCTIONALITIES----
*/

;(function($) {

	//Gets all the members of an feed
	$.fn.firebase_getPartyPeople = function(uId, feedId) {
		var people_array
		firebase.database().ref().child('feed/'+uId+'/'+feedId).on('value', snap => {
			people_array = snap.val().partyPeople.split(';');
			return people_array;	
		});

		return people_array
	}
})(jQuery);