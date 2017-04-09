(function (module) {

    var React = require('react');
    var ReactDOM = require('react-dom');
    var Graph = require('./graph');
    var SearchBox = require('./searchbox');
    var $ = require('jquery');

    require("react-tap-event-plugin")();

    var Home = function () {};

    Home.init = function () {
        $(document).ready(function () {
            ReactDOM.render(React.createElement(
                'form',
                { id: 'main-form' },
                React.createElement(SearchBox, null)
            ), document.getElementById('search-box'));
            handleFormSubmit();
        });
    };

    var handleFormSubmit = function () {
        $('#main-form').submit(function (e) {
            e.preventDefault();

            var symbol = $('#main-input').val();
            if (symbol.split('|').length !== 2) {
                alert('invalid input');
                return;
            }

            symbol = symbol.split('|')[1].trim();
            ReactDOM.render(React.createElement(Graph, {
                symbol: symbol }), document.getElementById('historic-data-container'));
        });
    };

    module.exports = Home;
})(module);