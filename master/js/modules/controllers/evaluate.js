/**=========================================================
 * Module: EvaluateController.js
 =========================================================*/

 App.controller('EvaluateController', ['$scope', '$http', '$rootScope', '$state', 
    function ($scope, $http, $rootScope, $state) {

        //***需要替换为从后台获取的数据***
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

    //***需要替换为从后台获取的数据***
    $rootScope.person = {
        person_id : 0,
        username : "李成海",
        department_id : 0,
        department_name : "训练处"
    };

    $scope.totalPoints = 0;

    $scope.operate = function(item, index, step){
        if (index === 0){
            var val = item.increase_num;
            item.increase_num = doPlus(val, step);
        }
        else if (index === 1){
            var val = item.decrease_num;
            item.decrease_num = doPlus(val, step);
        }
        if (isNaN(item.increase_num) || item.increase_num===""){
            item.increase_num = 0;
        }
        if (isNaN(item.decrease_num) || item.decrease_num===""){
            item.decrease_num = 0;
        }
        if (!isNaN(item.total_point)){
            $scope.totalPoints -= item.total_point; 
        }
        item.total_point = item.increase_num * item.increase_point - item.decrease_num * item.decrease_point;
        $scope.totalPoints += item.total_point;
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

        

        $scope.submit = function(){

            var dataPost = {};

            //所有条目都相同的部分
            //读$rootScope
            dataPost.person_id = $rootScope.person.person_id;
            dataPost.department_id = $rootScope.person.department_id;
            dataPost.department_name = $rootScope.person.department_name;
            //下面都是读$scope
            dataPost.standard_date = $scope.datePicked;
            dataPost.submit_time = (new Date()).toLocaleTimeString();

            var postFlag = false;

            //每个条目不同的部分
            //对于每个大项
            $scope.data.forEach(function(data_i, index){
                var hasValue = false;
                //对于每个小条目
                data_i.items.forEach(function(item, index){
                    //对于总分是有效数字的条目
                    if (!isNaN(item.total_point) && item.total_point!==""){
                        //***需要服务端提供***
                        var father_id = 0;
                        
                        //如果大项还没加入过，先提交大项条目，获取father_id
                        if (!hasValue){
                            dataPost.index_name = data_i.index_name;
                            dataPost.level = data_i.level;
                            // $http.post('/url', dataPost).then(function (response) {
                            //     if (response.data.status === 200) {
                            //         father_id = response.data.data;
                            //     } else {
                            //         $.notify(response.data.message, 'danger');
                            //     }
                            // }, function (x) {
                            //     $.notify('服务器出了点问题，我们正在处理', 'danger');
                            // });
                            hasValue = true;
                            postFlag = true;
                        }

                        //提交该小条目
                        dataPost.index_name = item.index_name;
                        dataPost.increase_name = item.increase_name;
                        dataPost.increase_num = item.increase_num;
                        dataPost.increase_point = item.increase_point;
                        dataPost.increase_unit = item.increase_unit;
                        dataPost.increase_detail = item.increase_detail;
                        dataPost.decrease_name = item.decrease_name;
                        dataPost.decrease_num = item.decrease_num;
                        dataPost.decrease_podet = item.decrease_podet;
                        dataPost.decrease_unit = item.decrease_unit;
                        dataPost.decrease_detail = item.decrease_detail;
                        dataPost.total_point = item.total_point;
                        dataPost.level = item.level;
                        dataPost.father_id = father_id;
                        
                        // $http.post('/url', dataPost).then(function (response) {
                            //     if (response.data.status === 200) {
                            //         
                            //     } else {
                            //         $.notify(response.data.message, 'danger');
                            //           break;
                            //     }
                            // }, function (x) {
                            //     $.notify('服务器出了点问题，我们正在处理', 'danger');
                            //     break;
                            // });
                            alert(dataPost.total_point + dataPost.submit_time);
                        }

                    });
            });
            if (postFlag){
                $state.go('app.result');
            }
            else{
                $.notify('填写内容为空', 'danger');
            }
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
        $scope.datePicked = (new Date()).toLocaleDateString().replace(/\//g,'-');
        //页面载入时日历是否自动打开
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
