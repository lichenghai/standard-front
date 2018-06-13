/**=========================================================
 * Module: ResultController.js
 =========================================================*/

 App.controller('ResultController', ['$scope', '$http', '$rootScope', '$state', 
    function ($scope, $http, $rootScope, $state) {
        var loadResults = function () {
            $http.get($rootScope.url + '/standard-service/result/list').then(function (response) {
                if (response.data.status === 200) {
                    $scope.data = response.data.data;
                    console.log('list ok');
                } else {
                    $.notify(response.data.message, 'danger');
                }
            }, function (x) {
                $.notify('服务器出了点问题，我们正在处理', 'danger');
            });
        }
        //***需要替换为从后台获取的数据***
        // $scope.data = [
        // {
        //     id : "0",
        //     level : "0",
        //     indexName : "政治工作",
        //     standard_date : "2018-04-26",
        //     items :
        //     [
        //     {
        //         id : "1",
        //         department_id : "1",
        //         indexName: "学习",
        //         increase_name : "好好学习",
        //         increase_point : 2,
        //         increase_unit: "次",
        //         increase_num: 3,
        //         increase_detail: "听话",
        //         decrease_name : "没出操",
        //         decrease_point : 1,
        //         decrease_unit: "次",
        //         decrease_num: 2,
        //         decrease_detail: "不听话",
        //         total_point: 100,
        //         level : "1",
        //         father_id : "0",
        //     },
        //     {
        //         id : "1",
        //         department_id : "1",
        //         indexName: "学习",
        //         increase_name : "好好学习",
        //         increase_point : 2,
        //         increase_unit: "次",
        //         increase_num: 2,
        //         increase_detail: "听话",
        //         decrease_name : "没出操",
        //         decrease_point : 1,
        //         decrease_unit: "次",
        //         decrease_num: 1,
        //         decrease_detail: "不听话",
        //         total_point: 100,
        //         level : "1",
        //         father_id : "0",
        //     }
        //     ]

        // },
        // {
        //     id : "3",
        //     level : "0",
        //     indexName : "训练工作",
        //     items :
        //     [
        //     {
        //         id : "1",
        //         department_id : "1",
        //         indexName: "学习",
        //         increase_name : "好好学习",
        //         increase_point : 2,
        //         increase_unit: "次",
        //         increase_num: 3,
        //         increase_detail: "听话",
        //         decrease_name : "没出操",
        //         decrease_point : 1,
        //         decrease_unit: "次",
        //         decrease_num: 2,
        //         decrease_detail: "不听话",
        //         total_point: 80,
        //         level : "1",
        //         father_id : "0",
        //     },
        //     {
        //         id : "1",
        //         department_id : "1",
        //         indexName: "学习",
        //         increase_name : "好好学习",
        //         increase_point : 2,
        //         increase_unit: "次",
        //         increase_num: 3,
        //         increase_detail: "听话",
        //         decrease_name : "没出操",
        //         decrease_point : 1,
        //         decrease_unit: "次",
        //         decrease_num: 2,
        //         decrease_detail: "不听话",
        //         total_point: 50,
        //         level : "1",
        //         father_id : "0",
        //     }
        //     ]
        // }
        // ];



        $(window).resize(function () {
            var d = $('#container');
            d.height($(window).height() - d.offset().top);
        });
        $(window).resize();

        loadResults();
        
        $scope.back = function(){
            $state.go('app.evaluate');
        };
    }]);
