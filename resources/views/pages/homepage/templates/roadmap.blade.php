<!-- {{$debugpath}} -->
<div class='component-full comp-roadmap' id="roadmap">
	<div class="inner parallax-wrapper inviewelement slideintop">
		<section class="roadmap-intro">
			<h2>{{Lang::get('roadmap.title')}}</h2>
			<p>{{Lang::get('roadmap.description')}}</p>
		</section>

		<div class="roadmap-itemwrapper">
			@foreach (Lang::get('roadmap.items') as $roadmap => $item)
				<div class="roadmap-item {{$item['done']}}">
					<div class="image-wrapper">
						<figure>
							<img src="{{ asset('img/markers/' . $item['image'] . '.svg') }}">
						</figure>

						<div class="date-wrapper">
							<span class="month">{{$item['month']}}</span>
							<span class="year">{{$item['year']}}</span>
						</div>
					</div>

					<div class="road-wrapper">
						<div class="roadmap-icon" data-icon="{{$item['icon']}}"></div>
						<div class="filler"></div>
					</div>	

					<section class="content-wrapper">
						<h3>{{$item['title']}}</h3>
						<p>{{$item['description']}}</p>
					</section>
				</div>
			@endforeach 
		</div>	
	</div>
</div>