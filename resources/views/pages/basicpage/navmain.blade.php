<!-- {{$debugpath}} -->
<nav class="page-mainmenu" id="js-mainmenu" itemscope itemtype="http://schema.org/SiteNavigationElement">
	<h2 class="hide-from-layout nocontent">{{ Lang::get('basicpage.mainnavtitle') }}</h2>
	<ul class="level-1">
		@if(isset($user))
			<li id="js-logout" class="level-1-item {{(current_page(Lang::get('menus.login'))) ? 'active' : current_page()}}" data-toggle='modal' data-target='#modal-login'>
				<div href="{{ Lang::get('menus.login-url') }}" itemprop="url" class="hasimage">
					<img src="{{ asset('img/logout.svg') }}" alt=""/>
				</div>
				<meta itemprop="position" content="2">
			</li>
		@else
			<li class="home level-1-item {{(current_page('/')) ? 'active' : current_page()}}">
				<a href="/" itemprop="url" data-icon="a">
					<span itemprop="name">{{ Lang::get('menus.home') }}</span>
				</a>
				<meta itemprop="position" content="1">
			</li>

			<li class="level-1-item {{(current_page(Lang::get('menus.download-url'))) ? 'active' : current_page()}}">
				<a href="{{ Lang::get('menus.download-url') }}" itemprop="url" data-icon="f">
					<span itemprop="name">{{ Lang::get('menus.download') }}</span>
				</a>
				<meta itemprop="position" content="2">
			</li>

			<li class="level-1-item {{(current_page(Lang::get('menus.highlights'))) ? 'active' : current_page()}}">
				<a href="{{ Lang::get('menus.highlights-url') }}" itemprop="url" data-icon="l">
					<span itemprop="name">{{ Lang::get('menus.highlights') }}</span>
				</a>
				<meta itemprop="position" content="2">
			</li>

			<li class="level-1-item {{(current_page(Lang::get('menus.roadmap'))) ? 'active' : current_page()}}">
				<a href="{{ Lang::get('menus.roadmap-url') }}" itemprop="url" data-icon="i">
					<span itemprop="name">{{ Lang::get('menus.roadmap') }}</span>
				</a>
				<meta itemprop="position" content="2">
			</li>


			<li class="level-1-item {{(current_page(Lang::get('menus.contact'))) ? 'active' : current_page()}}">
				<a href="{{ Lang::get('menus.contact-url') }}" itemprop="url" data-icon="j">
					<span itemprop="name">{{ Lang::get('menus.contact') }}</span>
				</a>
				<meta itemprop="position" content="2">
			</li>

			<li class="level-1-item {{(current_page(Lang::get('menus.login'))) ? 'active' : current_page()}}" data-toggle='modal' data-target='#modal-login'>
				<div href="{{ Lang::get('menus.login-url') }}" itemprop="url" class="hasimage">
					<img src="{{ asset('img/user.svg') }}" alt=""/>
					<span class="mobile-only" itemprop="name">{{ Lang::get('menus.login') }}</span>
				</div>
				<meta itemprop="position" content="2">
			</li>
		@endif
	</ul>
</nav>

@yield('script')