<!-- {{$debugpath}} -->
<script src="https://www.gstatic.com/firebasejs/4.12.1/firebase.js"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.browser.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.viewport.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.header.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.inav.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.animating-labels.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.form-improvement.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.zoom-images.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.grid.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.breadcrumb.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.youtube.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.scrolldepth.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.tracking.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.acties.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.forms.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.parallax.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/bootstrap/modal.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/HTML.creator.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/jquery.CustomScrollbar.js') }}"></script>

<!-- OWL SLIDER -->
<script type="text/javascript" src="{{ URL::asset('js/jquery.owl.carousel.min.js') }}"></script>

<!-- TEXTAREA AUTOSIZE -->
<script type="text/javascript" src="{{ URL::asset('js/jquery.textarea_autosize.min.js') }}"></script>

<!-- FIREBASE DOM FUNCTIONALITES -->
<script src="/js/lang.js"></script>
<script type="text/javascript" src="{{ URL::asset('js/firebase/firebase-lists.js') }}"></script>
<script type="text/javascript" src="{{ URL::asset('js/firebase/firebase-chats.js') }}"></script>

@hasSection('headeranimation')
	@yield('headeranimation')
@endif