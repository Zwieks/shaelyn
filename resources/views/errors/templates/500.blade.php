<!-- {{$debugpath}} -->
<div class="home-wrapper">
	<div class="error-wrapper">
		<section class="content-wrapper">
			<h2 class="error-title">{{Lang::get('errors.500-title')}}</h2>
			<h3 class="error-subtitle">{{Lang::get('errors.500-subtitle')}}</h3>
			<p class="error-content">{{Lang::get('errors.500-content')}}</p>
			<span class="error-indication">{!! Lang::get('errors.500-indication') !!}</span>
		</section>

		<figure class="image-wrapper">
			<img src="{{ asset('img/robot.svg') }}">
		</figure>	
	</div>
</div>