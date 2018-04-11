<!-- {{$debugpath}} -->
<div class="particles-animation-wrapper">
	<div class="particles-content-wrapper">

		<!-- Includes the logo -->
		@include('includes.svg.logo-svg')

		<h2 class="logo-text">{{ Lang::get('global.name') }}</h2>
		<p>{{ Lang::get('global.intro') }}</p>
	</div>
	<div id="particles-js" class="particles-animation"></div>
</div>