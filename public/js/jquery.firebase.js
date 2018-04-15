firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var user = firebase.auth().currentUser;
    if(user != null){
    	var email_id = user.email;

    	//alert("Welcome" + email_id);

    	handleUserSession(user.uid);
    }
  } else {
    // No user is signed in.
    
  }
});

function handleUserSession(uid) {
	var token = $('meta[name="csrf-token"]').attr('content'),
		url = '/auth/'+uid,
		data = {uid: uid};

	$.ajax({
		type: 'POST',
		url: url,
		headers: {'X-CSRF-TOKEN': token},
		data: data,
		datatype: 'JSON',
		success: function (data) {
			if(data.success == true) {
				hideLoader();
				$('.js-load-finish').addClass('active');

				setTimeout(
				  function() 
				  {
				    location.reload(); 
				  }, 2000);
			}
		}
	});
}

function hideLoader() {
	$('#js-loader, .js-load-finish').removeClass('active');
	$('.js-load').show();
}

//This will sign-in the user
function login() {
	var email = document.getElementById("email_field").value,
		password = document.getElementById("password_field").value;


	$('#js-loader').addClass('active'); 	
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
	  	// Handle Errors here.
	  	var errorCode = error.code;
	  	var errorMessage = error.message;
	  	alert("Error : " + errorMessage);
	  	hideLoader();
	  	// ...
	});
}

$(document).on("click","#js-login",function() {
	login();
});

document.onkeydown=function(evt){
    var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
    if(keyCode == 13)
    {
		login();
    }
}