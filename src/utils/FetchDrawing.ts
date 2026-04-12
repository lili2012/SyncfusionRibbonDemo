import { Db } from 'sgcad'
import { arrayBuffer2Db } from "@/utils/ParseBuffer"
//import { useUserStore } from 'sgcad'
export async function FetchDrawing(url: string): Promise<Db | undefined> {
    //const url = "http://localhost:3000/S70-04 通信电缆敷设图.dxf.pb"
    //const url = "http://192.168.1.101:3000/Drawing4.dxf.pb"
    //const url = "http://localhost:3000/Drawing4.dxf.pb"
    //const userStore = useUserStore()
    const response = await fetch(url)
    if (response.ok) {
        //userStore.sendText("open", url)
        const arrayBuffer = await response.arrayBuffer()
        const db = arrayBuffer2Db(arrayBuffer)
        return db
    }
    return undefined
}