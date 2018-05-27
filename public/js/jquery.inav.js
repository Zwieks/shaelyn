/*
 *
 ******
 *
 *	Authors:	        Rudolf Bos (r.bos@iwink.nl)
 *                      Phung Nguyen (p.nguyen@iwink.nl)
 *                      Sjoerd Adema (s.adema@iwink.nl)
 *
 *  ******
 *
 *	Version:		1.4.0 (14/03/2016)
 *	Log:			- Nav trigger made with label and checkbox
 *	                - Subnav trigger made with label and checkbox
 *
 ******
 *
 *	Version:		1.3.1 (25/11/2015)
 *	Log:			- Option added to disable body scrolling
 *
 ******
 *
 *	Version:		1.3.0 (07/08/2015)
 *	Log:			- Breakpoint is now set with Javascript
 *					- Option added to auto recognize breakpoint for responsive navigation
 *					- Code rewritten in better plugin format (Sjoerd)
 *					- Minor CSS transition fixes
 *
 ******
 *
 *	Version:		1.2.0 (15/07/2015)
 *	Log:			- Swipe functionality removed
 * 					- Options added to open menu from left, right, top or with overlay
 * 					- Minor updates in Javascript efficiency and naming
 * 					- Site overlay (for closing) is set in <span class="navcloser"> in stead of a :before and now covers entire site
 *
 ******
 *
 *	Version:		1.1.1 (14/07/2015)
 *	Log:			- Minor optimizations in code
 * 					- Used variables in this plugin are now placed in jquery.acties.js for usage in entire Javascript scope
 */

;(function($) {

	// Some variables
	var iNavTimer;

	var iNav = function(elem, options) {
		this.options 		= options;
		this.clickCounter 	= 0;
		this.settings 		= {};
	};

	iNav.prototype = {
		defaults: {
			navTrigger: 		'#js-nav-trigger', // The hamburger checbox trigger
			navOpener: 			'#js-nav-toggle', // The hamburger button
			navCloser: 			'#js-nav-closer', // The overlay to close the navigation
			navWrapper: 		'#js-nav-wrapper', // The container that holds al the navigation elements
			mainNavigation: 	'#js-mainmenu', // Primairy navigation
			loggedin:           '#js-loggedin',
			navContainers: 	    [] // Array of elements that are pushed in the responsive navigation
		},

		init: function() {
			var settings = this.settings = $.extend({}, this.defaults, this.options),
				self = this;

			if (!settings.navContainers.length) {
				settings.navContainers.push($(settings.mainNavigation));
			}

			// Move all menu's to the mobile navigation container
			if( settings.navWrapper ){
				if(!$(settings.loggedin).length) {
					$.each(settings.navContainers, function() {
						$(settings.navWrapper).append($(this).html());
					});
				}
			}

			// Handle desktop menu submenu functionalities on touch-devices
			if( $(settings.navOpener).find('.subnav').length ) {
				$(this.settings.mainNavigation).on('touchstart', '.subnav > a', function(e){
					if( $(settings.navOpener).is(':hidden') ){
						if( self.clickCounter == 0 ){
							// Catch first click and open dropdown menu
							self.clickCounter ++;
							$(this).parent('li').addClass('hover');
							e.preventDefault();
						} else if ( $(this).parent('li').hasClass('hover') ) {
							// Go to the link on second click
							window.location.href = $(this).attr('href');
							$(this).parent('li').removeClass('hover');
						} else {
							// Reset
							self.clickCounter = 0;
							e.preventDefault();
							$(this).find('.subnav').removeClass('hover');
						}
					}
				});
			}

			// Open responsive sub navigation
			$('.js-open-subnav').on('click', function(e) {
				e.preventDefault();
				$(this).prev('ul').toggleClass('open').parent().siblings().children('ul').removeClass('open');

				// Close lower levels
				$(this).prev('ul').find('ul').removeClass('open');
			});

			// Open active resonsive sub navigation
			$(settings.navWrapper).find('ul > .active > ul').addClass('open');

			// Close nav with escape button
			$(document).on('keydown', function(e){
				if( e.keyCode === 27 ) {
					self.clearNav();
				}
			});

			//If the user is loggedin the menu have to show
			if($(settings.loggedin).length) {

				if (document.documentElement.clientWidth < 1250) {
					self.clearNav();
				}else {
					$(this.settings.navTrigger).prop('checked', true);
				}

				if (document.documentElement.clientWidth < 640) {
					$('.dashboard-wrapper').addClass('owl-carousel');

					$(".page-website-wrapper").on('click', function(){
						if($(settings.navWrapper).length) {
							self.clearNav();
						}
					});				
				}else {
					$('.dashboard-wrapper').removeClass('owl-carousel');
				}

				window.onresize = function(event,settings) {
					if (document.documentElement.clientWidth < 1250) {
						// scripts
						self.clearNav();
					}
				};

			}

			// Close nav on click / touch outside the responsive menu
			$(settings.navCloser).on('click', function(){

					self.clearNav();
					
			});

			// resetNav on resize (or orientationchange for touch devices)
			window.addEventListener('resize', function() {
				clearTimeout(iNavTimer);
				iNavTimer = setTimeout(function(){
					self.resetNav();
				}, 100);
			}, false);
		},

		clearNav: function() {
			$(this.settings.navTrigger).prop('checked', false);
		},

		resetNav: function() {
			if( $(this.settings.navOpener).is(':hidden') ) {
				this.clearNav();
			}
		}
	};


	// Initialize plugin
	iNav.defaults = iNav.prototype.defaults;
	$.fn.iNav = function(options) {
		return this.each(function() {
			new iNav(this, options).init();
		});
	}
	$.fn.clearNav = function() {
		$('#js-nav-trigger').prop('checked', false);
	};

})(jQuery);