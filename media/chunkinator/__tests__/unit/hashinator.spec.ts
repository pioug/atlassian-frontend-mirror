import { toArray } from 'rxjs/operators/toArray';
import { of } from 'rxjs/observable/of';
import { HashedBlob } from '../../src/domain';
import {
  hashinator,
  blobToHashedBlob,
  defaultHasher,
} from '../../src/hashinator';

(global as any).window.crypto = {
  subtle: {
    digest: jest.fn(),
  },
};

function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length); // 2 bytes for each char
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function mockNextDigest(input: string) {
  let buffer = new Uint8Array(str2ab(input)).buffer;
  (crypto.subtle.digest as jest.Mock).mockReturnValueOnce(buffer);
}

describe('Hashinator', () => {
  beforeEach(() => {
    (crypto.subtle.digest as jest.Mock).mockReset();
  });

  describe('#blobToHashedBlob', () => {
    it('should convert blob to hashed blob', () => {
      const blob = new Blob(['1234567890']);
      mockNextDigest('1234567890');
      return blobToHashedBlob(defaultHasher)(blob).then((hashedBlob) => {
        expect(hashedBlob).toEqual({
          blob,
          hash: '31323334353637383930-10',
        });
      });
    });
  });

  it('should hash chunks', () => {
    const expectedHashedBlobs: HashedBlob[] = [
      {
        blob: new Blob(['1234567890']),
        hash: '31323334353637383930-10',
      },
      {
        blob: new Blob(['0987654321']),
        hash: '30393837363534333231-10',
      },
      {
        blob: new Blob(['qwertyuiop']),
        hash: '71776572747975696f70-10',
      },
      {
        blob: new Blob(['asdfghjkl;']),
        hash: '6173646667686a6b6c3b-10',
      },
      {
        blob: new Blob(['zxcvbnm,./']),
        hash: '7a786376626e6d2c2e2f-10',
      },
    ];

    mockNextDigest('1234567890');
    mockNextDigest('0987654321');
    mockNextDigest('qwertyuiop');
    mockNextDigest('asdfghjkl;');
    mockNextDigest('zxcvbnm,./');

    const blobs = expectedHashedBlobs.map((hashedBlob) => hashedBlob.blob);
    const actualObservable = hashinator(of(...blobs), {
      concurrency: 2,
    });
    return actualObservable
      .pipe(toArray<HashedBlob>())
      .toPromise()
      .then((actualHashedBlobs) => {
        expect(actualHashedBlobs).toEqual(expectedHashedBlobs);
      });
  });
});
