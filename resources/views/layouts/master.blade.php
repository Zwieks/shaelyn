<!DOCTYPE html>
    <html lang='{{$locale}}' itemscope itemtype= @if($type === 'homepage') "http://schema.org/WebSite" @else "http://schema.org/WebPage" @endif>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">

        @include('pages.basicpage.head-meta')
        @include('pages.basicpage.head-socials')

        <link rel="stylesheet" href="{{ URL::asset('css/site.css') }}" type="text/css" media="screen">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,600,700,800,900" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Pacifico" rel="stylesheet">
        
        <title>@yield('title')</title>
    </head>
    <body @if (Request::path() === '/') itemscope itemtype="http://schema.org/WebSite"@endif class="component-@yield('type')@hasSection('heroimage') has-bgimage @endif @if(Auth::check())logedin @endif preload">
       <!--  heading for document outline  -->
        <h2 class="hide-from-layout">@yield('title')</h2>

        <!-- Responsive navigation trigger -->
        <input type="checkbox" id="js-nav-trigger" class="nav-trigger">

        @include('includes.header')

        <div class="page-website-wrapper">
            @include('pages.basicpage.wrapper')
            @include('includes.footer')
        </div>

        @hasSection('sticky-content')
            @yield('sticky-content')
        @endif

        <div class="page-mobile-nav-container">
            <label class="nav-toggle" id="js-nav-toggle" for="js-nav-trigger"><span class="wrapper"><span></span></span><strong>{_ 'Menu'}</strong></label>
            <div class="nav-wrapper" id="js-nav-wrapper"></div>
            <div class="nav-closer" id="js-nav-closer"></div>
        </div>

        <!-- JAVASCRIPT -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>

        @include('pages.basicpage.scripts')
    </body>
</html>