<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// // Authentication Login routes...
Route::auth();
Auth::routes();

// Homepage
Route::get('/', ['uses' => 'FirebaseController@index', 'as' => 'users']);
Route::get('/home', ['uses' => 'FirebaseController@index', 'as' => 'users']);

// Download
Route::get('/download', 'DownloadController@anchor');

// Contact
Route::get('/contact', 'ContactController@anchor');

// Highlights
Route::get('/highlights', 'HighlightsController@anchor');

// Roadmap
Route::get('/roadmap', 'RoadmapController@anchor');