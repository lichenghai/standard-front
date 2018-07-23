/**=========================================================
 * Module: SearchController.js
 =========================================================*/

 App.controller('SearchController', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {

        $rootScope.IncreaseTypeList = [{
            key: 0,
            value:"全部"
        },
        {
            key:1,
            value: "仅显示扣分"
        },
        {
            key:2,
            value: "仅显示得分"
        }
        ];

        $rootScope.CommentTypeList = [{
            key: 0,
            value:"全部"
        },
        {
            key:1,
            value: "仅显示含评语结果"
        },
        {
            key:2,
            value: "仅显示无评语结果"
        }
        ];

        $scope.timeStart = moment().subtract(7, 'days').format('YYYY-MM-DD')
        $scope.timeEnd = moment().format('YYYY-MM-DD');
        // $scope.timeStart = '';
        // $scope.timeEnd = '';
        //默认为最近一周的成绩
        $scope.search = {
            increaseType: 0,
            commentType: 0,
            timeStart: '',
            timeEnd: '',
            page: 1,
            size: 10,
            personId: $rootScope.account.id
        };

        $scope.opened = {
            start: false,
            end: false
        };

        var buildParam = function () {
            var param = {
                method: 'GET',
                url:$rootScope.url+'/standard-service/result/search',
                params: $scope.search
            };
            return param;
        };
        $scope.loadData = function () {
            if (!!$scope.timeStart) {
                var date = new Date($scope.timeStart);
                $scope.search.timeStart=date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 00:00:00';

                  //  $scope.search.timeStart = $scope.timeStart + ' 00:00:00';
              }

              if (!!$scope.timeEnd) {
                var date = new Date($scope.timeEnd);
                $scope.search.timeEnd=date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 23:59:59' ;

               // $scope.search.timeEnd = $scope.timeEnd + ' 23:59:59';
           }
           $http(buildParam())
           .then(function (response) {
            if (response.data.status === 200) {
                $scope.items = response.data.data.list;
                $scope.totalItems = response.data.data.total;

                } else {
                    $.notify(response.data.message, 'danger');
                }
            }, function (x) {
                $.notify('服务器出了点问题，我们正在处理', 'danger');
            });
       };

        $scope.dateOptions = {
            datepickerMode: 'year',
            formatYear: 'yyyy',
            startingDay: 1,
            formatDayTitle: 'yyyy年M月'
        };

        $scope.open = function ($event, attr) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened[attr] = true;
        };

        $(window).resize(function () {
            var d = $('#container');
            d.height($(window).height() - d.offset().top);
        });
        $(window).resize();

        $scope.loadData();
    }]);
