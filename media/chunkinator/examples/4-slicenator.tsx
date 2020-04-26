import React, { ChangeEvent } from 'react';
import { slicenator } from '../src/slicenator';

const onChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { currentTarget } = e;
  const files = currentTarget.files;
  const observable = slicenator(files![0], { size: 1000 });
  const imageData: Blob[] = [];

  observable.subscribe({
    next(chunk) {
      console.log('chunk', chunk.size);
      imageData.push(chunk);
    },
    complete() {
      const blob = new Blob(imageData, { type: 'image/png' });
      const previewUrl = URL.createObjectURL(blob);
      const img = document.createElement('img');

      img.src = previewUrl;

      document.body.appendChild(img);
    },
  });
};

export default () => {
  <div>
    <input type="file" onChange={onChange} />
  </div>;
};
