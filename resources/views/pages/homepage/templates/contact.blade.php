<!-- {{$debugpath}} -->
<div class='component-full empty comp-contact' id="contact">
	<div class="inner parallax-wrapper inviewelement slideinleft">
		<section class="contact-intro">
			<h2>{{Lang::get('contact.title')}}</h2>
			<p>{{Lang::get('contact.description')}}</p>
		</section>

		<div class="social-wrapper">
			@foreach (Lang::get('contact.items') as $socials => $item)
				<a href="{{$item['url']}}" class="social-item" title="{{$item['title']}}">
					<img src="{{ asset('img/socials/' . $item['img-url'] . '.svg') }}">
				</a>
			@endforeach						
		</div>
	</div>
</div>	