
export default async function stream2buffer(stream: any): Promise<Buffer> {

    const buffers = [];

    // node.js readable streams implement the async iterator protocol
    for await (const data of stream) {
        buffers.push(data);
    }

    const finalBuffer = Buffer.concat(buffers);

    return finalBuffer
} 