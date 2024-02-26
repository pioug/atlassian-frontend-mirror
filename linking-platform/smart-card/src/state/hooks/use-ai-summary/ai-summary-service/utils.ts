export async function* readStream<T>(response: Response): AsyncGenerator<T> {
  const reader = getBufferReader(response);
  let doneStreaming = false;
  let chunkBuffer = '';
  do {
    try {
      const { value, done } = await reader.read();

      doneStreaming = done;

      if (value) {
        try {
          const processedChunks = `${chunkBuffer}${value}`.split('\n'); // assumes that all JSON chunks are separated by a new-line;

          chunkBuffer = '';
          for (let chunk of processedChunks) {
            try {
              yield JSON.parse(chunk);
            } catch (e) {
              // the chunk may be incomplete, so we'll save it for the next iteration.
              chunkBuffer = chunk;
            }
          }
        } catch (e) {
          const error = new Error(`Error Processing Stream Data: ${value}`);
          throw error;
        }
      }
    } catch (e) {
      // If we abort the call, this exception bubbles up, so we want to catch it and exit gracefully
      if (e instanceof DOMException && e.name === 'AbortError') {
        doneStreaming = true;
      } else {
        throw e;
      }
    }
  } while (!doneStreaming);
  if (chunkBuffer) {
    const error = new Error(`Not all the data was processed: ${chunkBuffer}`);
    throw error;
  }
}

export const getBufferReader = (
  response: Response,
): ReadableStreamDefaultReader<string> => {
  if (!response.body) {
    throw new Error('Response body is empty');
  }
  return response.body.pipeThrough(new TextDecoderStream()).getReader();
};

export const addPath = (baseUrl: string, path: string) => {
  const urlWithTrailingSlash = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const pathWithoutLeadingSlash = !path.startsWith('/')
    ? path
    : path.substring(1, path.length);
  const url = [urlWithTrailingSlash, pathWithoutLeadingSlash].join('');
  return url;
};
