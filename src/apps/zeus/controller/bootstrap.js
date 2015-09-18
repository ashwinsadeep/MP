/**
 * @author: Ashwin
 * Bootstrap module which is in charge of handling the routing for different API versions
 */
(function (module) {
    'use strict';

    var enrouten = require('express-enrouten');
    var ViewJson = require('../views/json/jsonview');

    var SUPPORTED_VERSIONS = '/v1';
    var PUBLIC_PREFIX = '/api';

    var BootStrap = function () {
    };

    BootStrap.loadRoutingTable = function (express_app) {
        var self = this;
        self._app = express_app;

        // Web endpoints
        self._app.use('/', enrouten({
            directory: './web/vcommon'
        }));

        // PUBLIC ENDPOINTS
        // Load handlers for older versions from the corresponding directories
        self._app.use(PUBLIC_PREFIX, enrouten({
            directory: './api/'
        }));

        // Load default handlers for all versions from vcommon
        self._app.use(PUBLIC_PREFIX + SUPPORTED_VERSIONS, enrouten({
            directory: './api/vcommon'
        }));

        // elb health check endpoint
        self._app.use('/elb/health', function (req, res, next) {
            res.sendStatus(200);
        });

        // 404 handler
        self._app.use('*', function (req, res, next) {
            res.status(404).send(ViewJson.factory().setErrorCode(404).render());
        });
    };

    module.exports = BootStrap;

}(module));