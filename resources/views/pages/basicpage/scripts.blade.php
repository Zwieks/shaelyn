<!-- {{$debugpath}} -->
<script src="https://www.gstatic.com/firebasejs/4.12.1/firebase.js"></script>
<script>
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

  const preObject = document.getElementById('objtect');

		firebase.auth().onAuthStateChanged((user) => {
		  	if (user) {
		      	// Create references
			  	const dbRefObject = firebase.database().ref().child('Users/'+user.uid);

			  	// Sync object changes
			  	dbRefObject.on('value', snap => {
			  		document.getElementById('js-username').innerHTML = snap.val().name
			  	});
		  	}
		});
}());  
</script>

<script type="text/javascript" src="{{ URL::asset('js/jquery.browser.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.viewport.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.header.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.inav.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.animating-labels.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.form-improvement.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.zoom-images.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.grid.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.breadcrumb.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.youtube.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.scrolldepth.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.tracking.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.acties.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.forms.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.parallax.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/bootstrap/modal.js') }}"></script>

@hasSection('headeranimation')
	@yield('headeranimation')
@endif