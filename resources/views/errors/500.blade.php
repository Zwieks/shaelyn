<!-- {{$debugpath}} -->

test
@extends('layouts.master')

{{-- Page Title --}}
@section('title',  Lang::get('global.head-title'))

{{-- Name of body class --}}
@section('type','error ')

{{-- Metadata content --}}
@section('description', 'Homepage')

{{-- Include Content --}}
@section('content')
    @include('errors.templates.500')
@stop