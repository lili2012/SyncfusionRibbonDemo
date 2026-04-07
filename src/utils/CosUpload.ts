import COS from "cos-js-sdk-v5"
import { useUserStore } from "sgcad";
const cos = new COS({
  SecretId: 'AKID9B73ubDnESSGwdCkGbieQ0PceV9awFNQ',
  SecretKey: 'tZ1FF4h7MoBIEwRjpkT4RefcR4VinfKo'
});
const Bucket = 'cad-1412468267';
const Region = 'ap-guangzhou';

export async function upload(file: File, signal: AbortSignal) {
  const readstream = file.stream().pipeThrough(
    new CompressionStream("gzip"),
  );
  const reader = readstream.getReader();
  //gzip后文件不应超过原始文件大小
  let buffer = new ArrayBuffer(file.size, { maxByteLength: file.size });
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

    if (total >= file.size) {
      buffer = await file.arrayBuffer()
      break;
    }

    bufferView.set(value, bytesReceived)
    bytesReceived = total;
  }



  cos.uploadFile({
    Bucket: Bucket,
    Region: Region,
    Key: file.name + '.gz',
    Body: buffer,
    SliceSize: 1024 * 1024, // 大于1mb才进行分块上传
    onTaskReady: (tid) => {
      signal.addEventListener(
        "abort",
        () => {
          cos.cancelTask(tid);
        },
        { once: true },
      );
    },
    onProgress: function (progressData) {
      console.log('上传中', JSON.stringify(progressData));
    },
  }, 
   (err, data)=> {
    if(data.statusCode === 200){
      const userStore = useUserStore()
      userStore.sendText("uploaded", data.Location);
    }
    console.log(err, data);
  });



}