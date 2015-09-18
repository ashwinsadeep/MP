var Home = function () {

    Home.prototype.init = function () {
        $(document).ready(function () {
            onPageLoad();
        });
    };

    var onPageLoad = function () {
        registerClickListener();
        handleFormSubmit();
    };

    var registerClickListener = function () {
        $('.main-input').focus(function () {
            $('#hero-content').animate({height: 0}, 400, $.bez([.55, 0, .1, 1]));
        });
    };

    var handleFormSubmit = function () {
        $('#main-form').submit(function (e) {
            e.preventDefault();
            var symbol = $('#main-input').val();
            $.ajax({
                url        : '/api/v1/quote/intraday/' + symbol,
                type       : 'GET',
                contentType: false,
                cache      : false,
                processData: false,
                crossDomain: true,
                xhrFields  : {withCredentials: true},
                success    : function (data, textStatus, jqXHR) {
                    renderIntraDayForm(data);
                },
                error      : function (jqXHR, textStatus, errorThrown) {
                    alert('something went wrong.' + textStatus);
                }
            });

            $.ajax({
                url        : '/api/v1/quote/historic/' + symbol,
                type       : 'GET',
                contentType: false,
                cache      : false,
                processData: false,
                crossDomain: true,
                xhrFields  : {withCredentials: true},
                success    : function (data, textStatus, jqXHR) {
                    renderHistoricalChart(data);
                },
                error      : function (jqXHR, textStatus, errorThrown) {
                    alert('something went wrong.' + textStatus);
                }
            });
        });
    };

    var renderIntraDayForm = function (data) {
        var title = data.company_name + '(' + data.exchange_name + ')' + ' Intraday Stock Price';
        data = data.series.map(function (unitObj) {
            return {x: unitObj.ts * 1000, y: unitObj.close};
        });
        renderChart(data, title, $('#intraday-data-container'));
    };

    var renderHistoricalChart = function (data) {
        var title = data.company_name + '(' + data.exchange_name + ')' + ' Historic Stock Price';
        data = data.series.map(function (unitObj) {
            return {x: unitObj.ts * 1000, y: unitObj.close};
        });
        renderChart(data, title, $('#historic-data-container'));
    };

    var renderChart = function (data, title, container) {
        container.highcharts(
            'StockChart',
            {
                rangeSelector: {
                    selected: 1
                },
                credits      : {
                    enabled: false
                },
                title        : {
                    text: title
                },

                series: [{
                    name     : title,
                    data     : data,
                    type     : 'areaspline',
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
            }
        );
    }
};

var HOME = new Home();
HOME.init();