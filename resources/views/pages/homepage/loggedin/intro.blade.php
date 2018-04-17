<!-- {{$debugpath}} -->
<div class="particles-animation-wrapper">
	<div class="particles-content-wrapper">

		<!-- Includes the logo -->
		@include('includes.svg.logo-svg')

		<h2 class="logo-text">{{ $user->email }}</h2>
		<p>Your UID is: {{ $user->uid }}</p>
		<button type="button" class="btn btn-primary" id="js-logout">{{ Lang::get('buttons.logout') }}</button>
	</div>
	<div id="particles-js" class="particles-animation"></div>
</div>