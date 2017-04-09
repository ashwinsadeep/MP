(function (module) {

    var React          = require('react');
    var HighStock      = require('react-highcharts/bundle/highstock');
    var MarketPulseApi = require('../js/marketpulseapi');

    module.exports = React.createClass({
        render           : function () {
            if (!this.state.status) {
                return (<h1>Loading</h1>);
            }

            return <HighStock config={this.state.config}/>;
        },
        getInitialState  : function () {
            return {
                status: false
            };
        },
        setData          : function (data) {
            this.setState(getStateFromServerResponse(data))
        },
        componentDidMount: function () {
            var self  = this;
            var mpApi = new MarketPulseApi();
            mpApi.getHistoricData(this.props.symbol, function (err, data) {
                if (err) {
                    alert('something went wrnog');
                    return;
                }

                self.setData(data);
            });
        }
    });

    var getStateFromServerResponse = function (data) {
        var title  = data.company_name + '(' + data.exchange_name + ')' + ' Historic Stock Price';
        data       = data.series.map(function (unitObj) {
            return {x: unitObj.ts * 1000, y: unitObj.close};
        });
        var config = {
            credits      : {
                enabled: false
            },
            title        : {
                text: title
            },
            rangeSelector: {
                inputEnabled: false,
                selected    : 1
            },
            series       : [{
                name     : title,
                data     : data,
                type     : 'spline',
                threshold: null,
                tooltip  : {
                    valueDecimals: 2
                },
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops         : [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                }
            }]
        };

        return {status: true, config: config};
    };

}(module));
