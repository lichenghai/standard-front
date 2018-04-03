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