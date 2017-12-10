;(function($, window, document) {

    'use strict';

    var pluginName          = 'analyticsTracker',
        defaults            = {},
        external_selector   = '.externallink',
        form_selector       = '.webbeheer-formulier',
        phone_selector      = '[href^="tel:"]',
        lightbox_selector   = '[rel*=lightbox]',
        download_selector   = '.js-download-item',
        social_selector     = '#js-social-share',
        mailingsubscription = '.comp-mailinglistsubscription form';

    var GATracker, KATracker;

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function() {
            this.initTrackers();

            if (typeof GATracker === 'undefined' && typeof KATracker === 'undefined') {
                return;
            }

            this.bindTrackingEvents();
        },

        initTrackers: function() {
            // Google Analytics Legacy
            if (typeof _gaq !== 'undefined' && typeof _gaq.push === 'function') {
                GATracker = '_gaq';
            }
            // Google Analytics
            if (typeof ga === 'function') {
                GATracker = 'ga';
            }
            // Kirra Analytics
            if (typeof _kaq !== 'undefined' && typeof _kaq.push === 'function') {
                KATracker = '_kaq';
            }
            // Kirra Analytics
            if (typeof window.trackEvent === 'function') {
                KATracker = 'trackEvent';
            }

            $.scrollDepth();
        },

        bindTrackingEvents: function() {
            var self = this;

            // Measure external links
            $(external_selector).on('click', function() {
                // Catch if it is not a social link or a download link
                if ($(this).parents(social_selector).length == 0 && !$(this).hasClass(download_selector)) {
                    var external_url = $(this)[0].host;
                    self.trackEvent('Uitgaande link', 'Klik', external_url);
                }
            });


            // Measure sent forms in Kirra Analytics
            $(form_selector).on('submit', function() {
                // TODO Codeur End: Check if the title is still in the legend
                var form_title = $(this).find('legend').text();
                self.trackEvent('Verzonden formulier', 'Submit', form_title);
            });


            // Measure phone number anchors with Kirra Analytics
            $(phone_selector).on('click', function() {
                var phone_number = $(this).attr('href').replace('tel":', '');
                self.trackEvent('Telefoonnummer', 'Klik', phone_number);
            });


            // Openen van een lightbox foto
            $(lightbox_selector).on('click', function() {
                var lightbox_title = $(this).find('img').attr('alt');
                self.trackEvent('Photos', 'Open', lightbox_title);
            });


            // Downloads
            $(download_selector).on('click', function() {
                var download_title = $(this).text();
                self.trackEvent('Download', 'Klik', download_title);
            });


            // Social share buttons
            $(social_selector).find('a').on('click', function() {
                // TODO Codeur End: Check if the social_title is still in the title attribute
                var social_title = $(this).attr('title');
                self.trackEvent('Social media', 'Share', social_title);
            });


            // Measure sent forms in Kirra Analytics
            $(mailingsubscription).on('submit', function() {
                // TODO Codeur End: Check if the mailing_title is still in the legend
                var mailing_title = $(this).find('legend').text();
                self.trackEvent('Inschrijven nieuwsbrief', 'Submit', mailing_title);
            });
        },

        // NOTE: For more informatei see: https://developers.google.com/analytics/devguides/collection/analyticsjs/events

        trackEvent: function(category, action, opt_label, opt_value, opt_noninteraction) {
            // Google Analytics Legacy
            if (GATracker === '_gaq') {
                _gaq.push(['_trackEvent', category, action, opt_label, opt_value, opt_noninteraction]);
            }
            // Google Analytics
            if (GATracker === 'ga') {
                ga('send', 'event', category, action, opt_label, opt_value, opt_noninteraction);
            }
            // Kirra Analytics
            if (KATracker === '_kaq') {
                _kaq.push(['_trackEvent', category, action, opt_label, opt_value, opt_noninteraction]);
            }
            // Kirra Analytics
            if (KATracker === 'trackEvent') {
                window.trackEvent(category, action, opt_label, opt_value, opt_noninteraction);
            }
        }
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);