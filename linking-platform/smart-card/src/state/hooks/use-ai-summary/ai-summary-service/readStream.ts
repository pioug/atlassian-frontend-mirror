import { getBufferReader } from './utils';
export async function* readStream<T>(response: Response): AsyncGenerator<T> {
  const reader = getBufferReader(response);
  let doneStreaming = false;
  let chunkBuffer = '';
  const chunkTypeErrorMessage = 'jsonChunkType error';
  do {
    try {
      const { value, done } = await reader.read();

      doneStreaming = done;

      if (value) {
        const processedChunks = `${chunkBuffer}${value}`.split('\n'); // assumes that all JSON chunks are separated by a new-line;

        chunkBuffer = '';
        for (let chunk of processedChunks) {
          try {
            const jsonChunk = JSON.parse(chunk);
            if (jsonChunk.type === 'ERROR') {
              throw new Error(chunkTypeErrorMessage);
            }
            yield jsonChunk;
          } catch (e) {
            if (e instanceof Error && e.message === chunkTypeErrorMessage) {
              throw e;
            }
            // the chunk may be incomplete, so we'll save it for the next iteration.
            chunkBuffer = chunk;
          }
        }
      }
    } catch (e) {
      // If we abort the call, this exception bubbles up, so we want to catch it and exit gracefully
      if (e instanceof DOMException && e.name === 'AbortError') {
        doneStreaming = true;
      } else {
        reader.cancel();
        throw e;
      }
    }
  } while (!doneStreaming);
  if (chunkBuffer) {
    const error = new Error(`Not all the data was processed: ${chunkBuffer}`);
    throw error;
  }
}
