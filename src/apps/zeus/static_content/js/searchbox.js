(function (module) {

    var React = require('react');
    var ListItem = require('material-ui/lib/lists/list-item');
    var ListDivider = require('material-ui/lib/lists/list-divider');
    var MarketPulseApi = require('../js/marketpulseapi');
    var AutoSuggest = require('react-autosuggest');
    var _ = require('underscore');
    var async = require('async');

    module.exports = React.createClass({
        displayName: 'exports',

        getInitialState: function () {
            return { value: '', suggestions: [] };
        },
        render() {
            return React.createElement(
                'div',
                { className: 'section' },
                React.createElement(AutoSuggest, {
                    suggestions: this.state.suggestions,
                    onSuggestionsUpdateRequested: _.debounce(getSuggestions.bind(this), 500),
                    getSuggestionValue: renderValue,
                    renderSuggestion: renderSuggestion,
                    inputProps: getInputProps.call(this),
                    theme: getTheme()
                })
            );
        }
    });

    var getTheme = function () {
        return {
            container: 'search-container',
            input: 'search-input',
            suggestionsContainer: 'list-group suggestions-container',
            suggestion: 'list-group-item suggestion',
            suggestionFocused: 'suggestion-focussed'
        };
    };

    var getInputProps = function () {
        var self = this;
        return {
            value: self.state.value,
            onChange: function (event, changeObj) {
                self.setState({ value: changeObj.newValue });
            },
            type: 'search',
            placeholder: 'Stock name',
            id: 'main-input'
        };
    };

    /**
     * Get auto complete suggestions from server
     * @param query - the search string
     */
    var getSuggestions = function (query) {
        if (query.reason == 'click') return;
        query = query.value;
        var self = this;
        var mpApi = new MarketPulseApi();
        showLoadingIndicator.call(self);
        mpApi.getSearchSuggestions(query, function (err, data) {
            hideLoadingIndicator.call(self);
            if (err) {
                return callback(err);
            }

            self.setState({ suggestions: data });
        });
    };

    var renderValue = function (suggestion) {
        return suggestion.name;
    };

    var renderSuggestion = function (suggestion) {
        return suggestion.name;
    };

    var showLoadingIndicator = function () {
        this.setState({ suggestions: [{ name: 'Loading...' }] });
    };

    var hideLoadingIndicator = function () {
        this.setState({ suggestions: [] });
    };
})(module);