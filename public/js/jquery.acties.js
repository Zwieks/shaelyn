
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

function setCaretPosition(ctrl, pos)
{
	if(ctrl.setSelectionRange)
	{
		ctrl.focus();
		ctrl.setSelectionRange(pos,pos);
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}
 

/*
** Returns the caret (cursor) position of the specified text field.
** Return value range is 0-oField.value.length.
*/
function doGetCaretPosition (oField) {

  // Initialize
  var iCaretPos = 0;

  // IE Support
  if (document.selection) {

    // Set focus on the element
    oField.focus();

    // To get cursor position, get empty selection range
    var oSel = document.selection.createRange();

    // Move selection start to 0 position
    oSel.moveStart('character', -oField.value.length);

    // The caret position is selection length
    iCaretPos = oSel.text.length;
  }

  // Firefox support
  else if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionStart;

  // Return results
  return iCaretPos;
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

function getMostUsedWord(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

//IMPORT LIST FUNCTIONALITY
function ImportCreatList(text) {
	var max_items = 100,
		list_items_array = text.split('\n').slice(0, max_items),
		most_used_word = getMostUsedWord(text.split(' ').slice(0, max_items));

	$.fn.firebase_addList(list_items_array, most_used_word);
}

$(document).on("paste",".js-item-dialog",function(e) {
	//Get the data from the clipboard
    var pastedData = e.originalEvent.clipboardData.getData('text');

    if(pastedData != '') {
	    //Create list items from the text of the clipboard
	    ImportCreatList(pastedData);

	    $("#paste-wrapper").removeClass('active');
    }
});

$( ".js-importlist" ).contextmenu(function() {
 	alert( "Handler for .contextmenu() called." );
});


//LOGOUT
$(document).on("click","#js-logout",function() {
	logout();
});

//CLOSE ITEM DIALOG
$(document).bind( "mouseup touchend", function(e) {
    var container = $(".js-item-dialog");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        $("#paste-wrapper").removeClass('active');
    }
});

$(document).on('click', "#js-paste-list" ,function(e) {
	$("#paste-wrapper").addClass('active');
	$('.list-paste').focus();
});

$(document).on('click', '.js-close-item-dialog',function(e) {
	$(this).closest('.js-item-dialog').removeClass('active');
});

$(document).on("click","#modal-search-friends .card",function(){
	$(this).parent().toggleClass("invite");
});

$(document).on("click","#js-invite-friends", function(){
	if ($(".invite").length) {
		$(".invite").each(function() {
	    	var id = $(this).attr('id').replace('userfriend-', ''),
	    		listId = $('#js-invite-friends').attr('data-list');

	    	$.fn.firebase_invite_friends(id, listId);
		});

		$('#js-invite-friend-search').hide();
		$('#js-friend-invite-confirmation').show();
		$('#js-invite-friends').hide();
		$('.js-modal-cancel').hide();

		setTimeout(function(){
			$('#modal-search-friends').modal('hide');
		}, 1500);
	};		
});

$(document).on("click","#modal-search-users .card",function(){
	$(this).parent().toggleClass("invite");
});

$(document).on("click","#js-invite-users", function(){
	if ($(".invite").length) {
		$(".invite").each(function() {
	    	var id = $(this).attr('id').replace('userfriend-', '');
	    	$.fn.firebase_invite_user(id);
		});

		$('#js-invite-user-search').hide();
		$('#js-user-invite-confirmation').show();
		$('#js-invite-users').hide();
		$('.js-modal-cancel').hide();

		setTimeout(function(){
			$('#modal-search-users').modal('hide');
		}, 1500);
	};		
});

$(document).on("keypress","[contenteditable]", function(evt){
  var keycode = evt.charCode || evt.keyCode;
  if (keycode  == 13) { //Enter key's keycode
  	$(this).blur();
    return false;
  }
});

//This will sign-out the user
function logout() {
	//Set online status
	firebase.database().ref("Users/"+ firebase.auth().currentUser.uid).update({ 
		online: Date.now()
	});

	firebase.auth().signOut().then(function() {
	  	// Sign-out successful.
		var token = $('meta[name="csrf-token"]').attr('content'),
			url = '/ajax/resetSession',
			data = '';

		$.ajax({
			method: 'POST',
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