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

         //默认查看最近30天的成绩
         $scope.timeStart = moment().subtract(30, 'days').format('YYYY-MM-DD');
         $scope.timeEnd = moment().format('YYYY-MM-DD');
         $scope.search = {
            timeStart: $scope.timeStart,
            timeEnd: $scope.timeEnd,
            personId: $rootScope.account.id,
        };

        var chartOptions = {
            // ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,

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
        var myNewChart = new Chart(ctx).Line(chartData, chartOptions);

        var buildParam = function () {
            var param = {
                method: 'GET',
                url: $rootScope.url + '/standard-service/statics/search', //查找其下属人员的成绩
                params: $scope.search
            };
            return param;
        }; 

        var loadRelations = function () {
            $http.get($rootScope.url + '/account-service/relations/list?personId=' + $rootScope.account.id)
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.relations = response.data.data;
                    $scope.search.departmentId = $scope.relations[0].departmentId;
                    $scope.loadData();
                } else {
                    $.notify(response.data.message, 'danger');
                }
            }, function (x) {
                $.notify('服务器出了点问题，我们正在处理', 'danger');
            });
        }

        $scope.loadData = function () {
            if (!!$scope.timeStart) {
                var date = new Date($scope.timeStart);
                $scope.search.timeStart = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 00:00:00';
            }

            if (!!$scope.timeEnd) {
                var date = new Date($scope.timeEnd);
                $scope.search.timeEnd = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 23:59:59';
            }

            $http(buildParam())
            .then(function (response) {
                if (response.data.status === 200) {

                    //清空之前的
                    chartData.labels = [];
                    chartData.datasets[0].data = [];         

                    $scope.data = response.data.data;   

                    //填写人名标签
                    chartData.datasets[0].label = $rootScope.account.username;

                    //填写数据集
                    $scope.data.forEach(function (data_i) {
                        chartData.labels.push(moment(data_i.recordDate).format('YYYY-MM-DD'));
                        chartData.datasets[0].data.push(data_i.score);
                    });
                    console.log("chartData:"+JSON.stringify(chartData));
                            // myNewChart.Line(chartData, chartOptions);
                    // myNewChart.clear();
                    //先移除原先画布，再重画，否则会出现重叠。
                    $('#myChart').remove();
                    $('#container').append('<canvas id="myChart" style="width:1000px"></canvas>');
                    ctx = $("#myChart").get(0).getContext("2d");
                    myNewChart = new Chart(ctx).Line(chartData, chartOptions);
                } 
                else {
                            $.notify(response.data.message, 'danger');
                        }
                    }, function (x) {
                        $.notify('服务器出了点问题，我们正在处理', 'danger');
                    });
        };            

        $scope.opened = {
            start: false,
            end: false
        };

        $scope.open = function ($event, attr) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened[attr] = true;
        };

        loadRelations();
    }]);

