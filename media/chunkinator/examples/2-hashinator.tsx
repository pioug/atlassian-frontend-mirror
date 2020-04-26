import React, { ChangeEvent } from 'react';
import { hashinator } from '../src/hashinator';
import { slicenator } from '../src/slicenator';
import { HashedBlob } from '../src/domain';

const onChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { currentTarget } = e;
  const files = currentTarget.files;
  const blobsObservable = slicenator(files![0], { size: 10 });
  const hashedBlobsObservable = hashinator(blobsObservable, {
    concurrency: 2,
  });

  const ul = document.createElement('ul');
  window.document.body.appendChild(ul);
  hashedBlobsObservable.subscribe({
    next(hashedBlob: HashedBlob) {
      const li = document.createElement('li');
      li.innerText = hashedBlob.hash;
      ul.appendChild(li);
    },
  });
};

export default () => (
  <div>
    <input type="file" onChange={onChange} />
    It should be:
    <ul>
      <li>
        c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646-10
      </li>
      <li>
        17756315ebd47b7110359fc7b168179bf6f2df3646fcc888bc8aa05c78b38ac1-10
      </li>
      <li>
        9a900403ac313ba27a1bc81f0932652b8020dac92c234d98fa0b06bf0040ecfd-10
      </li>
      <li>
        f19a5201780e4463db341b02889255fe5a310a5c6a3267440ea6811b3bb33616-10
      </li>
      <li>
        f003b373f910f86ad3c021a11b54aceaed7441feabc8cd041cdce572c472d2d0-10
      </li>
    </ul>
    <br />
    And Actually is:
  </div>
);
