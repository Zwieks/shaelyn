<!-- {{$debugpath}} -->
<div class="home-wrapper">
	<div class="error-wrapper">
		<section class="content-wrapper">
			<h2 class="error-title">{{Lang::get('errors.404-title')}}</h2>
			<h3 class="error-subtitle">{{Lang::get('errors.404-subtitle')}}</h3>
			<p class="error-content">{{Lang::get('errors.404-content')}}</p>
			<span class="error-indication">{!! Lang::get('errors.404-indication') !!}</span>
			<a href="/">{{Lang::get('errors.link')}}</a>
		</section>

		<figure class="image-wrapper">
			<img src="{{ asset('img/searching.svg') }}">
		</figure>	
	</div>
</div>