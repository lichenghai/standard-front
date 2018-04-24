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
