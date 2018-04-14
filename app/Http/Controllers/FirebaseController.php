<?php

namespace Shaelyn\Http\Controllers;
use Kreait\Firebase\Firebase;
use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;
use Kreait\Firebase\Database;

use Illuminate\Http\Request;

class FirebaseController extends Controller
{
    public function index() {
   		$serviceAccount = ServiceAccount::fromJsonFile(__DIR__.'/shaelyn-487ff-firebase-adminsdk-4cyxu-819c761ef1.json');

		$firebase = (new Factory)
	    	->withServiceAccount($serviceAccount)
	    	->create();

        $database = $firebase->getDatabase();

        $auth = $firebase->getAuth();

        //Get the user info
        $user = $this->getUserInfo($auth, 'Nkeiwvy8cGYrQG6v9YTUAf9f2gE3');
        
        //Return the view
       	return view('auth.home');
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
