/**
 * @author: Ashwin
 * Main worker module which creates the express app and starts listening on the provided socket
 */
(function (module) {
    'use strict';

    var http = require('http');
    var fs = require('fs');
    var cluster = require('cluster');
    var express = require('express');
    var morgan = require('morgan');
    var expressDomainMiddleware = require('express-domain-middleware');
    var BootStrap = require('./controller/bootstrap');
    var JsonView = require('./views/json/jsonview');
    var bodyParser = require('body-parser');
    var config = require('../../config/zeus.json');
    var CustomError = require('../../common_modules/custom_errors');

    var PORT = config.port;
    var MAX_CONNECTIONS = config.max_connections;

    /**
     * The app constructor.
     * Creates an instance of express app & set's up all the middlewares, routers, and error handlers
     * @constructor
     */
    var Zeus = function () {
        var self = this;
        self._app = express();

        // Setup access logging
        var accessLogPath = config.log_directory + '/' + config.app_name + '_access.log';
        var accessLogStream = fs.createWriteStream(accessLogPath, {flags: 'a'});
        self._app.use(morgan(self._getAccessLogFormat(), {stream: accessLogStream}));

        // Setup template engine & view renderer
        self._app.set('views', __dirname + '/views/web');
        self._app.set('view engine', 'jade');

        self._app.use(expressDomainMiddleware); // domains middleware will attach a domain to each request
        self._app.use(bodyParser.json()); // read json input in post
        self._app.use(bodyParser.urlencoded({extended: true})); // read url encoded form data

        self._app.use('/static', express.static(__dirname + '/static_content')); // serve static files
        self._app.use('/bower', express.static(__dirname + '/bower_components')); // serve bower packages
        BootStrap.loadRoutingTable(self._app); // Load routers

        // Express error handler. Give the current context to our error handler so that it can
        // gracefully restart the current worker in case of any uncaught exceptions
        self._app.use(function (err, req, res, next) {
            self.onError(err, req, res, next, self);
        });
    };

    /**
     * Start the web server process.
     * In cluster configuration, this is a worker
     */
    Zeus.prototype.start = function () {
        try {
            this._server = this._app.listen(PORT);
            this._server.maxConnections = MAX_CONNECTIONS;
        } catch (e) {
            Logger.message('Something went wrong while starting app').setErrorInfo(e).critical();
        }
    };

    /**
     * Express error handler.
     * Since we are using express-domain-middleware, there'll be a domain attached to each request.
     * Errors in the same call stack & ones from async stacks will come to this handler.
     * In either cases, log it and send response to client.
     *
     * In case the error is from a domain (async callback threw an error),
     * we're killing the process to avoid going into an inconsistent state.
     *
     * @param err error object
     * @param req the request which triggered the error
     * @param res response object
     * @param next next middleware in stack
     * @param self reference to our app (context will be lost if this is triggered from outside current call stack boundary)
     */
    Zeus.prototype.onError = function (err, req, res, next, self) {
        var msg = err.message;
        var httpCode = 500;
        if (CustomError.isCustomError(err)) {
            msg = err.getMessage();
            // If not internal error, send http code as 200
            if (!(err instanceof CMErrors.InternalError)) {
                httpCode = 200;
            }
        }

        console.log(msg);
        try {
            res.status(httpCode).send(JsonView.factory().setError(err).render());
        } catch (e) {
            console.log('Error while sending error response');
        }

        if (err.domain) {
            self.stopGracefully();
        }
    };

    /**
     * Stop the app gracefully.
     * Stop accepting connections from clients, disconnect from cluster so that master can spawn a replacement, and let
     * the existing connections close.
     */
    Zeus.prototype.stopGracefully = function () {
        var self = this;
        // Stop accepting connections
        self._server.close(function (err) {
            process.exit(1);
        });
        // Disconnect from master. This will trigger an event in master.
        cluster.worker.disconnect();
    };

    /**
     * Get access log format as described @ https://github.com/expressjs/morgan
     * @returns {string}
     * @private
     */
    Zeus.prototype._getAccessLogFormat = function () {
        return ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'
    };

    module.exports = Zeus;

}(module));