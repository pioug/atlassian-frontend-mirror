import React, { ChangeEvent } from 'react';
import { map } from 'rxjs/operators/map';
import { slicenator } from '../src/slicenator';
import { probinator } from '../src/probinator';
import { HashedBlob, SlicedBlob } from '../src/domain';

const createHash = (slicedBlob: SlicedBlob) => {
  console.log('createHash', slicedBlob.blob.size);

  return {
    blob: slicedBlob.blob,
    hash: performance.now().toString(),
    partNumber: slicedBlob.partNumber,
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
