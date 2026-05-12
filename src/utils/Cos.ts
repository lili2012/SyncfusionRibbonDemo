import COS from "cos-js-sdk-v5"
import { Db, UploadService, rpcImpl, Credential } from "sgcad";
import { arrayBuffer2Db } from "@/utils/ParseBuffer"
import { ip } from "sgcad"
export const credential = new Credential
const cos = new COS({
  getAuthorization: function (options, callback) {
    // 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
    // 异步获取临时密钥
    // 服务端 JS 示例：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
    // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
    // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048
    const url = 'https://' + ip + ':8000/getKeyAndCredentials'; // url 替换成您自己的后端服务
    const xhr = new XMLHttpRequest();
    let data: any = null;
    let credentials: any = null;
    xhr.open('GET', url, true);
    xhr.onload = function (e: ProgressEvent<EventTarget>) {
      try {
        data = JSON.parse(xhr.responseText);
        credentials = data.credentials;
      } catch (e) {
      }
      if (!data || !credentials) {
        return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
      };
      // 检查credentials格式
      //console.log(credentials);
      callback({
        TmpSecretId: credentials.tmpSecretId,
        TmpSecretKey: credentials.tmpSecretKey,
        SecurityToken: credentials.sessionToken,
        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
        ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
      });
    };
    xhr.send();
  }
});


const Bucket = 'drawings-1412468267';
const Region = 'ap-guangzhou';


export async function cosUpload(arrayBuffer: ArrayBuffer, fileName: string, sha256: string, signal: AbortSignal): Promise<string | undefined> {

  const stream = new Blob([arrayBuffer]).stream();
  const readstream = stream.pipeThrough(
    new CompressionStream("gzip"),
  );
  const reader = readstream.getReader();
  //gzip后文件不应超过原始文件大小
  let buffer = new ArrayBuffer(arrayBuffer.byteLength, { maxByteLength: arrayBuffer.byteLength });
  const bufferView = new Uint8Array(buffer)
  let bytesReceived = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (signal.aborted)
      return
    if (done) {
      console.log(value)
      buffer = buffer.slice(0, bytesReceived)
      break;
    }

    const total = bytesReceived + value.byteLength

    if (total >= arrayBuffer.byteLength) {
      buffer = arrayBuffer
      break;
    }

    bufferView.set(value, bytesReceived)
    bytesReceived = total;
  }

  //const filename = fileName + '.gz'
  const result = await cos.uploadFile({
    Bucket: Bucket,
    Region: Region,
    Key: sha256 + '.gz',
    Body: buffer,
    Headers: {
      'x-cos-meta-name':encodeURIComponent(fileName),
    },
    SliceSize: 1024 * 1024, // 大于1mb才进行分块上传
    onTaskReady: (tid) => {
      signal.addEventListener(
        "abort",
        () => {
          cos?.cancelTask(tid);
        },
        { once: true },
      );
    },
    onProgress: function (progressData) {
      console.log('上传中', JSON.stringify(progressData));
    },
  });

  if (result?.statusCode === 200) {
    const upload = new UploadService(rpcImpl, false, false);
    const response = await upload.uploadDwg({ filename: fileName, sha256 });
    const pbfile = response.filename
    return pbfile
  }
  return undefined
}

export async function cosDownload(pbfile: string): Promise<Db | undefined> {
  const requestResult: COS.RequestResult | undefined = await cos?.getObject({
    Bucket: Bucket, Region: Region, Key: pbfile, DataType: 'arraybuffer', onProgress: function (progressData) {
      console.log(JSON.stringify(progressData));
    }
  });
  if (requestResult?.statusCode === 200) {
    const body = requestResult.Body
    if (body instanceof ArrayBuffer) {
      const db = arrayBuffer2Db(body)
      return db;

    }
  }
  return undefined;
}