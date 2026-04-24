import { useUserStore } from "sgcad";
import { cosUpload } from "./Cos"
import { genSha256 } from "@/utils/sha256"
import { Db, UploadService, rpcImpl } from "sgcad";
export const fileUpload = async (file: File, signal: AbortSignal) => {

  // const name = file.name
  // const LastModified = file.lastModified
  // const length = file.size
  // const etag = LastModified.toString(16) + '-' + length.toString(16)
  // const userStore = useUserStore()
  // const hasFile = await userStore.sendText("hasFile", name + '-' + etag)
  // //compress file
  // if (!hasFile) {
  //   const stream = file.stream()
  //   const compressedReadableStream = stream.pipeThrough(new CompressionStream("brotli"));
  //   //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  //   const controller = new AbortController();
  //   const response = await fetch("https://example.org/post", {
  //     method: "POST",
  //     body: compressedReadableStream,
  //     signal: controller.signal,
  //   });
  // }
  // //获取文件.pb.br文件


  //do frontend cache

  //do backend has
  const arrayBuffer = await file.arrayBuffer();
  const sha256 = await genSha256(arrayBuffer);
  const filename = file.name
  const upload = new UploadService(rpcImpl, false, false);
  const response = await upload.getFile({ filename,  sha256});

  cosUpload(arrayBuffer, filename, sha256,  signal)





}


