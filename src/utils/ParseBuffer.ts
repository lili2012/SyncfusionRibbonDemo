import { Db } from 'sgcad'

export function arrayBuffer2Db(buffer: ArrayBuffer): Db {
    const u8array = new Uint8Array(buffer)
    const protobufjsdb: Db = Db.decode(u8array, u8array.byteLength);
    return protobufjsdb
}