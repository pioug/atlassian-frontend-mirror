import React, { ChangeEvent } from 'react';
import { map } from 'rxjs/operators/map';
import { slicenator } from '../src/slicenator';
import { probinator } from '../src/probinator';
import { HashedBlob } from '../src/domain';

const createHash = (blob: Blob) => {
  console.log('createHash', blob.size);

  return {
    blob,
    hash: performance.now().toString(),
  };
};
const prober = (hashedBlobs: HashedBlob[]) => {
  const exists = true;

  console.log('hashedBlobs.length', hashedBlobs.length);
  return Promise.resolve(hashedBlobs.map(() => exists));
};

const onChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { currentTarget } = e;
  const files = currentTarget.files;
  const observable = slicenator(files![0], { size: 1000 }).pipe(
    map(createHash),
  );

  const probinatedBlobs = probinator(observable, {
    batchSize: 3,
    prober,
  });

  probinatedBlobs.subscribe();
};

export default () => (
  <div>
    <input type="file" onChange={onChange} />
  </div>
);
