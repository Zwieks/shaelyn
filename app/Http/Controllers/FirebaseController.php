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

        //Return the view
       	return view('auth.home');
    }
}
