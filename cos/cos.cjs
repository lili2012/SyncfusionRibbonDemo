var COS = require('cos-nodejs-sdk-v5');
var util = require('./util.cjs');
var pathLib = require('path');
// 创建实例
var cos = new COS({
  SecretId: 'AKID9B73ubDnESSGwdCkGbieQ0PceV9awFNQ',
  SecretKey: 'tZ1FF4h7MoBIEwRjpkT4RefcR4VinfKo'
});

// 存储桶名称，由bucketname-appid 组成，appid必须填入，可以在COS控制台查看存储桶名称。 https://console.cloud.tencent.com/cos5/bucket
var Bucket = 'cad-1412468267';
// 存储桶Region可以在COS控制台指定存储桶的概览页查看 https://console.cloud.tencent.com/cos5/bucket/
// 关于地域的详情见 https://cloud.tencent.com/document/product/436/6224
var Region = 'ap-guangzhou';


/* 删除指定文件夹下的所有对象（删除存储桶里指定前缀所有对象） */
function deleteFolder() {
  var _deleteFolder = function (params, callback) {
    var deletedList = [];
    var errorList = [];
    var marker;
    var next = function () {
      params.Marker = marker;
      cos.getBucket(params, function (err, data) {
        if (err) return callback(err);
        var Objects = [];
        if (data && data.Contents && data.Contents.length) {
          data.Contents.forEach(function (item) {
            Objects.push({ Key: item.Key });
          });
        }
        var afterDeleted = function () {
          if (data.IsTruncated === 'true') {
            marker = data.NextMarker;
            next();
          } else {
            callback(null, { Deleted: deletedList, Error: errorList });
          }
        };
        if (Objects.length) {
          cos.deleteMultipleObject(
            {
              Bucket: params.Bucket,
              Region: params.Region,
              Objects: Objects,
            },
            function (err, data) {
              data.Deleted &&
                data.Deleted.forEach(function (item) {
                  deletedList.push(item);
                });
              data.Error &&
                data.Error.forEach(function (item) {
                  errorList.push(item);
                });
              afterDeleted();
            }
          );
        } else {
          afterDeleted();
        }
      });
    };
    next();
  };
  _deleteFolder(
    {
      Bucket: Bucket,
      Region: Region,
      Prefix: 'assets/', // 要列出的目录前缀
    },
    function (err, data) {
      console.log(err || data);
    }
  );
}

/* 上传本地文件夹 */
function uploadFolder() {
  var localFolder = pathLib.resolve(__dirname, '../dist/assets');
  var remotePrefix = '/assets/';
  util.fastListFolder(localFolder, function (err, list) {
    if (err) return console.error(err);
    var files = list.map(function (file) {
      var filename = pathLib.relative(localFolder, file.path).replace(/\\/g, '/');
      if (filename && file.isDir && !filename.endsWith('/')) filename += '/';
      var Key = remotePrefix + filename;
      return {
        Bucket: Bucket,
        Region: Region,
        Key: Key,
        FilePath: file.path,
      };
    });
    cos.uploadFiles(
      {
        files: files,
        SliceSize: 1024 * 1024,
        onProgress: function (info) {
          var percent = Math.floor(info.percent * 10000) / 100;
          var speed = Math.floor((info.speed / 1024 / 1024) * 100) / 100;
          console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
        },
        onFileFinish: function (err, data, options) {
          console.log(options.Key + ' 上传' + (err ? '失败' : '完成'));
        },
      },
      function (err, data) {
        console.log(err || data);
      }
    );
  });
}

deleteFolder();
uploadFolder()
// 高级上传
var indexFile = pathLib.resolve(__dirname, '../dist/index.html');
cos.uploadFile(
  {
    Bucket: Bucket,
    Region: Region,
    Key: 'index.html',
    FilePath: indexFile, // 本地文件地址，需自行替换
    SliceSize: 1024 * 1024 * 5, // 触发分块上传的阈值，超过5MB使用分块上传，非必须
  },
  function (err, data) {
    console.log(err, data);
  }
);