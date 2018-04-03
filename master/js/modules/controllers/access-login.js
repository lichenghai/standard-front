/**=========================================================
 * Module: access-login.js
 =========================================================*/

App.controller('LoginFormController', ['$scope', '$http', '$state', function ($scope, $http, $state) {

    $scope.account = {};
    $scope.authMsg = '';

    $scope.login = function () {
        $scope.authMsg = '';
 //       $state.go('app.account');

       $http
            .post('/nongyequan-server/login?username=' + $scope.account.username + '&password=' + $scope.account.password)
            .then(function (response) {
                if (!response.data.status) {
                    $scope.authMsg = response.data.message;
                } else {
                    $state.go('app.social-items');
                };
                 $state.go('app.account');
            }, function (x) {
                $scope.authMsg = '服务器出了点问题，我们正在处理';
            });
    };

}]);
