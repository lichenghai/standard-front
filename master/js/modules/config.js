
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
                .state('app.social-items', {
                    url: '/social-items',
                    title: '互动管理',
                    templateUrl: helper.basepath('social-items.html'),
                    resolve: helper.resolveFor('print-area'),
                    controller: 'SocialCtrl'
                })
                .state('app.filters', {
                    url: '/filters',
                    title: '审核方式',
                    templateUrl: helper.basepath('filters.html'),
                    controller: 'FiltersCtrl'
                })
                .state('app.ads', {
                    url: '/ads',
                    title: '素材管理',
                    templateUrl: helper.basepath('adsmng.html'),
                    resolve: helper.resolveFor('ngDialog','angularFileUpload',  'filestyle', 'com.2fdevs.videogular',
                        'com.2fdevs.videogular.plugins.controls', 'com.2fdevs.videogular.plugins.overlayplay',
                        'com.2fdevs.videogular.plugins.buffering', 'qiniu-js-sdk'),
                    controller: 'AdsManage'
                })
                .state('app.activities', {
                    url: '/activities',
                    title: '活动管理',
                    templateUrl: helper.basepath('activities.html'),
                    resolve: helper.resolveFor('ngDialog', 'ueditor'),
                    controller: 'ActivityCtrl'
                })

                .state('app.localplay', {
                    url: '/localplay',
                    title: '本地文件播放',
                    templateUrl: helper.basepath('localplay.html'),
                    resolve: helper.resolveFor('xeditable', 'angularBootstrapNavTree'),
                    controller: 'LocalplayController'
                })

                .state('app.display', {
                    url: '/display',
                    title: '播放管理',
                    templateUrl: helper.basepath('display.html'),
                    resolve: helper.resolveFor('xeditable', 'angularBootstrapNavTree', 'ngDialog', 'filestyle', 'com.2fdevs.videogular',
                        'com.2fdevs.videogular.plugins.controls', 'com.2fdevs.videogular.plugins.overlayplay',
                        'com.2fdevs.videogular.plugins.buffering'),
                    controller: 'DisplayController'
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
                .state('app.customerstatistics', {
                    url: '/customerstatistics',
                    title: '关注用户统计',
                    templateUrl: helper.basepath('customerstatistics.html')   ,
                    controller: 'MCustomerstatisticsController'
                })
                .state('app.addbox', {
                    url: '/addbox',
                    title: '添加盒子',
                    templateUrl: helper.basepath('addbox.html'),
                    controller: 'AddboxCtrl'
                })
                .state('app.contact', {
                    url: '/contact',
                    title: '联系我们',
                    templateUrl: helper.basepath('contact.html'),
                    controller: 'ContactCtrl'
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
    function ($q, $rootScope) {
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
    }).config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    })
;

/*
module.exports = {
    'ACCESS_KEY': 'YLbYmVZKcEgV3OL86oRQhnQms-rPhRPN75rKhu8Z',
    'SECRET_KEY': '0xiVQnorAAtluChEIJTSzluEnRfCBqBmXWoSto4F',
    'Bucket_Name': 'media',
    'Port': 19110,
    //'Uptoken_Url': '',
    'Domain': 'http://7xlx4k.com2.z0.glb.qiniucdn.com/'
};*/
