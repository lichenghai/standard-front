/**=========================================================
 * Module: access-login.js
 =========================================================*/

App.controller('LoginFormController', ['$scope', '$rootScope', '$http', '$state', function ($scope,$rootScope, $http, $state) {

    $scope.account = {};
    $scope.authMsg = '';

    $scope.login = function () {
        $scope.authMsg = '';
 //       $state.go('app.account');

       $http
            .post('/apis/person/login?account=' + $scope.account.username + '&password=' + $scope.account.password)
            .then(function (response) {
                if (response.data.status!=200) {
                    $scope.authMsg = response.data.message;
                } else {
                    $state.go('app.account');
                };
            }, function (x) {
                $scope.authMsg = '服务器出了点问题，我们正在处理';
            });
    };

}]);
