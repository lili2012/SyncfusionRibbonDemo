import { Db } from 'sgcad'
import { useUserStore } from 'sgcad'
export async function FetchDrawing(url: string): Promise<Db | undefined> {
    //const url = "http://localhost:3000/S70-04 通信电缆敷设图.dxf.pb"
    //const url = "http://192.168.1.101:3000/Drawing4.dxf.pb"
    //const url = "http://localhost:3000/Drawing4.dxf.pb"
    const userStore = useUserStore()
    const response = await fetch(url)
    if (response.ok) {
        userStore.sendText("open", url)
        const arrayBuffer = await response.arrayBuffer()
        const u8array = new Uint8Array(arrayBuffer)
        const protobufjsdb: Db = Db.decode(u8array, u8array.byteLength);
        return protobufjsdb
    }
    return undefined
}