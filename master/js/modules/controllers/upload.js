
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