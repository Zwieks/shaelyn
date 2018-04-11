<!-- {{$debugpath}} -->
<!-- OPEN GRAPH / FACEBOOK -->
<meta property="og:type" content="article">
<meta property="og:locale" content="{{ Lang::getLocale() }}">
<meta property="og:url" content="{{ Request::url() }}">
<meta property="og:site_name" content="{{config('app.name')}}">
<meta property="og:title" content="@yield('title')">
<meta property="og:description" content="@yield('description')">
<meta property="og:image" content="{{ asset('img/social-banner-1200x630.png') }}">

<!-- TWITTER CARDS -->
<meta name="twitter:card" content="summary">
<meta name="twitter:image" content="{{ asset('img/logo_1260x675.png') }}">
<meta name="twitter:title" content="@yield('title')">
<meta name="twitter:description" content="@yield('description')">

<!-- GOOGLE+ -->
<meta itemprop="name" content="@yield('title')">
<meta itemprop="headline" content="{{config('app.name')}}">
<meta itemprop="description" content="@yield('description')">
<meta itemprop="image" content="{{ asset('img/logo_900x600.png') }}">