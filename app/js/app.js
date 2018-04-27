if (typeof $ === 'undefined') {
    throw new Error('This application\'s JavaScript requires jQuery');
}


// APP START
// ----------------------------------- 

var App = angular.module('vsp', ['ngRoute', 'ngAnimate', 'ngStorage', 'ngCookies', 'ui.bootstrap', 'ui.router', 'oc.lazyLoad', 'cfp.loadingBar', 'ngSanitize', 'ngResource', 'tmh.dynamicLocale', 'ui.utils'])
    .run(["$rootScope", "$state", "$stateParams", '$window', '$templateCache', function ($rootScope, $state, $stateParams, $window, $templateCache) {
        // Set reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$storage = $window.localStorage;


        if (window.location.href.indexOf('indexing') > 0) {
            $rootScope.url = 'www.standard.com';
        } else {
            $rootScope.url = 'http://localhost:8888/indexing';
        }

        // Uncomment this to disable template cache
        /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
         if (typeof(toState) !== 'undefined'){
         $templateCache.remove(toState.templateUrl);
         }
         });*/

        // Scope Globals
        // -----------------------------------

        $rootScope.app = {
            name: ' 量化考评系统',
            description: '管理后台',
            year: ((new Date()).getFullYear()),
            layout: {
                isFixed: true,
                isCollapsed: false,
                isBoxed: false,
                isRTL: false,
                horizontal: false,
                isFloat: false,
                asideHover: false
            },
            useFullLayout: false,
            hiddenFooter: false,
            viewAnimation: 'ng-fadeInUp'
        };

    }]);


/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
        function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
            'use strict';

            // Set the following to true to enable the HTML5 Mode
            // You may have to set <base> tag in index and a routing configuration in your server
            $locationProvider.html5Mode(false);

            // defaults to dashboard
            $urlRouterProvider.otherwise('/login');

            //
            // Application Routes
            // -----------------------------------
            $stateProvider
                .state('app', {
                    url: '/app',
                    abstract: true,
                    templateUrl: helper.basepath('app.html'),
                    controller: 'AppController',
                    resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'bootbox', 'moment')
                })
                .state('app.search', {
                    url: '/search',
                    title: '检索本人绩效',
                    templateUrl: helper.basepath('search.html'),
                    resolve: helper.resolveFor('ngDialog'),
                    controller: 'SearchController'
                })
                .state('app.evaluate', {
                    url: '/evaluate',
                    title: '填写个人考评',
                    templateUrl: helper.basepath('evaluate.html'),
                    resolve: helper.resolveFor('ngDialog'),
                    controller: 'EvaluateController'
                })
                .state('app.result', {
                    url: '/result',
                    title: '查看本人绩效',
                    templateUrl: helper.basepath('result.html'),
                    resolve: helper.resolveFor('ngDialog'),
                    controller: 'ResultController'
                })
                .state('app.setting', {
                    url: '/setting',
                    title: '个人信息维护',
                    templateUrl: helper.basepath('setting.html'),
                    resolve: helper.resolveFor('ngDialog'),
                    controller: 'SearchController'
                })
                .state('app.graph', {
                    url: '/graph',
                    title: '查看本人成长曲线',
                    templateUrl: helper.basepath('graph.html'),
                    resolve: helper.resolveFor('ngDialog', 'chartjs'),
                    controller: 'GraphController'
                })
                .state('app.account', {
                    url: '/account',
                    title: ' 账户信息',
                    templateUrl: helper.basepath('account.html'),
                    resolve: helper.resolveFor('ngDialog', 'ngImgCrop', 'filestyle', 'angularFileUpload'),
                    controller: 'AccountController'
                })
                .state('app.adstatistics', {
                    url: '/adstatistics',
                    title: '评论统计',
                    templateUrl: helper.basepath('adstatistics.html')   ,
                    controller: 'AdstatisticsController'
                })
                .state('login', {
                    url: '/login',
                    title: '登录',
                    templateUrl: 'app/pages/login.html'
                })
                .state('logout', {
                    url: '/logout',
                    title: '登录',
                    templateUrl: 'app/pages/login.html'
                })
            ;


        }]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
        'use strict';

        // Lazy Load modules configuration
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: APP_REQUIRES.modules
        });

    }]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
        function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
            'use strict';
            // registering components after bootstrap
            App.controller = $controllerProvider.register;
            App.directive = $compileProvider.directive;
            App.filter = $filterProvider.register;
            App.factory = $provide.factory;
            App.service = $provide.service;
            App.constant = $provide.constant;
            App.value = $provide.value;

        }]).config(['tmhDynamicLocaleProvider', function (tmhDynamicLocaleProvider) {

        tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');

        // tmhDynamicLocaleProvider.useStorage('$cookieStore');

    }]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 500;
        cfpLoadingBarProvider.parentSelector = '.wrapper > section';
    }]).factory('httpInterceptor',
    ["$q", "$rootScope", function ($q, $rootScope) {
        return {
            'request': function (config) {
                $rootScope.loading = 1;
                return config;
            },
            'response': function (response) {
                $rootScope.loading = 0;
                return response;
            },
            'requestError': function (rejection) {
                return response;
            },
            'responseError': function (rejection) {
                if (rejection.status == 401) {
                    window.location.href = '/merchants';
                }
                return rejection;
            }
        };
    }]).config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }])



/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/
App
    .constant('APP_COLORS', {
        'primary': '#5d9cec',
        'success': '#27c24c',
        'info': '#23b7e5',
        'warning': '#ff902b',
        'danger': '#f05050',
        'inverse': '#131e26',
        'green': '#37bc9b',
        'pink': '#f532e5',
        'purple': '#7266ba',
        'dark': '#3a3f51',
        'yellow': '#fad732',
        'gray-darker': '#232735',
        'gray-dark': '#3a3f51',
        'gray': '#dde6e9',
        'gray-light': '#e4eaec',
        'gray-lighter': '#edf1f2'
    })
    .constant('APP_MEDIAQUERY', {
        'desktopLG': 1200,
        'desktop': 992,
        'tablet': 768,
        'mobile': 480
    })
    .constant('APP_REQUIRES', {
        // jQuery based and standalone scripts
        scripts: {
            'whirl': ['vendor/whirl/dist/whirl.css'],
            'classyloader': ['vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
            'animo': ['vendor/animo.js/animo.js'],
            'fastclick': ['vendor/fastclick/lib/fastclick.js'],
            'modernizr': ['vendor/modernizr/modernizr.js'],
            'animate': ['vendor/animate.css/animate.min.css'],
            'icons': ['vendor/skycons/skycons.js',
                'vendor/fontawesome/css/font-awesome.min.css',
                'vendor/simple-line-icons/css/simple-line-icons.css',
                'vendor/weather-icons/css/weather-icons.min.css'],
            'sparklines': ['app/vendor/sparklines/jquery.sparkline.min.js'],
            'slider': ['vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                'vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css'],
            'wysiwyg': ['vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                'vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
            'slimscroll': ['vendor/slimScroll/jquery.slimscroll.min.js'],
            'screenfull': ['vendor/screenfull/dist/screenfull.js'],
            'vector-map': ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
                'vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
                'vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js',
                'vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'],
            'loadGoogleMapsJS': ['app/vendor/gmap/load-google-maps.js'],
            'google-map': ['vendor/jQuery-gMap/jquery.gmap.min.js'],
            'flot-chart': ['vendor/Flot/jquery.flot.js'],
            'flot-chart-plugins': ['vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                'vendor/Flot/jquery.flot.resize.js',
                'vendor/Flot/jquery.flot.pie.js',
                'vendor/Flot/jquery.flot.time.js',
                'vendor/Flot/jquery.flot.categories.js',
                'vendor/flot-spline/js/jquery.flot.spline.min.js'],
            // jquery core and widgets
            'jquery-ui': ['vendor/jquery-ui/ui/core.js',
                'vendor/jquery-ui/ui/widget.js'],
            // loads only jquery required modules and touch support
            'jquery-ui-widgets': ['vendor/jquery-ui/ui/core.js',
                'vendor/jquery-ui/ui/widget.js',
                'vendor/jquery-ui/ui/mouse.js',
                'vendor/jquery-ui/ui/draggable.js',
                'vendor/jquery-ui/ui/droppable.js',
                'vendor/jquery-ui/ui/sortable.js',
                'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'],
            'moment': ['vendor/moment/min/moment-with-locales.min.js'],
            'inputmask': ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js'],
            'flatdoc': ['vendor/flatdoc/flatdoc.js'],
            'codemirror': ['vendor/codemirror/lib/codemirror.js',
                'vendor/codemirror/lib/codemirror.css'],
            // modes for common web files
            'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
                'vendor/codemirror/mode/xml/xml.js',
                'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                'vendor/codemirror/mode/css/css.js'],
            'taginput': ['vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'],
            'filestyle': ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
            'parsley': ['vendor/parsleyjs/dist/parsley.min.js'],
            'datatables': ['vendor/datatables/media/js/jquery.dataTables.min.js',
                'app/vendor/datatable-bootstrap/css/dataTables.bootstrap.css'],
            'datatables-pugins': ['app/vendor/datatable-bootstrap/js/dataTables.bootstrap.js',
                'app/vendor/datatable-bootstrap/js/dataTables.bootstrapPagination.js',
                'vendor/datatables-colvis/js/dataTables.colVis.js',
                'vendor/datatables-colvis/css/dataTables.colVis.css'],
            'fullcalendar': ['vendor/fullcalendar/dist/fullcalendar.min.js',
                'vendor/fullcalendar/dist/fullcalendar.css'],
            'gcal': ['vendor/fullcalendar/dist/gcal.js'],
            'nestable': ['vendor/nestable/jquery.nestable.js'],
            'chartjs': ['vendor/Chart.js/Chart.js'],
            'bootbox': ['vendor/bootbox/bootbox.js'],
            'print-area': ['vendor/print-area/demo/jquery.PrintArea.js'],
            'ueditor': ['vendor/ueditor/ueditor.config.js',
                'vendor/ueditor/ueditor.all.min.js'],
            'qiniu-js-sdk': ['vendor/qiniu-js-sdk/qiniu.js',
                'vendor/qiniu-js-sdk/plupload/plupload.full.min.js']
        },
        // Angular based script (use the right module name)
        modules: [
            {name: 'toaster', files: ['vendor/angularjs-toaster/toaster.js',
                'vendor/angularjs-toaster/toaster.css']},
            {name: 'localytics.directives', files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js',
                'vendor/chosen_v1.2.0/chosen.min.css',
                'vendor/angular-chosen-localytics/chosen.js']},
            {name: 'ngDialog', files: ['vendor/ngDialog/js/ngDialog.min.js',
                'vendor/ngDialog/css/ngDialog.min.css',
                'vendor/ngDialog/css/ngDialog-theme-default.min.css'] },
            {name: 'ngWig', files: ['vendor/ngWig/dist/ng-wig.min.js'] },
            {name: 'ngTable', files: ['vendor/ng-table/dist/ng-table.min.js',
                'vendor/ng-table/dist/ng-table.min.css']},
            {name: 'ngTableExport', files: ['vendor/ng-table-export/ng-table-export.js']},
            {name: 'angularBootstrapNavTree', files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']},
            {name: 'htmlSortable', files: ['vendor/html.sortable/dist/html.sortable.js',
                'vendor/html.sortable/dist/html.sortable.angular.js']},
            {name: 'xeditable', files: ['vendor/angular-xeditable/dist/js/xeditable.js',
                'vendor/angular-xeditable/dist/css/xeditable.css']},
            {name: 'angularFileUpload', files: ['vendor/angular-file-upload/angular-file-upload.js']},
            {name: 'ngImgCrop', files: ['vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                'vendor/ng-img-crop/compile/unminified/ng-img-crop.css']},
            {name: 'ui.select', files: ['vendor/angular-ui-select/dist/select.js',
                'vendor/angular-ui-select/dist/select.css']},
            {name: 'ui.codemirror', files: ['vendor/angular-ui-codemirror/ui-codemirror.js']},
            {name: 'angular-carousel', files: ['vendor/angular-carousel/dist/angular-carousel.css',
                'vendor/angular-carousel/dist/angular-carousel.js']},
            {name: 'ngGrid', files: ['vendor/ng-grid/build/ng-grid.min.js',
                'vendor/ng-grid/ng-grid.css' ]},
            {name: 'infinite-scroll', files: ['vendor/ngInfiniteScroll/build/ng-infinite-scroll.js']},
            {name: 'com.2fdevs.videogular', files: ['vendor/videogular/videogular.min.js']},
            {name: 'com.2fdevs.videogular.plugins.buffering',
                files: ['vendor/videogular-buffering/vg-buffering.min.js']},
            {name: 'com.2fdevs.videogular.plugins.controls',
                files: ['vendor/videogular-controls/vg-controls.min.js']},
            {name: 'com.2fdevs.videogular.plugins.overlayplay',
                files: ['vendor/videogular-overlay-play/vg-overlay-play.min.js']} ,
            {name: 'qiniu-js-sdk1', files: [ 'vendor/qiniu-js-sdk/qiniu.js',
                'vendor/qiniu-js-sdk/plupload/plupload.min.js',          ,
                'vendor/qiniu-js-sdk/plupload/jquery.ui.plupload/jquery.ui.plupload.min.js',
                'vendor/qiniu-js-sdk/jquery-1.9.1.min.js',
                'vendor/qiniu-js-sdk/plupload/moxie.min.js',
                'vendor/qiniu-js-sdk/plupload/plupload.full.min.js',
                'vendor/qiniu-js-sdk/plupload/i18n/zh_CN.js',
                'vendor/qiniu-js-sdk/ui.js',
                'vendor/qiniu-js-sdk/highlight/highlight.js',
                'vendor/qiniu-js-sdk/main.js',
                'vendor/qiniu-js-sdk/qupload.js']}
        ]

    })
;
/**=========================================================
 * Module: access-login.js
 =========================================================*/

App.controller('LoginFormController', ['$scope', '$rootScope', '$http', '$state', function ($scope,$rootScope, $http, $state) {

    $scope.account = {};
    $scope.authMsg = '';

    $scope.login = function () {
        $scope.authMsg = '欢迎登陆';
        $state.go('app.account');
        

       // $http
       //      .post('/apis/remove-me/account-service/person/login?account=' + $scope.account.username + '&password=' + $scope.account.password)
       //      .then(function (response) {
       //          if (response.data.status!=200) {
       //              $scope.authMsg = response.data.message;
       //          } else {
        //          $rootScope.account=response.data.data;
       //              $state.go('app.account');
       //          };
       //      }, function (x) {
       //          $scope.authMsg = '服务器出了点问题，我们正在处理';
       //      });
    };

}]);

/**=========================================================
 * Module: account.js
 =========================================================*/

App.controller('AccountController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    $scope.$on('ngDialog.opened', function (event, $dialog) {
        if (!$scope.isPassword)
            $dialog.find('.ngdialog-content').css('width', '80%');
    });

    $http
        .get('/nongyequan-server/person/get?id=')
        .then(function (response) {
            if (response.data.status) {
                $rootScope.account = response.data.data;
            } else {
                $.notify(response.data.msg, 'danger');
            }
        }, function (x) {
            $.notify('服务器出了点问题，我们正在处理', 'danger');
        });

    $rootScope.saveAccount = function () {
        var param = 'password=' + $scope.account.password
            + '&businessname=' + $scope.account.cname
            + '&businessfullname=' + $scope.account.fullname
            + '&contactperson=' + $scope.account.contactperson
            + '&telephone=' + $scope.account.telephone
            + '&address=' + $scope.account.address;
        $http
            .post('/nongyequan-server/editaccount.action?' + param)
            .then(function (response) {
                if (response.data.status) {
                    $.notify('成功', 'success');
                } else {
                    $.notify(response.data.msg, 'danger');
                }
            }, function (x) {
                $.notify('服务器出了点问题，我们正在处理', 'danger');
            });
    };

    $(window).resize(function () {
        var d = $('#container');
        d.height($(window).height() - d.offset().top );
    });
    $(window).resize();
}]);

App.controller('PasswordCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.change = function () {
        if ($scope.ngDialogData.password != $scope.password.old) {
            $.notify('原密码错误', 'danger');
        } else if (!$scope.password.cur) {
            $.notify('请输入新密码', 'danger');
        } else if ($scope.password.cur != $scope.password.dup) {
            $.notify('两次密码不一致', 'danger');
        } else {
            $rootScope.account.password = $scope.password.cur;
            $rootScope.saveAccount();
            $scope.closeThisDialog();
        }
    }
}]);

/**=========================================================
 * Module: adstatistics.js
 =========================================================*/

App.controller('MCustomerstatisticsController', ['$scope', '$http',
    function ($scope, $http) {
        $http
            .get('/merchant/getMCustomerStatistics.action')
            .then(function (response) {
                    if (response.data.status) {
                        $scope.totalcount = response.data.data.totalcount;
                        $scope.femalecount = response.data.data.femalecount;
                        $scope.malecount = response.data.data.malecount;
                        $scope.provincename = response.data.data.provincename;
                        $scope.citycount = response.data.data.citycount;
                        $scope.provincecount = response.data.data.provincecount;
                        $scope.language_zh_CN = response.data.data.language_zh_CN;
                        $scope.cityname = response.data.data.cityname;
                        $scope.language_other = response.data.data.language_other;
                        //语言
                        $('.sparkline2').sparkline([$scope.language_zh_CN, $scope.language_other],
                            {
                                type: 'pie',
                                height: '200',
                                width: '100%',
                                offset: '90',
                                sliceColors: ['#44B549', '#4A90E2', '#990099'],
                                fillColor: '',
                                tooltipFormat: '{{offset:offset}}：{{value}}',
                                tooltipValueLookups: {
                                    'offset': ['中文', '其它']
                                }
                            }
                        )
                        ;
                        //性别
                        $('.sparkline1').sparkline([$scope.malecount, $scope.femalecount],
                            {
                                type: 'pie',
                                height: '200',
                                width: '100%',
                                offset: '90',
                                sliceColors: ['#44B549', '#4A90E2', '#990099'],
                                tooltipFormat: '{{offset:offset}}：{{value}}',
                                tooltipValueLookups: {
                                    'offset': ['男', '女']
                                }
                            }
                        )
                        ;
                    }
                    else {
                        $.notify(response.data.msg, 'danger');
                    }
                },
                function (x) {
                    $.notify('服务器出了点问题，我们正在处理', 'danger');
                }
            )
        ;
        $(window).resize(function () {
            var d = $('#container');
            d.height($(window).height() - d.offset().top);
        });
        $(window).resize();
    }])
;
/**=========================================================
 * Module: datepicker.js
 * Provides a simple demo for bootstrap datepicker
 =========================================================*/

App.controller('DatepickerCtrl', ['$scope', function ($scope) {
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
}]);

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
            $scope.totalPoints -= item.total_point;
            item.increase_num = "";
            item.increase_detail = "";
            item.decrease_num = "";
            item.decrease_detail = "";
            item.total_point = "";
        };
        $scope.resetAll = function(){
            $scope.data.forEach(function(data_i, index){
                data_i.items.forEach(function(item){
                    //对于总分是有效数字的条目
                    if (!isNaN(item.total_point) && item.total_point!==""){
                        $scope.reset(item);
                    }
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

/**=========================================================
 * Module: main.js
 * Main Application Controller
 =========================================================*/

App.controller('AppController',
    ['$rootScope', '$scope', '$state', '$window', '$localStorage', '$timeout', 'toggleStateService', 'colors', 'browser',
        'cfpLoadingBar', '$http',
        function ($rootScope, $scope, $state, $window, $localStorage, $timeout, toggle, colors, browser, cfpLoadingBar, $http) {
            "use strict";

            // Setup the layout mode
            $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout == 'app-h');

            // Loading bar transition
            // -----------------------------------
            var thBar;
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if ($('.wrapper > section').length) // check if bar container exists
                    thBar = $timeout(function () {
                        cfpLoadingBar.start();
                    }, 0); // sets a latency Threshold
            });
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                event.targetScope.$watch("$viewContentLoaded", function () {
                    $timeout.cancel(thBar);
                    cfpLoadingBar.complete();
                });
            });


            // Hook not found
            $rootScope.$on('$stateNotFound',
                function (event, unfoundState, fromState, fromParams) {
                    console.log(unfoundState.to); // "lazy.state"
                    console.log(unfoundState.toParams); // {a:1, b:2}
                    console.log(unfoundState.options); // {inherit:false} + default options
                });
            // Hook error
            $rootScope.$on('$stateChangeError',
                function (event, toState, toParams, fromState, fromParams, error) {
                    console.log(error);
                });
            // Hook success
            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    // display new view from top
                    $window.scrollTo(0, 0);
                    // Save the route title
                    $rootScope.currTitle = $state.current.title;
                });

            $rootScope.currTitle = $state.current.title;
            $rootScope.pageTitle = function () {
                var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
                document.title = title;
                return title;
            };

            // iPad may presents ghost click issues
            // if( ! browser.ipad )
            // FastClick.attach(document.body);

            // Close submenu when sidebar change from collapsed to normal
            $rootScope.$watch('app.layout.isCollapsed', function (newValue, oldValue) {
                if (newValue === false)
                    $rootScope.$broadcast('closeSidebarMenu');
            });

            // Restore layout settings
            if (angular.isDefined($localStorage.layout))
                $scope.app.layout = $localStorage.layout;
            else
                $localStorage.layout = $scope.app.layout;

            $rootScope.$watch("app.layout", function () {
                $localStorage.layout = $scope.app.layout;
            }, true);


            // Allows to use branding color with interpolation
            // {{ colorByName('primary') }}
            $scope.colorByName = colors.byName;

            // Restore application classes state
            toggle.restoreState($(document.body));

            // cancel click event easily
            $rootScope.cancel = function ($event) {
                $event.stopPropagation();
            };

            $rootScope.logout = function () {
                $http.post('/merchant/logout.action');
                $state.go('login');
            }
        }]);
/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */

App.controller('QiniuFileUploadController', ['$scope', '$rootScope', '$timeout', '$http', function ($scope, $rootScope, $timeout, $http) {

    var qiniuuploader, token = '';
    var key = '';
    $rootScope.filename = '';
    $rootScope.filesize = '';
    $scope.media = {
        name: '',
        note: '',
        second: 10,
        minute: 0
    };
    $scope.uploadqueue = '';
    parseJSON = function (data) {
        // Attempt to parse using the native JSON parser first
        if (window.JSON && window.JSON.parse) {
            return window.JSON.parse(data);
        }

        if (data === null) {
            return data;
        }
        if (typeof data === "string") {

            // Make sure leading/trailing whitespace is removed (IE can't handle it)
            data = this.trim(data);

            if (data) {
                // Make sure the incoming data is actual JSON
                // Logic borrowed from http://json.org/json2.js
                if (/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, "@").replace(/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {

                    return (function () {
                        return data;
                    })();
                }
            }
        }
    };
    $timeout(function () {
        qiniuuploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'pickfiles',
            container: 'qiniuContainer',
            max_file_size: '600mb',
            flash_swf_url: 'js/plupload/Moxie.swf',
            chunk_size: '4mb',
            domain: 'http://7xlx4k.com2.z0.glb.qiniucdn.com/',
            get_new_uptoken: true,
            uptoken: function () {
                return token;
            },
            key: function () {
                return key;
            },
            auto_start: false,

            init: {
                'FilesAdded': function (up, files) {
                    $('table').show();
                    $('#success').hide();
                    plupload.each(files, function (file) {
                        $scope.$apply(function () {
                                $rootScope.filename = file.name;
                                $rootScope.filesize = '(' + (file.size / 1024 / 1024).toFixed(2) + 'MB)';
                            }
                        );
                    });
                },
                'BeforeUpload': function (up, file) {
                    var chunk_size = plupload.parseSize(this.getOption('chunk_size'))
                },
                'UploadProgress': function (up, file) {
                    console.log("percent:" + file.percent);
                    $('body').append('<style>.whirl:after{content: "' + file.percent + '%";}</style>');
                    //console.log("pro:"+);
                },
                'UploadComplete': function () {
                    //$('#success').show();
                },
                'FileUploaded': function (up, file, JSONString) {
                    $rootScope.filename = '';
                    $rootScope.filesize = '';
                    var info = parseJSON(JSONString);
                    if (!info.ext) {
                        alert("文件上传服务器失败！请重试！");
                        $scope.closeThisDialog();
                    }
                    var showtime = parseInt($scope.media.minute) * 60 + parseInt($scope.media.second);
                    var filesize = 0;
                    var newname = info.key + info.ext;
                    var rotate = "";
                    if ($scope.media.type === 'V' || $scope.media.type === 'F') {
                        showtime = parseInt(info.avinfo.format.duration) + 1;
                        filesize = parseInt(info.avinfo.format.size);
                        newname = info.key + "-s.mp4";
                    } else {
                        if (!(info.exif==null||info.exif==undefined )) {
                            rotate = info.exif.Orientation.val;
                        }
                    }
                    $http
                        .post('/merchant/uploadimagecontinue.action?oldkey=' +
                            info.key +
                            '&newkey=' + newname +
                            '&shotkey=' + $scope.rename +
                            '&name=' + $scope.media.name +
                            '&type=' + $scope.media.type +
                            '&note=' + $scope.media.note +
                            '&showtime=' + showtime +
                            '&filesize=' + filesize + "&rotate=" + rotate
                        )
                        .then(
                            function (response) {
                                if (response.data.status) {
                                    if ($scope.media.type === 'A') {
                                        $rootScope.foregrounds = response.data.data;
                                    } else if ($scope.media.type === 'B') {
                                        $rootScope.backgrounds = response.data.data;
                                    } else if ($scope.media.type === 'V') {
                                        $rootScope.videos = response.data.data;
                                        $.notify('视频已上传，正在转码中，请等待几分钟后再关联到盒子！', 'success');
                                    }
                                    else if ($scope.media.type === 'F') {
                                        $rootScope.fvideos = response.data.data;
                                        $.notify('视频已上传，正在转码中，请等待几分钟后再关联到盒子！', 'success');
                                    }
                                } else {
                                    $
                                        .notify(
                                            response.data.msg,
                                            'danger');
                                }
                            },
                            function (x) {
                                $.notify('服务器出了点问题，我们正在处理',
                                    'danger');
                            });
                    $scope.closeThisDialog();
                },
                'Error': function (up, err, errTip) {
                    console.log("Error:" + err);
                }
            }
        });
    }, 200);
    $scope.save = function () {
        if ($scope.media.name == '') {
            $.notify('必须输入名称', {status: 'danger', pos: 'top-right'});
            return;
        }
        if (parseInt($scope.media.minute) != $scope.media.minute
            || parseInt($scope.media.second) != $scope.media.second) {
            $.notify('播放时长必须是整数', {status: 'danger', pos: 'top-right'});
            return;
        }
        if ($scope.media.minute < 0 || $scope.media.second < 0 || $scope.media.second + $scope.media.minute == 0) {
            $.notify('播放时长必须是正数', {status: 'danger', pos: 'top-right'});
            return;
        }
        $scope.media.type = $scope.ngDialogData;
        $http
            .get('/merchant/uploadprepare.action?key=' + $scope.media.name + '&type=' + $scope.media.type)
            .then(
                function (response) {
                    if (response.data.status) {
                        token = response.data.data.token;
                        key = response.data.data.key;
                        $scope.rename = response.data.data.rename;
                        $scope.isUploading = 'whirl shadow';
                        qiniuuploader.start();

                    } else {
                        $
                            .notify(
                                response.data.msg,
                                'danger');
                    }
                },
                function (x) {
                    $.notify('服务器出了点问题，我们正在处理',
                        'danger');
                });
    };
}]);
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
                increase_num: 3,
                increase_detail: "听话",
                decrease_name : "没出操",
                decrease_point : 1,
                decrease_unit: "次",
                decrease_num: 2,
                decrease_detail: "不听话",
                total_point: 100,
                level : "1",
                father_id : "0",
            },
            {
                id : "1",
                department_id : "1",
                index_name: "学习",
                increase_name : "好好学习",
                increase_point : 2,
                increase_unit: "次",
                increase_num: 2,
                increase_detail: "听话",
                decrease_name : "没出操",
                decrease_point : 1,
                decrease_unit: "次",
                decrease_num: 1,
                decrease_detail: "不听话",
                total_point: 100,
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
                id : "1",
                department_id : "1",
                index_name: "学习",
                increase_name : "好好学习",
                increase_point : 2,
                increase_unit: "次",
                increase_num: 3,
                increase_detail: "听话",
                decrease_name : "没出操",
                decrease_point : 1,
                decrease_unit: "次",
                decrease_num: 2,
                decrease_detail: "不听话",
                total_point: 80,
                level : "1",
                father_id : "0",
            },
            {
                id : "1",
                department_id : "1",
                index_name: "学习",
                increase_name : "好好学习",
                increase_point : 2,
                increase_unit: "次",
                increase_num: 3,
                increase_detail: "听话",
                decrease_name : "没出操",
                decrease_point : 1,
                decrease_unit: "次",
                decrease_num: 2,
                decrease_detail: "不听话",
                total_point: 50,
                level : "1",
                father_id : "0",
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

        $scope.back = function(){
            $state.go('app.evaluate');
        };
    }]);

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

        $scope.search = {
            increaseType: 0,
            commentType: 0,
            timeStart: '',
            timeEnd: '',
            page: 1,
            size: 2
        };
        $scope.timeStart = '';
        $scope.timeEnd = '';
        $scope.opened = {
            start: false,
            end: false
        };

        var
            buildParam = function () {
                var param = {
                    method: 'GET',
                    url: '/apis/remove-me/standard-service/result/search',
                    params: $scope.search
                };
                return param;
            },
            loadData = function () {
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
            },
            resetList = function () {
                $scope.search.page = 1;


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

                loadData();
            };

        $scope.pageChanged = loadData;
        $scope.searchList = resetList;
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

        $scope.resetSearch = function () {
            $scope.totalItems = 0;
            $scope.search.commentType = 0;
            $scope.search.timeStart = '';
            $scope.search.timeEnd = '';
            $scope.timeStart = '';
            $scope.timeEnd = '';
            resetList();
        };

        $(window).resize(function () {
            var d = $('#container');
            d.height($(window).height() - d.offset().top);
        });
        $(window).resize();

        resetList();
    }]);

/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

App.controller('SidebarController', ['$rootScope', '$scope', '$state', '$http', '$timeout', 'Utils',
    function ($rootScope, $scope, $state, $http, $timeout, Utils) {

        var collapseList = [];

        // demo: when switch from collapse to hover, close all items
        $rootScope.$watch('app.layout.asideHover', function (oldVal, newVal) {
            if (newVal === false && oldVal === true) {
                closeAllBut(-1);
            }
        });

        // Check item and children active state
        var isActive = function (item) {

            if (!item) return;

            if (!item.sref || item.sref == '#') {
                var foundActive = false;
                angular.forEach(item.submenu, function (value, key) {
                    if (isActive(value)) foundActive = true;
                });
                return foundActive;
            }
            else
                return $state.is(item.sref) || $state.includes(item.sref);
        };

        // Load menu from json file
        // -----------------------------------

        $scope.getMenuItemPropClasses = function (item) {
            return (item.heading ? 'nav-heading' : '') +
                (isActive(item) ? ' active' : '');
        };

        $scope.loadSidebarMenu = function () {

            var menuJson = 'server/sidebar-menu.json',
                menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache
            $http.get(menuURL)
                .success(function (items) {
                    $rootScope.menuItems = items;
                })
                .error(function (data, status, headers, config) {
                    alert('Failure loading menu');
                });
        };

        $scope.loadSidebarMenu();

        // Handle sidebar collapse items
        // -----------------------------------

        $scope.addCollapse = function ($index, item) {
            collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
        };

        $scope.isCollapse = function ($index) {
            return (collapseList[$index]);
        };

        $scope.toggleCollapse = function ($index, isParentItem) {


            // collapsed sidebar doesn't toggle drodopwn
            if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) return true;

            // make sure the item index exists
            if (angular.isDefined(collapseList[$index])) {
                if (!$scope.lastEventFromChild) {
                    collapseList[$index] = !collapseList[$index];
                    closeAllBut($index);
                }
            }
            else if (isParentItem) {
                closeAllBut(-1);
            }

            $scope.lastEventFromChild = isChild($index);

            return true;

        };

        function closeAllBut(index) {
            index += '';
            for (var i in collapseList) {
                if (index < 0 || index.indexOf(i) < 0)
                    collapseList[i] = true;
            }
        }

        function isChild($index) {
            return (typeof $index === 'string') && !($index.indexOf('-') < 0);
        }
        $rootScope.logout = function () {
            $http.post('/merchant/logout.action');
            $state.go('login');
        }
    }]);
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

/**=========================================================
 * Module: upload.js
 =========================================================*/

App.controller('FileUploadController', ['$scope', '$rootScope', 'FileUploader', '$http', function ($scope, $rootScope, FileUploader, $http) {

    var uploader = $scope.uploader = new FileUploader({
        //url: '/merchant/addmediaResouce.action',
        url: 'http://upload.qiniu.com/',
        queueLimit: 1
    });

    $scope.clear = function () {
        uploader.clearQueue();
    };

    $scope.imgLoaded = function (img) {
        if (img.width > img.height) {
            $scope.direction = 0;
        } else {
            $scope.direction = 1;
        }
        if (!(img.width == 1920 && img.height == 1080)
            && !(img.height == 1920 && img.width == 1080)) {
            $.notify('图片的尺寸不是1920×1080或1080×1920,无法达到最佳效果', {'status': 'danger', pos: 'top-right'});
        }
    };

    $scope.media = {
        name: '',
        note: '',
        second: 10,
        minute: 0
    };

    uploader.onBeforeUploadItem = function (item) {
        item.formData.push({
            token: $scope.token,
            key: $scope.key,
            accept: "text/plain; charset=utf-8"
        });
    };

    uploader.onCompleteItem = function (fileItem, qiniuresponse, status, headers) {
        if (status != 200) {

            $.notify("文件上传服务器失败，请重试！错误代码："+status, {'status': 'danger', pos: 'top-right'});
            $scope.closeThisDialog();
        }

        var showtime = parseInt($scope.media.minute) * 60 + parseInt($scope.media.second);
        var filesize = 0;
        var newname=qiniuresponse.key + qiniuresponse.ext;
        if ($scope.media.type === 'V' || $scope.media.type === 'F') {
            showtime = parseInt(qiniuresponse.avinfo.format.duration) + 1;
            filesize = parseInt(qiniuresponse.avinfo.format.size);
            newname=qiniuresponse.key + ".mp4";
        }
        $http
            .post('/merchant/uploadimagecontinue.action?oldkey=' +
                qiniuresponse.key +
                '&newkey=' + newname+
                '&shotkey=' + $scope.rename +
                '&name=' + $scope.media.name +
                '&type=' + $scope.media.type +
                '&note=' + $scope.media.note +
                '&showtime=' + showtime +
                '&filesize=' + filesize
            )
            .then(
            function (response) {
                if (response.data.status) {
                    if ($scope.media.type === 'A') {
                        $rootScope.foregrounds = response.data.data;
                    } else if ($scope.media.type === 'B') {
                        $rootScope.backgrounds = response.data.data;
                    } else if ($scope.media.type === 'V') {
                        $rootScope.videos = response.data.data;

                    }
                    else if ($scope.media.type === 'F') {
                        $rootScope.fvideos = response.data.data;
                    }
                } else {
                    $
                        .notify(
                            response.data.msg,
                            'danger');
                }
            },
            function (x) {
                $.notify('服务器出了点问题，我们正在处理',
                    'danger');
            });
        $scope.isUploading = '';
        $scope.closeThisDialog();
    };

    uploader.onProgressItem = function (fileItem, progress) {
        $('body').append('<style>.whirl:after{content: "' + progress + '%";}</style>');
    };

    $scope.save = function () {
        if ($scope.media.name == '') {
            $.notify('必须输入名称', {status: 'danger', pos: 'top-right'});
            return;
        }
        if (parseInt($scope.media.minute) != $scope.media.minute
            || parseInt($scope.media.second) != $scope.media.second) {
            $.notify('播放时长必须是整数', {status: 'danger', pos: 'top-right'});
            return;
        }
        if ($scope.media.minute < 0 || $scope.media.second < 0 || $scope.media.second + $scope.media.minute == 0) {
            $.notify('播放时长必须是正数', {status: 'danger', pos: 'top-right'});
            return;
        }
        $scope.media.type = $scope.ngDialogData;
        $http
            .get('/merchant/uploadprepare.action?key=' + $scope.media.name + '&type=' + $scope.media.type)
            .then(
            function (response) {
                if (response.data.status) {
                    $scope.token = response.data.data.token;
                    $scope.key = response.data.data.key;
                    $scope.rename = response.data.data.rename;
                    $scope.isUploading = 'whirl shadow';
                    uploader.uploadAll();
                } else {
                    $
                        .notify(
                            response.data.msg,
                            'danger');
                }
            },
            function (x) {
                $.notify('服务器出了点问题，我们正在处理',
                    'danger');
            });
    };
}]);
/**=========================================================
 * Module: anchor.js
 * Disables null anchor behavior
 =========================================================*/

App.directive('href', function () {

    return {
        restrict: 'A',
        compile: function (element, attr) {
            return function (scope, element) {
                if (attr.ngClick || attr.href === '' || attr.href === '#') {
                    if (!element.hasClass('dropdown-toggle'))
                        element.on('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        });
                }
            };
        }
    };
});

/**=========================================================
 * Module: filestyle.js
 * Initializes the fielstyle plugin
 =========================================================*/

App.directive('filestyle', function () {
    return {
        restrict: 'A',
        controller: ["$scope", "$element", function ($scope, $element) {
            var options = $element.data();

            // old usage support
            options.classInput = $element.data('classinput') || options.classInput;

            $element.filestyle(options);
        }]
    };
});
/**=========================================================
 * Module: fullscreen.js
 * Toggle the fullscreen mode on/off
 =========================================================*/

App.directive('toggleFullscreen', function () {
    'use strict';

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            element.on('click', function (e) {
                e.preventDefault();

                if (screenfull.enabled) {

                    screenfull.toggle();

                    // Switch icon indicator
                    if (screenfull.isFullscreen)
                        $(this).children('em').removeClass('fa-expand').addClass('fa-compress');
                    else
                        $(this).children('em').removeClass('fa-compress').addClass('fa-expand');

                } else {
                    $.error('Fullscreen not enabled');
                }

            });
        }
    };

});


/**=========================================================
 * Module: load-css.js
 * Request and load into the current page a css file
 =========================================================*/

App.directive('loadCss', function () {
    'use strict';

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function (e) {
                if (element.is('a')) e.preventDefault();
                var uri = attrs.loadCss,
                    link;

                if (uri) {
                    link = createLink(uri);
                    if (!link) {
                        $.error('Error creating stylesheet link element.');
                    }
                }
                else {
                    $.error('No stylesheet location defined.');
                }

            });

        }
    };

    function createLink(uri) {
        var linkId = 'autoloaded-stylesheet',
            oldLink = $('#' + linkId).attr('id', linkId + '-old');

        $('head').append($('<link/>').attr({
            'id': linkId,
            'rel': 'stylesheet',
            'href': uri
        }));

        if (oldLink.length) {
            oldLink.remove();
        }

        return $('#' + linkId);
    }


});
/**=========================================================
 * Module: ng-thumb.js
 =========================================================*/

App.directive('ngThumb', ['$window', function ($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function (item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function (file) {
            var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function (scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);
            var imgLoaded = scope.$eval(attributes.imgLoaded);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({width: width, height: height});
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                if (imgLoaded) {
                    imgLoaded(this);
                }
            }
        }
    };
}]);
/**=========================================================
 * Module: notify.js
 * Create a notifications that fade out automatically.
 * Based on Notify addon from UIKit (http://getuikit.com/docs/addons_notify.html)
 =========================================================*/

App.directive('notify', ["$window", function ($window) {

    return {
        restrict: 'A',
        controller: ["$scope", "$element", function ($scope, $element) {

            $element.on('click', function (e) {
                e.preventDefault();
                notifyNow($element);
            });

        }]
    };

    function notifyNow(elem) {
        var $element = $(elem),
            message = $element.data('message'),
            options = $element.data('options');

        if (!message)
            $.error('Notify: No message specified');

        $.notify(message, options || {});
    }


}]);


/**
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */

(function ($, window, document) {

    var containers = {},
        messages = {},

        notify = function (options) {

            if ($.type(options) == 'string') {
                options = { message: options };
            }

            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) == 'string' ? {status: arguments[1]} : arguments[1]);
            }

            return (new Message(options)).show();
        },
        closeAll = function (group, instantly) {
            if (group) {
                for (var id in messages) {
                    if (group === messages[id].group) messages[id].close(instantly);
                }
            } else {
                for (var id in messages) {
                    messages[id].close(instantly);
                }
            }
        };

    var Message = function (options) {

        var $this = this;

        this.options = $.extend({}, Message.defaults, options);

        this.uuid = "ID" + (new Date().getTime()) + "RAND" + (Math.ceil(Math.random() * 100000));
        this.element = $([
            // @geedmo: alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
            '<a class="close">&times;</a>',
            '<div>' + this.options.message + '</div>',
            '</div>'

        ].join('')).data("notifyMessage", this);

        // status
        if (this.options.status) {
            this.element.addClass('alert alert-' + this.options.status);
            this.currentstatus = this.options.status;
        }

        this.group = this.options.group;

        messages[this.uuid] = this;

        if (!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-' + this.options.pos + '"></div>').appendTo('body').on("click", ".uk-notify-message", function () {
                $(this).data("notifyMessage").close();
            });
        }
    };


    $.extend(Message.prototype, {

        uuid: false,
        element: false,
        timout: false,
        currentstatus: "",
        group: false,

        show: function () {

            if (this.element.is(":visible")) return;

            var $this = this;

            containers[this.options.pos].show().prepend(this.element);

            var marginbottom = parseInt(this.element.css("margin-bottom"), 10);

            this.element.css({"opacity": 0, "margin-top": -1 * this.element.outerHeight(), "margin-bottom": 0}).animate({"opacity": 1, "margin-top": 0, "margin-bottom": marginbottom}, function () {

                if ($this.options.timeout) {

                    var closefn = function () {
                        $this.close();
                    };

                    $this.timeout = setTimeout(closefn, $this.options.timeout);

                    $this.element.hover(
                        function () {
                            clearTimeout($this.timeout);
                        },
                        function () {
                            $this.timeout = setTimeout(closefn, $this.options.timeout);
                        }
                    );
                }

            });

            return this;
        },

        close: function (instantly) {

            var $this = this,
                finalize = function () {
                    $this.element.remove();

                    if (!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }

                    delete messages[$this.uuid];
                };

            if (this.timeout) clearTimeout(this.timeout);

            if (instantly) {
                finalize();
            } else {
                this.element.animate({"opacity": 0, "margin-top": -1 * this.element.outerHeight(), "margin-bottom": 0}, function () {
                    finalize();
                });
            }
        },

        content: function (html) {

            var container = this.element.find(">div");

            if (!html) {
                return container.html();
            }

            container.html(html);

            return this;
        },

        status: function (status) {

            if (!status) {
                return this.currentstatus;
            }

            this.element.removeClass('alert alert-' + this.currentstatus).addClass('alert alert-' + status);

            this.currentstatus = status;

            return this;
        }
    });

    Message.defaults = {
        message: "",
        status: "normal",
        timeout: 1000,
        group: null,
        pos: 'top-center'
    };


    $["notify"] = notify;
    $["notify"].message = Message;
    $["notify"].closeAll = closeAll;

    return notify;

}(jQuery, window, document));

/**=========================================================
 * Module panel-tools.js
 * Directive tools to control panels.
 * Allows collapse, refresh and dismiss (remove)
 * Saves panel state in browser storage
 =========================================================*/

App.directive('paneltool', ["$compile", "$timeout", function ($compile, $timeout) {
    var templates = {
        /* jshint multistr: true */
        collapse: "<a href='#' panel-collapse='' data-toggle='tooltip' title='Collapse Panel' ng-click='{{panelId}} = !{{panelId}}' ng-init='{{panelId}}=false'> \
                <em ng-show='{{panelId}}' class='fa fa-plus'></em> \
                <em ng-show='!{{panelId}}' class='fa fa-minus'></em> \
              </a>",
        dismiss: "<a href='#' panel-dismiss='' data-toggle='tooltip' title='Close Panel'>\
               <em class='fa fa-times'></em>\
             </a>",
        refresh: "<a href='#' panel-refresh='' data-toggle='tooltip' data-spinner='{{spinner}}' title='Refresh Panel'>\
               <em class='fa fa-refresh'></em>\
             </a>"
    };

    function getTemplate(elem, attrs) {
        var temp = '';
        attrs = attrs || {};
        if (attrs.toolCollapse)
            temp += templates.collapse.replace(/{{panelId}}/g, (elem.parent().parent().attr('id')));
        if (attrs.toolDismiss)
            temp += templates.dismiss;
        if (attrs.toolRefresh)
            temp += templates.refresh.replace(/{{spinner}}/g, attrs.toolRefresh);
        return temp;
    }

    return {
        restrict: 'E',
        link: function (scope, element, attrs) {

            var tools = scope.panelTools || attrs;

            $timeout(function () {
                element.html(getTemplate(element, tools)).show();
                $compile(element.contents())(scope);

                element.addClass('pull-right');
            });

        }
    };
}])
/**=========================================================
 * Dismiss panels * [panel-dismiss]
 =========================================================*/
    .directive('panelDismiss', ["$q", function ($q) {
        'use strict';
        return {
            restrict: 'A',
            controller: ["$scope", "$element", function ($scope, $element) {
                var removeEvent = 'panel-remove',
                    removedEvent = 'panel-removed';

                $element.on('click', function () {

                    // find the first parent panel
                    var parent = $(this).closest('.panel');

                    removeElement();

                    function removeElement() {
                        var deferred = $q.defer();
                        var promise = deferred.promise;

                        // Communicate event destroying panel
                        $scope.$emit(removeEvent, parent.attr('id'), deferred);
                        promise.then(destroyMiddleware);
                    }

                    // Run the animation before destroy the panel
                    function destroyMiddleware() {
                        if ($.support.animation) {
                            parent.animo({animation: 'bounceOut'}, destroyPanel);
                        }
                        else destroyPanel();
                    }

                    function destroyPanel() {

                        var col = parent.parent();
                        parent.remove();
                        // remove the parent if it is a row and is empty and not a sortable (portlet)
                        col
                            .filter(function () {
                                var el = $(this);
                                return (el.is('[class*="col-"]:not(.sortable)') && el.children('*').length === 0);
                            }).remove();

                        // Communicate event destroyed panel
                        $scope.$emit(removedEvent, parent.attr('id'));

                    }
                });
            }]
        };
    }])
/**=========================================================
 * Collapse panels * [panel-collapse]
 =========================================================*/
    .directive('panelCollapse', ['$timeout', function ($timeout) {
        'use strict';

        var storageKeyName = 'panelState',
            storage;

        return {
            restrict: 'A',
            controller: ["$scope", "$element", function ($scope, $element) {

                // Prepare the panel to be collapsible
                var $elem = $($element),
                    parent = $elem.closest('.panel'), // find the first parent panel
                    panelId = parent.attr('id');

                storage = $scope.$storage;

                // Load the saved state if exists
                var currentState = loadPanelState(panelId);
                if (typeof currentState !== undefined) {
                    $timeout(function () {
                            $scope[panelId] = currentState;
                        },
                        10);
                }

                // bind events to switch icons
                $element.bind('click', function () {

                    savePanelState(panelId, !$scope[panelId]);

                });
            }]
        };

        function savePanelState(id, state) {
            if (!id) return false;
            var data = angular.fromJson(storage[storageKeyName]);
            if (!data) {
                data = {};
            }
            data[id] = state;
            storage[storageKeyName] = angular.toJson(data);
        }

        function loadPanelState(id) {
            if (!id) return false;
            var data = angular.fromJson(storage[storageKeyName]);
            if (data) {
                return data[id];
            }
        }

    }])
/**=========================================================
 * Refresh panels
 * [panel-refresh] * [data-spinner="standard"]
 =========================================================*/
    .directive('panelRefresh', ["$q", function ($q) {
        'use strict';

        return {
            restrict: 'A',
            controller: ["$scope", "$element", function ($scope, $element) {

                var refreshEvent = 'panel-refresh',
                    whirlClass = 'whirl',
                    defaultSpinner = 'standard';


                // catch clicks to toggle panel refresh
                $element.on('click', function () {
                    var $this = $(this),
                        panel = $this.parents('.panel').eq(0),
                        spinner = $this.data('spinner') || defaultSpinner
                        ;

                    // start showing the spinner
                    panel.addClass(whirlClass + ' ' + spinner);

                    // Emit event when refresh clicked
                    $scope.$emit(refreshEvent, panel.attr('id'));

                });

                // listen to remove spinner
                $scope.$on('removeSpinner', removeSpinner);

                // method to clear the spinner when done
                function removeSpinner(ev, id) {
                    if (!id) return;
                    var newid = id.charAt(0) == '#' ? id : ('#' + id);
                    angular
                        .element(newid)
                        .removeClass(whirlClass);
                }
            }]
        };
    }]);

/**=========================================================
 * Module: sidebar.js
 * Wraps the sidebar and handles collapsed state
 =========================================================*/

App.directive('sidebar', ['$rootScope', '$window', 'Utils', function ($rootScope, $window, Utils) {

    var $win = $($window);
    var $body = $('body');
    var $scope;
    var $sidebar;
    var currentState = $rootScope.$state.current.name;

    return {
        restrict: 'EA',
        template: '<nav class="sidebar" ng-transclude></nav>',
        transclude: true,
        replace: true,
        link: function (scope, element, attrs) {

            $scope = scope;
            $sidebar = element;

            var eventName = Utils.isTouch() ? 'click' : 'mouseenter';
            var subNav = $();
            $sidebar.on(eventName, '.nav > li', function () {

                if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) {

                    subNav.trigger('mouseleave');
                    subNav = toggleMenuItem($(this));

                    // Used to detect click and touch events outside the sidebar
                    sidebarAddBackdrop();

                }

            });

            scope.$on('closeSidebarMenu', function () {
                removeFloatingNav();
            });

            // Normalize state when resize to mobile
            $win.on('resize', function () {
                if (!Utils.isMobile())
                    $body.removeClass('aside-toggled');
            });

            // Adjustment on route changes
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                currentState = toState.name;
                // Hide sidebar automatically on mobile
                $('body.aside-toggled').removeClass('aside-toggled');

                $rootScope.$broadcast('closeSidebarMenu');
            });

        }
    };

    function sidebarAddBackdrop() {
        var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop'});
        $backdrop.insertAfter('.aside-inner').on("click mouseenter", function () {
            removeFloatingNav();
        });
    }

    // Open the collapse sidebar submenu items when on touch devices
    // - desktop only opens on hover
    function toggleTouchItem($element) {
        $element
            .siblings('li')
            .removeClass('open')
            .end()
            .toggleClass('open');
    }

    // Handles hover to open items under collapsed menu
    // -----------------------------------
    function toggleMenuItem($listItem) {

        removeFloatingNav();

        var ul = $listItem.children('ul');

        if (!ul.length) return $();
        if ($listItem.hasClass('open')) {
            toggleTouchItem($listItem);
            return $();
        }

        var $aside = $('.aside');
        var $asideInner = $('.aside-inner'); // for top offset calculation
        // float aside uses extra padding on aside
        var mar = parseInt($asideInner.css('padding-top'), 0) + parseInt($aside.css('padding-top'), 0);
        var subNav = ul.clone().appendTo($aside);

        toggleTouchItem($listItem);

        var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
        var vwHeight = $win.height();

        subNav
            .addClass('nav-floating')
            .css({
                position: $scope.app.layout.isFixed ? 'fixed' : 'absolute',
                top: itemTop,
                bottom: (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
            });

        subNav.on('mouseleave', function () {
            toggleTouchItem($listItem);
            subNav.remove();
        });

        return subNav;
    }

    function removeFloatingNav() {
        $('.dropdown-backdrop').remove();
        $('.sidebar-subnav.nav-floating').remove();
        $('.sidebar li.open').removeClass('open');
    }

}]);
/**=========================================================
 * Module: sparkline.js
 * SparkLines Mini Charts
 =========================================================*/

App.directive('sparkline', ['$timeout', '$window', function ($timeout, $window) {

    'use strict';

    return {
        restrict: 'EA',
        controller: ["$scope", "$element", function ($scope, $element) {
            var runSL = function () {
                initSparLine($element);
            };

            $timeout(runSL);
        }]
    };

    function initSparLine($element) {
        var options = $element.data();

        options.type = options.type || 'bar'; // default chart is bar
        options.disableHiddenCheck = true;

        $element.sparkline('html', options);

        if (options.resize) {
            $(window).resize(function () {
                $element.sparkline('html', options);
            });
        }
    }

}]);

/**=========================================================
 * Module: table-checkall.js
 * Tables check all checkbox
 =========================================================*/

App.directive('checkAll', function () {
    'use strict';

    return {
        restrict: 'A',
        controller: ["$scope", "$element", function ($scope, $element) {

            $element.on('change', function () {
                var $this = $(this),
                    index = $this.index() + 1,
                    checkbox = $this.find('input[type="checkbox"]'),
                    table = $this.parents('table');
                // Make sure to affect only the correct checkbox column
                table.find('tbody > tr > td:nth-child(' + index + ') input[type="checkbox"]')
                    .prop('checked', checkbox[0].checked);

            });
        }]
    };

});
/**=========================================================
 * Module: toggle-state.js
 * Toggle a classname from the BODY Useful to change a state that
 * affects globally the entire layout or more than one item
 * Targeted elements must have [toggle-state="CLASS-NAME-TO-TOGGLE"]
 * User no-persist to avoid saving the sate in browser storage
 =========================================================*/

App.directive('toggleState', ['toggleStateService', function (toggle) {
    'use strict';

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var $body = $('body');

            $(element)
                .on('click', function (e) {
                    e.preventDefault();
                    var classname = attrs.toggleState;

                    if (classname) {
                        if ($body.hasClass(classname)) {
                            $body.removeClass(classname);
                            if (!attrs.noPersist)
                                toggle.removeState(classname);
                        }
                        else {
                            $body.addClass(classname);
                            if (!attrs.noPersist)
                                toggle.addState(classname);
                        }

                    }

                });
        }
    };

}]);

/**=========================================================
 * Module: browser.js
 * Browser detection
 =========================================================*/

App.service('browser', function () {
    "use strict";

    var matched, browser;

    var uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(opr)[\/]([\w.]+)/.exec(ua) ||
            /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        var platform_match = /(ipad)/.exec(ua) ||
            /(iphone)/.exec(ua) ||
            /(android)/.exec(ua) ||
            /(windows phone)/.exec(ua) ||
            /(win)/.exec(ua) ||
            /(mac)/.exec(ua) ||
            /(linux)/.exec(ua) ||
            /(cros)/i.exec(ua) ||
            [];

        return {
            browser: match[ 3 ] || match[ 1 ] || "",
            version: match[ 2 ] || "0",
            platform: platform_match[ 0 ] || ""
        };
    };

    matched = uaMatch(window.navigator.userAgent);
    browser = {};

    if (matched.browser) {
        browser[ matched.browser ] = true;
        browser.version = matched.version;
        browser.versionNumber = parseInt(matched.version);
    }

    if (matched.platform) {
        browser[ matched.platform ] = true;
    }

    // These are all considered mobile platforms, meaning they run a mobile browser
    if (browser.android || browser.ipad || browser.iphone || browser[ "windows phone" ]) {
        browser.mobile = true;
    }

    // These are all considered desktop platforms, meaning they run a desktop browser
    if (browser.cros || browser.mac || browser.linux || browser.win) {
        browser.desktop = true;
    }

    // Chrome, Opera 15+ and Safari are webkit based browsers
    if (browser.chrome || browser.opr || browser.safari) {
        browser.webkit = true;
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    if (browser.rv) {
        var ie = "msie";

        matched.browser = ie;
        browser[ie] = true;
    }

    // Opera 15+ are identified as opr
    if (browser.opr) {
        var opera = "opera";

        matched.browser = opera;
        browser[opera] = true;
    }

    // Stock Android browsers are marked as Safari on Android.
    if (browser.safari && browser.android) {
        var android = "android";

        matched.browser = android;
        browser[android] = true;
    }

    // Assign the name and platform variable
    browser.name = matched.browser;
    browser.platform = matched.platform;


    return browser;
});
/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/

App.factory('colors', ['APP_COLORS', function (colors) {

    return {
        byName: function (name) {
            return (colors[name] || '#fff');
        }
    };

}]);

/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

App.provider('RouteHelpers', ['APP_REQUIRES', function (appRequires) {
    "use strict";

    // Set here the base of the relative path
    // for all app views
    this.basepath = function (uri) {
        return 'app/views/' + uri;
    };

    // Generates a resolve object by passing script names
    // previously configured in constant.APP_REQUIRES
    this.resolveFor = function () {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad', '$q', function ($ocLL, $q) {
                // Creates a promise chain for each argument
                var promise = $q.when(1); // empty promise
                for (var i = 0, len = _args.length; i < len; i++) {
                    promise = andThen(_args[i]);
                }
                return promise;

                // creates promise to chain dynamically
                function andThen(_arg) {
                    // also support a function that returns a promise
                    if (typeof _arg == 'function')
                        return promise.then(_arg);
                    else
                        return promise.then(function () {
                            // if is a module, pass the name. If not, pass the array
                            var whatToLoad = getRequired(_arg);
                            // simple error check
                            if (!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                            // finally, return a promise
                            return $ocLL.load(whatToLoad);
                        });
                }

                // check and returns required data
                // analyze module items with the form [name: '', files: []]
                // and also simple array of script files (for not angular js)
                function getRequired(name) {
                    if (appRequires.modules)
                        for (var m in appRequires.modules)
                            if (appRequires.modules[m].name && appRequires.modules[m].name === name)
                                return appRequires.modules[m];
                    return appRequires.scripts && appRequires.scripts[name];
                }

            }]};
    }; // resolveFor

    // not necessary, only used in config block for routes
    this.$get = function () {
    };

}]);
/**=========================================================
 * Module: toggle-state.js
 * Services to share toggle state functionality
 =========================================================*/

App.service('toggleStateService', ['$rootScope', function ($rootScope) {

    var storageKeyName = 'toggleState';

    // Helper object to check for words in a phrase //
    var WordChecker = {
        hasWord: function (phrase, word) {
            return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
        },
        addWord: function (phrase, word) {
            if (!this.hasWord(phrase, word)) {
                return (phrase + (phrase ? ' ' : '') + word);
            }
        },
        removeWord: function (phrase, word) {
            if (this.hasWord(phrase, word)) {
                return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
            }
        }
    };

    // Return service public methods
    return {
        // Add a state to the browser storage to be restored later
        addState: function (classname) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);

            if (!data) {
                data = classname;
            }
            else {
                data = WordChecker.addWord(data, classname);
            }

            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },

        // Remove a state from the browser storage
        removeState: function (classname) {
            var data = $rootScope.$storage[storageKeyName];
            // nothing to remove
            if (!data) return;

            data = WordChecker.removeWord(data, classname);

            $rootScope.$storage[storageKeyName] = angular.toJson(data);
        },

        // Load the state string and restore the classlist
        restoreState: function ($elem) {
            var data = angular.fromJson($rootScope.$storage[storageKeyName]);

            // nothing to restore
            if (!data) return;
            $elem.addClass(data);
        }

    };

}]);
/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

App.service('Utils', ["$window", "APP_MEDIAQUERY", function ($window, APP_MEDIAQUERY) {
    'use strict';

    var $html = angular.element("html"),
        $win = angular.element($window),
        $body = angular.element('body');

    return {
        // DETECTION
        support: {
            transition: (function () {
                var transitionEnd = (function () {

                    var element = document.body || document.documentElement,
                        transEndEventNames = {
                            WebkitTransition: 'webkitTransitionEnd',
                            MozTransition: 'transitionend',
                            OTransition: 'oTransitionEnd otransitionend',
                            transition: 'transitionend'
                        }, name;

                    for (name in transEndEventNames) {
                        if (element.style[name] !== undefined) return transEndEventNames[name];
                    }
                }());

                return transitionEnd && { end: transitionEnd };
            })(),
            animation: (function () {

                var animationEnd = (function () {

                    var element = document.body || document.documentElement,
                        animEndEventNames = {
                            WebkitAnimation: 'webkitAnimationEnd',
                            MozAnimation: 'animationend',
                            OAnimation: 'oAnimationEnd oanimationend',
                            animation: 'animationend'
                        }, name;

                    for (name in animEndEventNames) {
                        if (element.style[name] !== undefined) return animEndEventNames[name];
                    }
                }());

                return animationEnd && { end: animationEnd };
            })(),
            requestAnimationFrame: window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                },
            touch: (
                ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
                    (window.DocumentTouch && document instanceof window.DocumentTouch) ||
                    (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
                    (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
                    false
                ),
            mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
        },
        // UTILITIES
        isInView: function (element, options) {

            var $element = $(element);

            if (!$element.is(':visible')) {
                return false;
            }

            var window_left = $win.scrollLeft(),
                window_top = $win.scrollTop(),
                offset = $element.offset(),
                left = offset.left,
                top = offset.top;

            options = $.extend({topoffset: 0, leftoffset: 0}, options);

            if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
                return true;
            } else {
                return false;
            }
        },
        langdirection: $html.attr("dir") == "rtl" ? "right" : "left",
        isTouch: function () {
            return $html.hasClass('touch');
        },
        isSidebarCollapsed: function () {
            return $body.hasClass('aside-collapsed');
        },
        isSidebarToggled: function () {
            return $body.hasClass('aside-toggled');
        },
        isMobile: function () {
            return $win.width() < APP_MEDIAQUERY.tablet;
        }
    };
}]);