<?php

namespace Shaelyn\Http\Controllers;
use Kreait\Firebase\Firebase;
use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;
use Kreait\Firebase\Database;

use Illuminate\Http\Request;
use Shaelyn\Sessions;

class FirebaseController extends Controller
{
    public function index(Request $request, $uid) {
   		$serviceAccount = ServiceAccount::fromJsonFile(__DIR__.'/shaelyn-487ff-firebase-adminsdk-4cyxu-819c761ef1.json');

		$firebase = (new Factory)
	    	->withServiceAccount($serviceAccount)
	    	->create();

        $database = $firebase->getDatabase();

        $auth = $firebase->getAuth();

        //Get the user info
        $user = $this->getUserInfo($auth, $uid);

	    //Check if the user is already loggedin and the session has been set
	    if (!$request->session()->has('user.global')) {
	        //Set User Data Session
	        Sessions::setGlobalUserSession($request, $user);
	        return response()->json(array('success' => true));
	    }else {
	    	//Destroy session
	    	$request->session()->forget('user.global');
	    }
    }

    /**
     * Returning a list of user info.
     *
     * @return \Illuminate\Http\Response
     */
    private function getUserInfo ($auth, $uid) {
    	$user = $auth->getUser($uid);

    	return $user;
    }
}
