/**=========================================================
 * Module: social-items.js
 =========================================================*/

App.controller('SocialCtrl', ['$scope', '$http', '$rootScope',
        function ($scope, $http, $rootScope) {
            $scope.search = {
                nickname: '',
                content: '',
                wechat: '',
                dianping: '',
                dt: ''
            };

            function buildParam() {
                var param = '&nickname=';
                param += $scope.search.nickname;
                param += '&content=';
                param += $scope.search.content;
                param += '&source=';
                if ($scope.search.wechat) {
                    param += 'wechat';
                    if ($scope.search.dianping) param += ',dazhongdianping';
                } else if ($scope.search.dianping)
                    param += 'dazhongdianping';
                if ($scope.search.dt) {
                    var d = moment($scope.search.dt).format('YYYY-MM-DD');
                    param += '&begintime=' + d + '&endtime=' + d;
                } else {
                    param += '&begintime=';
                    param += '&endtime=';
                }
                return param;
            }

            function loadData() {
                var type = $scope.search.type || 2;
                var page = $scope.search.page;
                var param = 'showtype=' + type + '&page=' + page + buildParam();
                var map = {1: 'unapproved', 2: 'approved', 3: 'favorite', 4: 'deleted'};
                var target = map[type];
                $http
                    .get('/merchant/search.action?' + param)
                    .then(function (response) {
                        if (response.data.status) {
                            $scope[target] = response.data.data;
                            var pagination = response.data.msg.split(',');
                            $scope.totalItems = parseInt(pagination[1]);
                        } else {
                            $.notify(response.data.msg, 'danger');
                        }
                    }, function (x) {
                        $.notify('服务器出了点问题，我们正在处理', 'danger');
                    });
            }

            $scope.pageChanged = loadData;

            $scope.load = function (type) {
                $scope.search.type = type;
                $scope.search.page = 1;
                loadData();
                $('.comment:checked').prop('checked', false);
            };

            $scope.doSearch = function () {
                $scope.search.page = 1;
                loadData();
            };

            $scope.$watch('search.dt', function () {
                $scope.doSearch();
            });

            $scope.addToBlackList = function (item) {
                bootbox.confirm('确定要将该用户加入黑名单吗？', function (result) {
                    if (!result) return;
                    $http
                        .post('/merchant/addblacklist.action?source=' + item.source
                            + '&nickname=' + item.nickname + '&headportrait=' + item.headsculpture
                            + '&userid=' + item.customerid)
                        .then(function (response) {
                            if (response.data.status) {
                                $.notify('成功', 'success');
                                $scope.doSearch();
                            } else {
                                $.notify(response.data.msg, 'danger');
                            }
                        }, function (x) {
                            $.notify('服务器出了点问题，我们正在处理', 'danger');
                        });
                })
            };

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1,
                formatDayTitle: 'yyyy年M月'
            };

            $scope.format = 'yyyy年M月d日';

            $scope.do = function (op, id) {
                $http
                    .get('/merchant/operateusercomment.action?optype=' + op + '&id=' + id)
                    .then(function (response) {
                        if (response.data.status) {
                            loadData();
                            $.notify('成功', 'success');
                        } else {
                            $.notify(response.data.msg, 'danger');
                        }
                    }, function (x) {
                        $.notify('服务器出了点问题，我们正在处理', 'danger');
                    });
            };

            $scope.doAll = function (op) {
                var list = [];
                $('.comment:checked').each(function (_, item) {
                    list.push(item.value);
                });
                var param = list.join(',');
                $http
                    .get('/merchant/operateusercomment.action?optype=' + op + '&id=' + param)
                    .then(function (response) {
                        if (response.data.status) {
                            loadData();
                            $.notify('成功', 'success');
                        } else {
                            $.notify(response.data.msg, 'danger');
                        }
                    }, function (x) {
                        $.notify('服务器出了点问题，我们正在处理', 'danger');
                    });
            };

            $scope.show = function (item) {
                $http
                    .get('/merchant/getcommentpic.action?id=' + item.commentid)
                    .then(function (response) {
                        if (response.data.status) {
                            var src2 = response.data.data;
                            bootbox
                                .dialog({
                                    title: '原图',
                                    message: '<div><img width="95%" src="' + src2 + '" />' + '</div>'
                                });
                        } else {
                            $.notify(response.data.msg, 'danger');
                        }
                    }, function (x) {
                        $.notify('服务器出了点问题，我们正在处理', 'danger');
                    });
            }

            $scope.print = function (item) {
                if (item.picture) {
                    $http
                        .get('/merchant/account.action')
                        .then(function (response) {
                            if (response.data.status) {
                                var logo = '/upload/file/business_logo/' + response.data.data.logopath;
                                var table = $('<table width="100%">');
                                var img = '<img width="100%" src="//' + $rootScope.url + '/weipage/file/' + item.picture + '">';
                                table.append('<tr><td colspan="2">' + img + '</td></tr>');
                                var content = '<tr><td width="20%"><img src="//' + $rootScope.url + logo + '"</td>' +
                                    '<td width="80%">' + item.content + '</td></tr>';
                                table.append(content);
                                table.prepend('<style>@page{size:3.5in 5in; margin: 25mm 25mm 25mm 25mm;}</style>')
                                table.printArea();
                            } else {
                                $.notify(response.data.msg, 'danger');
                            }
                        }, function (x) {
                            $.notify('服务器出了点问题，我们正在处理', 'danger');
                        });
                } else {
                    $.notify('该条目没有照片哦', 'danger');
                }
            };

            $(window).resize(function () {
                var d = $('#container');
                d.height($(window).height() - d.offset().top );
            });
            $(window).resize();
        }])
    .filter('moment', function () {
        return function (val) {
            return moment(val).format('YYYY年M月D日 H:mm');
        };
    })
;