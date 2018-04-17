<!-- {{$debugpath}} -->
<div class='component-full empty comp-highlights' id="highlights">
	<div class="inner parallax-wrapper inviewelement slideinleft">
		<section class="highlights-intro">
			<h2>{{Lang::get('highlights.headtext')}}</h2>
			<p>{{Lang::get('highlights.subtext')}}</p>
		</section>

		<div class="hightlight-wrapper inviewelement slideinright">
			<section class="hightlight-item">
				<figure>
					<img src="{{ asset('img/003-technology.svg') }}">
				</figure>	
				<h2>{{Lang::get('highlights.easy_to_use_headtext')}}</h2>
				<p>{{Lang::get('highlights.easy_to_use_subtext')}}</p>
			</section>	

			<section class="hightlight-item">
				<figure>
					<img src="{{ asset('img/002-sand-clock.svg') }}">
				</figure>	
				<h2>{{Lang::get('highlights.realtime_headtext')}}</h2>
				<p>{{Lang::get('highlights.realtime_subtext')}}</p>
			</section>

			<section class="hightlight-item">
				<figure>
					<img src="{{ asset('img/001-paper-plane.svg') }}">
				</figure>	
				<h2>{{Lang::get('highlights.sharing_headtext')}}</h2>
				<p>{{Lang::get('highlights.sharing_subtext')}}</p>
			</section>
		</div>	
	</div>
</div>	