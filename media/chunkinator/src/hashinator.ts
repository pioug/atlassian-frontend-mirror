import { asyncMap } from 'rxjs-async-map';

import { HashedBlob, Hashinator, HashingFunction } from './domain';

function arrayBufferToHex(buffer: ArrayBuffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x: number) =>
      ('00' + x.toString(16)).slice(-2),
    )
    .join('');
}

function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  const fileReader = new FileReader();

  return new Promise<ArrayBuffer>((resolve, reject) => {
    fileReader.onload = function () {
      resolve(this.result as ArrayBuffer);
    };
    fileReader.onerror = reject;

    fileReader.readAsArrayBuffer(blob);
  });
}

export const defaultHasher: HashingFunction = (blob) => {
  return blobToArrayBuffer(blob)
    .then((arrayBuffer) => crypto.subtle.digest('SHA-1', arrayBuffer))
    .then(arrayBufferToHex);
};

export const blobToHashedBlob = (hasher: HashingFunction) => (
  blob: Blob,
): Promise<HashedBlob> =>
  hasher(blob).then((hash) => ({ blob, hash: `${hash}-${blob.size}` }));

export const hashinator: Hashinator = (blobs$, { hasher, concurrency }) =>
  asyncMap(blobToHashedBlob(hasher || defaultHasher), concurrency)(blobs$);
