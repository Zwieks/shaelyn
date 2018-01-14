<!-- {{$debugpath}} -->
<header class="page-header">
	<div class="inner">
		<figure class="page-logo">
			 <a href="/" title="{{ Lang::get('basicpage.logotitle') }}">
				<img src="{{ asset('img/logo-small-white.svg') }}" alt="Logo {{ Lang::get('global.name') }}">
				<span class="logo-text">{{ Lang::get('global.name') }}</span>
			 </a>
		</figure>

		@include('pages.basicpage.navmain')
	</div>	
</header>