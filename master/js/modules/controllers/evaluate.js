/**=========================================================
 * Module: EvaluateController.js
 =========================================================*/

App.controller('EvaluateController', ['$scope', '$http', '$rootScope', '$state',
    function ($scope, $http, $rootScope, $state) {
        var loadRelations = function () {
            $http.get($rootScope.url + '/account-service/relations/list?personId=' + $rootScope.account.id)
                .then(function (response) {
                    if (response.data.status === 200) {
                        $scope.relations = response.data.data;
                        $scope.department = $scope.relations[0];
                        loadIndex();
                    } else {
                        $.notify(response.data.message, 'danger');
                    }
                }, function (x) {
                    $.notify('服务器出了点问题，我们正在处理', 'danger');
                });
        }
        var loadIndex = function () {
            $scope.checkSubmition();
            $http.get($rootScope.url + '/standard-service/detail/list?departmentId=' + $scope.department.departmentId + '&level=0')
                .then(function (response) {
                    if (response.data.status === 200) {
                        $scope.data = response.data.data;
                        $scope.data.forEach(function (item) {
                            $http.get($rootScope.url + '/standard-service/detail/list?fatherId=' + item.id + '&level=1')
                                .then(function (response) {
                                    if (response.data.status === 200) {
                                        item['items'] = response.data.data;
                                         $('#nav').onePageNav();
                                    } else {
                                        $.notify(response.data.message, 'danger');
                                    }
                                }, function (x) {
                                    $.notify('服务器出了点问题，我们正在处理', 'danger');
                                });
                        })
                    } else {
                        $.notify(response.data.message, 'danger');
                    }
                }, function (x) {
                    $.notify('服务器出了点问题，我们正在处理', 'danger');
                });
        }

        $scope.changeDepartment = loadIndex;
        $scope.submitted = false;
        $scope.totalPoints = 0;

        $scope.operate = function (item, index, step) {
            if (index === 0) {
                var val = item.increaseNum;
                item.increaseNum = doPlus(val, step);
            }
            else if (index === 1) {
                var val = item.decreaseNum;
                item.decreaseNum = doPlus(val, step);
            }
            if (isNaN(item.increaseNum) || item.increaseNum === "") {
                item.increaseNum = 0;
            }
            if (isNaN(item.decreaseNum) || item.decreaseNum === "") {
                item.decreaseNum = 0;
            }
            if (!isNaN(item.totalPoint)) {
                $scope.totalPoints -= item.totalPoint;
            }
            item.totalPoint = item.increaseNum * item.increasePoint - item.decreaseNum * item.decreasePoint;
            $scope.totalPoints += item.totalPoint;
        };

        var doPlus = function (val, step) {
            if (isNaN(val)) {
                val = 0;
            }
            val = Math.abs(val);
            val = Math.floor(val);
            val += step;
            if (val < 0) {
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
        $scope.submit = function () {
            var postData = [];
            var submitTime = moment().format('YYYY-MM-DD HH:mm:ss');
            var standardDate = moment($scope.datePicked).format('YYYY-MM-DD');
            $scope.data.forEach(function (data_i, index0, array0) {
                //先判断大条目下是否有有效内容，没有的话就不提交
                var hasValue = false;
                data_i.items.forEach(function (item) {
                    if (!isNaN(item.totalPoint) && item.totalPoint !== "") {
                        hasValue = true;
                        // break;
                    }
                });
                if (hasValue){
                    var data0 = {};
                    data0['personId'] = $rootScope.account.id;
                    data0['departmentId'] = $scope.department.departmentId;
                    data0['departmentName'] = $scope.department.departmentName;
                    data0['indexName'] = data_i.indexName;
                    data0['level'] = 0;
                    data0['fatherId'] = 0;
                    data0['standardDate'] = standardDate;
                    data0['submitTime'] = submitTime;
                    postData.push(data0);

                    data_i.items.forEach(function (item, index1, array1) {
                        if (!isNaN(item.totalPoint) && item.totalPoint !== "") {
                            var data1 = {};
                            data1['indexName'] = item.indexName;
                            data1['departmentId'] = $scope.department.departmentId;
                            data1['departmentName'] = $scope.department.departmentName;
                            data1['personId'] = $rootScope.account.id;

                            data1['increaseName'] = item.increaseName;
                            data1['increasePoint'] = item.increasePoint;
                            data1['increaseUnit'] = item.increaseUnit;
                            data1['increaseNum'] = item.increaseNum;
                            data1['increaseDetail'] = item.increaseDetail;

                            data1['decreaseName'] = item.decreaseName;
                            data1['decreasePoint'] = item.decreasePoint;
                            data1['decreaseUnit'] = item.decreaseUnit;
                            data1['decreaseNum'] = item.decreaseNum;
                            data1['decreaseDetail'] = item.decreaseDetail;

                            data1['totalPoint'] = item.totalPoint;
                            data1['level'] = 1;

                            data1['standardDate'] = standardDate;
                            data1['submitTime'] = submitTime;

                            postData.push(data1);
                        }
                    });
                }
            });

            if (postData.length==0){
                $.notify('请勿提交空表', 'danger');
            }
            else{
                $http
                    ({
                        method: 'POST',
                        url: $rootScope.url + '/standard-service/result/add-batch',
                        data: postData
                    })
                    .then(function (response) {
                        if (response.data.status != 200) {
                            $.notify(response.data.message, 'danger');
                        } else {
                            // data1['fatherId'] = response.data.data.id;
                            //获取这波提交的内容，update小条目的fatherId
                            $http.get($rootScope.url + '/standard-service/result/list?submitTime=' + submitTime)
                            .then(function (response) {
                                if (response.data.status === 200) {
                                    var fatherId = 0;
                                    response.data.data.forEach(function(item, index, array){
                                        if (item.level === 0){
                                            fatherId = item.id;
                                        }
                                        else {
                                            item.fatherId = fatherId;
                                            $http
                                            ({
                                                method: 'POST',
                                                url: $rootScope.url + '/standard-service/result/edit',
                                                data: item
                                            })
                                            .then(function (response) {
                                                if (response.data.status != 200) {
                                                    $.notify(response.data.message, 'danger');
                                                } else if(index === array.length-1){
                                                    $.notify('提交成功！', 'success');
                                                    $state.go('app.result', {
                                                        standardDate:standardDate,
                                                        departmentId: $scope.department.departmentId
                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    $.notify(response.data.message, 'danger');
                                }
                            }, function (x) {
                                $.notify('服务器出了点问题，我们正在处理', 'danger');
                            });



                        }
                    }, function (x) {
                        $.notify('服务器出了点问题，我们正在处理', 'danger');
                    });
            }
        }

        $scope.checkSubmition = function(){
            //查询当前日期是否已有记录
            var standardDate = moment($scope.datePicked).format('YYYY-MM-DD');
            $http.get($rootScope.url + '/standard-service/result/list?standardDate=' + standardDate 
                + '&personId=' + $rootScope.account.id 
                + '&departmentId=' + $scope.department.departmentId)
            .then(function (response) {
                if (response.data.status === 200) {
                    if (response.data.data.length > 0){
                        $scope.submitted = true;
                    }
                    else{
                        $scope.submitted = false;
                    }
                }
                else{
                    $.notify(response.data.message, 'danger');
                }
            }, function (x) {
                $.notify('服务器出了点问题，我们正在处理', 'danger');
            });
        }

        $scope.reset = function (item) {
            $scope.totalPoints -= item.totalPoint;
            item.increaseNum = "";
            item.increaseDetail = "";
            item.decreaseNum = "";
            item.decreaseDetail = "";
            item.totalPoint = "";
        };
        $scope.resetAll = function () {
            $scope.data.forEach(function (data_i, index) {
                data_i.items.forEach(function (item) {
                    //对于总分是有效数字的条目
                    if (!isNaN(item.totalPoint) && item.totalPoint !== "") {
                        $scope.reset(item);
                    }
                });
            });
        };

//把日期格式2018/04/20替换为2018-04-20
// $scope.datePicked = (new Date()).toLocaleDateString().replace(/\//g, '-');
        $scope.datePicked = moment().format('YYYY-MM-DD');
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

        $scope.todayDate = moment().format('YYYY-MM-DD');

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
        loadRelations();
    }])
;
