import COS from "cos-js-sdk-v5"
import { Db, UploadService, rpcImpl,Credential } from "sgcad";
import { arrayBuffer2Db } from "@/utils/ParseBuffer"
export const credential = new Credential
let cos: COS| undefined = undefined
export function initializeCos(cred: Credential) {
  cos = new COS({
    SecretId: cred.tmpSecretId,
    SecretKey: cred.tmpSecretKey,
    SecurityToken: cred.tmpToken,
  });
}

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

  const cosFileName = fileName + '.gz'

  const result = await cos?.uploadFile({
    Bucket: Bucket,
    Region: Region,
    Key: cosFileName,
    Body: buffer,
    // Headers: {
    //   'x-cos-meta-sh256': sha256Str,
    // },
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
    const response = await upload.uploadDwg({ filename:fileName, sha256 });
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