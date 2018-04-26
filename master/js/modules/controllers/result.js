/**=========================================================
 * Module: ResultController.js
 =========================================================*/

 App.controller('ResultController', ['$scope', '$http', '$rootScope', '$state', 
    function ($scope, $http, $rootScope, $state) {

        //***需要替换为从后台获取的数据***
        $scope.data = [
        {
            id : "0",
            level : "0",
            index_name : "政治工作",
            standard_date : "2018-04-26",
            items :
            [
            {
                id : "1",
                department_id : "1",
                index_name: "学习",
                increase_name : "好好学习",
                increase_point : 2,
                increase_unit: "次",
                decrease_name : "没出操",
                decrease_point : 1,
                decrease_unit: "次",
                level : "1",
                father_id : "0",
            },
            {
                id : "2",
                department_id : "1",
                index_name: "党务",
                increase_name : "好好学习",
                increase_point : 2,
                increase_unit: "次",
                decrease_name : "没出操",
                decrease_point : 1,
                decrease_unit: "次",
                level : "1",
                father_id : "0",
            }
            ]

        },
        {
            id : "3",
            level : "0",
            index_name : "训练工作",
            items :
            [
            {
                id : "4",
                department_id : "1",
                index_name: "党务",
                increase_name : "好好学习",
                increase_point : 2,
                increase_unit: "次",
                decrease_name : "没出操",
                decrease_point : 1,
                decrease_unit: "次",
                level : "1",
                father_id : "3",
            },
            {
             id : "5",
             department_id : "1",
             index_name: "党务",
             increase_name : "好好学习",
             increase_point : 2,
             increase_unit: "次",
             decrease_name : "没出操",
             decrease_point : 1,
             decrease_unit: "次",
             level : "1",
             father_id : "3",
         }
         ]
     }
     ];

    var
    buildParam = function (url) {
        var param = {
            method: 'GET',
            url: url,
            params: $scope.search
        };
        return param;
    },
    loadData = function (url) {
            // $http(buildParam(url))
            //     .then(function (response) {
            //         if (response.data.status === 200) {
            //             $scope.data = response.data.data.list;
            //         } else {
            //             $.notify(response.data.message, 'danger');
            //         }
            //     }, function (x) {
            //         $.notify('服务器出了点问题，我们正在处理', 'danger');
            //     });
        };



        $(window).resize(function () {
            var d = $('#container');
            d.height($(window).height() - d.offset().top);
        });
        $(window).resize();

    }]);
