<?php

namespace Shaelyn;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Sessions extends Model
{
	//Set the global user sessions after the user is loggedin
	//Session is set in the User Controller
    public static function setGlobalUserSession(Request $request, $user){
	    if($request->session()->has('user.global')){
		    $request->session()->pull('user.global', '');
        }

        //Set the Session
       	$request->session()->put('user.global', $user);

        return true;
    }

	//Destroys all current stored sessions
    public static function destroyAllSessions(Request $request){
    	//Set the Session
    	$request->session()->flush();

    	return true;
    }
}