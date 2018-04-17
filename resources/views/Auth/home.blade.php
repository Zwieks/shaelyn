<!-- {{$debugpath}} -->
@extends('layouts.master')

{{-- Page Title --}}
@section('title', Lang::get('global.head-title'))

{{-- Name of body class --}}
@section('type','home ')

{{-- Metadata content --}}
@section('description', 'Homepage')

{{-- Include Content --}}
@section('content')
    @include('pages.homepage.home')
@stop

{{-- Include Scripts --}}
@section('page-scripts')
    @include('scripts.modal.modal-show-auth-init')
@stop

{{-- Include Firebase --}}
@section('firebase')
	@include('includes.firebase.init')
@stop

{{-- Include Modal --}}
@section('modal')
	@include('modals.layout', ['content' => "modals.auth.login", 'modaltype' => 'transparent'])
@stop

{{-- Include Scripts --}}
@section('headeranimation')
	<script type="text/javascript" src="{{ URL::asset('js/network-animation.js') }}"></script>
	<script type="text/javascript" src="{{ URL::asset('js/network-animation-init.js') }}"></script>
	<script type="text/javascript" src="{{ URL::asset('js/firebase/firebase-default.js') }}"></script>
@stop