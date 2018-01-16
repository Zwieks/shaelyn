<!-- {{$debugpath}} -->
<div class="home-wrapper">
	{{--Render Introduction --}}
	@include('pages.homepage.templates.intro')

	{{--Render Get the App --}}
	@include('pages.homepage.templates.getapp')

	{{--Render Get the App --}}
	@include('pages.homepage.templates.highlights')

	{{--Render Roadmap --}}
	@include('pages.homepage.templates.roadmap')
		
	{{--Render Contact --}}
	@include('pages.homepage.templates.contact')
</div>