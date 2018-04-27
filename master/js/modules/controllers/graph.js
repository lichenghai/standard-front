/**=========================================================
 * Module: GraphController.js
 =========================================================*/

 App.controller('GraphController', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        var chartData = {
            labels: [],
            datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: []
            },
            ]
        };

        //***需要替换为从后台获取的数据***
        $scope.data = [
        {
            standard_date : "2018-04-24",
            total_point: 60,
        },
        {           
            standard_date : "2018-04-25",
            total_point: 100,
        },
        {
            standard_date : "2018-04-26",
            total_point: 80,
        },
        {           
            standard_date : "2018-04-27",
            total_point: 100,
        },
        {           
            standard_date : "2018-04-28",
            total_point: 70,
        },
        {           
            standard_date : "2018-04-29",
            total_point: 90,
        },
        ];

        $scope.data.forEach(function(data_i, index){
            chartData.labels.push(data_i.standard_date);
            chartData.datasets[0].data.push(data_i.total_point);
        });

        var chartOptions = {
            // ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines : true,

            // //String - Colour of the grid lines
            // scaleGridLineColor : "rgba(0,0,0,.05)",

            // //Number - Width of the grid lines
            // scaleGridLineWidth : 1,

            // //Boolean - Whether to show horizontal lines (except X axis)
            // scaleShowHorizontalLines: true,

            // //Boolean - Whether to show vertical lines (except Y axis)
            // scaleShowVerticalLines: true,

            // //Boolean - Whether the line is curved between points
            // bezierCurve : true,

            // //Number - Tension of the bezier curve between points
            // bezierCurveTension : 0.4,

            // //Boolean - Whether to show a dot for each point
            // pointDot : true,

            // //Number - Radius of each point dot in pixels
            // pointDotRadius : 4,

            // //Number - Pixel width of point dot stroke
            // pointDotStrokeWidth : 1,

            // //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
            // pointHitDetectionRadius : 20,

            // //Boolean - Whether to show a stroke for datasets
            // datasetStroke : true,

            // //Number - Pixel width of dataset stroke
            // datasetStrokeWidth : 2,

            // //Boolean - Whether to fill the dataset with a colour
            // datasetFill : true,

            // //String - A legend template
            // legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

        };
        // Get context with jQuery - using jQuery's .get() method.
        var ctx = $("#myChart").get(0).getContext("2d");
            // This will get the first returned node in the jQuery collection.
            var myNewChart = new Chart(ctx);
            myNewChart.Line(chartData, chartOptions);

            $scope.timeStart = '';
            $scope.timeEnd = '';
            $scope.opened = {
                start: false,
                end: false
            };
            $scope.open = function ($event, attr) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened[attr] = true;
            };
        }]);
