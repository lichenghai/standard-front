/**=========================================================
 * Module: EvaluateController.js
 =========================================================*/

 App.controller('EvaluateController', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {

        $scope.data = [
        {
            id : "0",
            level : "0",
            index_name : "政治工作",
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

     $scope.operate = function(item, index, step){
        if (index === 0){
            var val = item.increase_num;
            item.increase_num = doPlus(val, step);
        }
        else if (index === 1){
            var val = item.decrease_num;
            item.decrease_num = doPlus(val, step);
        }
        if (isNaN(item.increase_num)){
            item.increase_num = 0;
        }
        if (isNaN(item.decrease_num)){
            item.decrease_num = 0;
        }
        item.total_point = item.increase_num * item.increase_point - item.decrease_num * item.decrease_point;
    };

    var doPlus = function(val, step){
        if (isNaN(val)){
            val = 0;
        }
        val = Math.abs(val);
        val = Math.floor(val);
        val += step;
        if (val < 0){
            val = 0;
        }
        return val;
    };

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

        $scope.person = {
            person_id : "0",
            username : "李成海",
            department_id : "0",
            department_name : "训练处"
        };

        $scope.submit = function(){
            var dataPost = {};
            dataPost.person = $scope.person;
            dataPost.result = [];
            $scope.data.forEach(function(data_i, index){
                data_i.items.forEach(function(item, index){
                    if (item.level==="0" || !isNaN(item.total_point)) {
                        dataPost.result.push(item);
                    }
                });
            });
            alert(dataPost.result[0].total_point);
        };

        $scope.reset = function(item){
            item.increase_num = "";
            item.increase_detail = "";
            item.decrease_num = "";
            item.decrease_detail = "";
            item.total_point = "";
        };
        $scope.resetAll = function(){
            $scope.data.forEach(function(data_i, index){
                data_i.items.forEach(function(item){
                    $scope.reset(item);
                });
            });
        };

        //把日期格式2018/04/20替换为2018-04-20
        $scope.timeStart = (new Date()).toLocaleDateString().replace(/\//g,'-');
        $scope.timeEnd = '';
        $scope.opened = {
            start: false,
            end: false
        };
        $scope.dateOptions = {
            datepickerMode: 'year',
            formatYear: 'yyyy',
            startingDay: 1,
            formatDayTitle: 'yyyy年M月',
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

    }]);
