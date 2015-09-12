/**
 * A simple wrapper which can be invoked directly from shell which will start the server using methods in app.js
 * @author: Ashwin
 */
(function () {
    'use strict';

    var Server = function () {
        var config = require('../../config/zeus.json');
        var App = require('./zeus');
        var APP_NAME = config.app_name;
        var CustomErrors = require('../../common_modules/custom_errors');

        /**
         * Worker processes which is running the actual web server.
         * This is where you put you can code your bugs :)
         */
        Server.prototype.start = function () {
            /**
             * Worker level uncaught exception handler in case something is really wrong in the app.
             * All requests are already in a domain. So if gets to this, something is really wrong.
             */
            process.on('uncaughtException', function (err) {
                var msg = err.message;
                if (CustomErrors.isCustomError(err)) {
                    msg = err.getMessage();
                }

                console.log('uncaught exception - ' + msg);
                process.exit(1);
            });

            var self = this;
            process.title = 'w-' + APP_NAME;
            self.app = new App();
            self.app.start();
        };
    };

    var server = new Server();
    server.start();

}());
