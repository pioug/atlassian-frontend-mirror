import React, { type ChangeEvent } from 'react';
import { slicenator } from '../src/slicenator';

const onChange = (e: ChangeEvent<HTMLInputElement>) => {
	const { currentTarget } = e;
	const files = currentTarget.files;
	const observable = slicenator(files![0], { size: 1000 });
	const imageData: Blob[] = [];

	observable.subscribe({
		next(slicedBlob) {
			console.log('chunk', slicedBlob.blob.size);
			imageData.push(slicedBlob.blob);
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

export default (): void => {
	<div>
		<input type="file" onChange={onChange} />
	</div>;
};
