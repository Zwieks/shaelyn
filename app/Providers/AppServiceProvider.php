<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        view()->composer('*', function($view){
            $view_array = explode('.', $view->getName());
            /* Current template name */
            if(isset($view_array[1])){
                $type = $view_array[1];
            }else{
                $type = $view_array[0];
            }
            /* Browser Locale */
            $locale = App()->getLocale();

            /* Set debug path */
            $debugpath = 'resources/views/'.str_replace('.', '/', $view->getName()).'.blade.php';
            $view->with(compact('type', 'locale', 'debugpath', 'globals'));
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
