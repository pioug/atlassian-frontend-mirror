import { getBufferReader } from '../utils';
import { readStream } from '../readStream';

jest.mock('../utils', () => ({
  getBufferReader: jest.fn(),
}));
const getBufferReaderMock = getBufferReader as jest.MockedFunction<
  typeof getBufferReader
>;

type Chunk = { content: string };

const isChunk = (chunk: unknown): chunk is Chunk =>
  typeof chunk === 'object' && chunk !== null && 'content' in chunk;

const textArray = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  'Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec,',
  'ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa,',
  'varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy',
];

/**
 * Creates a buffer of stringified chunks of type Chunk, based on textArray array, separated by “new line“ character.
 * This buffer is split into fragments of equal size, except for the last one.
 * the returned reader extracts from the buffer a new fragment from the start on every read call.
 */
const createReader = (fragmentCount: number) => {
  const bufferChunkBits = textArray
    .map((text) => `${JSON.stringify({ content: text })}\n`) // array of chunks + new-line
    .join('') // one big string
    .split(''); // array of all characters

  const chunkSize = Math.floor(bufferChunkBits.length / fragmentCount);
  const lastChunkSize = bufferChunkBits.length % fragmentCount;

  return {
    read: () => {
      const isLastChunk = bufferChunkBits.length === lastChunkSize;

      // extracts a string with fragments of chunks
      const value = isLastChunk
        ? bufferChunkBits.splice(0, lastChunkSize).join('')
        : bufferChunkBits.splice(0, chunkSize).join('');

      const done = isLastChunk ? true : false;

      // sends the fragment to the reader
      return { value, done };
    },
  } as any as ReadableStreamDefaultReader<string>;
};

describe('readStream', () => {
  it.each([1, 2, 3, 5, 8])(
    'parses the streaming json fragments into objects (%s fragments)',
    async (chunkCount) => {
      getBufferReaderMock.mockImplementationOnce(() =>
        createReader(chunkCount),
      );
      const generator = readStream<Chunk>({ body: {} } as Response);

      let i = 0;
      for await (const chunk of generator) {
        expect(isChunk(chunk)).toBe(true);
        expect(chunk.content).toEqual(textArray[i]);
        i++;
      }
      // the generator should yield the same amount of chunks as text array length
      expect(i).toBe(textArray.length);
    },
  );
});
