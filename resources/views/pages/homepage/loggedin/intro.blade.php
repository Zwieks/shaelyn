<!-- {{$debugpath}} -->
<div class="particles-animation-wrapper">
	<div class="particles-content-wrapper">

		<figure>
			<img src="{{$user['thumb_image']}}" />
		</figure>

		<pre id="object"></pre>

		<h2 id="js-username" class="logo-text">{{$user['name']}}</h2>	

		<button type="button" class="btn btn-primary" id="js-logout">{{ Lang::get('buttons.login') }}</button>
	</div>
	<div id="particles-js" class="particles-animation"></div>
</div>