
// iNav options
jQuery(document).iNav({
	/**
	 *  TODO Codeur Start:
	 *  - Optional settings here, see defaults in '/js/jquery.inav.js'
	 *  - For example, to push extra elements in the responsive navigation:
	 *      navContainers: [jQuery('#js-mainmenu'), jQuery('#js-topmenu')]
	 *  - Always push jQuery objects with an ID in the above array
	 */
});

// Set a class on the html tag so we can style a smaller variant of the header (more info in jquery.header.js)
jQuery(window).on('load resize scroll', function(){
	setHeader(200, 1024);
});

// When all resources are loaded...
jQuery(window).on('load', function(){

	// Remove class when Javascript is loaded
	jQuery('body').removeClass('preload');

	// Init Kirra and Google Analytics tracker
	jQuery(window).analyticsTracker();

});

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getInitials(name) {
	var initials = name.match(/\b\w/g) || [];

	//Japanese range
	if (name.match(/[\u3000-\u9FBF]/)) {
		initials = name.match(/[\u3000-\u9FBF]/);
	}

	initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
	
	return initials;
}

function invertColor(bgColor) {
    if (!bgColor) { return ''; }
    return (parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff';
}

function setEndOfContenteditable(contentEditableElement){
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}

function scrollToAnchor(aid){
    var aTag = $("a[name='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

jQuery(document).ready(function(){
	var offset = 250;	 
	var duration = 300;

	//TEMPORARY NAVIGATION
	$('#js-mainmenu a, #js-nav-wrapper a').click(function(event) {
		event.preventDefault();

		var component = $(this).attr('href').replace(/\//g, ''),
			scrollpoint = '#'+component,
			offset = 0,
			headerHeight = $('.page-header').height() - 1;

		//Check scrolling position
		if(component != '') 
			offset = $(scrollpoint).offset().top - headerHeight;

		//Remove the active class and then add the class to the clicked item
		$(this).parent().parent().children().removeClass('active');
		$(this).parent().addClass('active');

		//Animate
		$('html, body').animate( { scrollTop: offset}, 750, 'swing');

		//Close mobile menu if open
		$('#js-nav-trigger').prop('checked', false);

		return false;
	});

	//Check if there is a hash in the URL
	if(window.location.hash) {
		event.preventDefault();
		var hash = window.location.hash;
	}

	 
	if ($('#js-backtotop').length) {
	    var scrollTrigger = 500, // px
	        backToTop = function () {
	            var scrollTop = $(window).scrollTop();
	            if (scrollTop > scrollTrigger) {
	                $('#js-backtotop').addClass('show');
	            } else {
	                $('#js-backtotop').removeClass('show');
	            }
	        };
	    backToTop();
	    $(window).on('scroll', function () {
	        backToTop();
	    });
	    $('#js-backtotop').on('click', function (e) {
	        e.preventDefault();
	        $('html,body').animate({
	            scrollTop: 0
	        }, 700);
	    });
	}
});

$(document).on("click","#js-logout",function() {
	logout();
});

$(document).on("click","#modal-search-friends .card",function(){
	$(this).parent().toggleClass("invite");
});

$(document).on("click","#js-invite-friends", function(){

	$(".invite").each(function() {
    	var id = $(this).attr('id').replace('userfriend-', '');
    	console.log(id);
	});

	$('#js-invite-friend-search').hide();
	$('#js-friend-invite-confirmation').show();

	setTimeout(function(){
		$('#modal-search-friends').modal('hide');
	}, 1500);
});

$(document).on("click","#modal-search-users .card",function(){
	$(this).parent().toggleClass("invite");
});

$(document).on("click","#js-invite-users", function(){
	$(".invite").each(function() {
    	var id = $(this).attr('id').replace('userfriend-', '');
    	$.fn.firebase_invite_user(id);
	});

	$('#js-invite-user-search').hide();
	$('#js-user-invite-confirmation').show();

	setTimeout(function(){
		$('#modal-search-users').modal('hide');
	}, 1500);
});

//This will sign-out the user
function logout() {
	firebase.auth().signOut().then(function() {
	  	// Sign-out successful.
		var token = $('meta[name="csrf-token"]').attr('content'),
			url = '/ajax/resetSession',
			data = '';

		$.ajax({
			type: 'POST',
			url: url,
			headers: {'X-CSRF-TOKEN': token},
			data: data,
			datatype: 'JSON',
			success: function (data) {
				if(data.success == true) {
					location.reload();
				}
			}
		});
	}).catch(function(error) {
	  // An error happened.
	});
}