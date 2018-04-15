<?php

namespace Shaelyn\Http\Controllers;
use Illuminate\Http\Request;
use Shaelyn\Sessions;
use Cookie;

class FirebaseController extends Controller
{
    public function index(Request $request, $uid) {

        if($request->hasCookie('user')) {
            $cookie = cookie('user', $uid, 45000);
            return response()->json(array('success' => true))->cookie($cookie);
        }else {
            $cookie = cookie('user', '', 45000);
            return response()->cookie($cookie);
        }  
    }
}
