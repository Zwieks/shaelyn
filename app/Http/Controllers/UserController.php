<?php

namespace Shaelyn\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Cookie;
use Kreait\Firebase\Firebase;
use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;
use Kreait\Firebase\Database;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if($request->cookie('user') != ''){
            $serviceAccount = ServiceAccount::fromJsonFile(__DIR__.'/shaelyn-487ff-firebase-adminsdk-4cyxu-5ab0802ed5.json');

            $firebase = (new Factory)
                ->withServiceAccount($serviceAccount)
                ->create();

            $database = $firebase->getDatabase();

            $auth = $firebase->getAuth();

            $uid = Cookie::get('user');

            //Get the user info
            $user = $auth->Getuser($uid);

            return view('auth.home-loggedin')->with('user', $user);
        }
        else{
            return response(view('auth.home'))->cookie('user', '', 4500);
        }
    }

    private function getUserInfo ($auth, $uid) {
        $user = $auth->getUser($uid);

        return $user;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function loggedin(Request $request)
    {
        return view('auth.home-loggedin')
            ->with('user', $request->session()->get('user.global'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
