import React, { type ChangeEvent } from 'react';
import { map } from 'rxjs/operators/map';
import { slicenator } from '../src/slicenator';
import { type SlicedBlob } from '../src/domain';

const createHash = (slicedBlob: SlicedBlob) => {
	console.log('createHash', slicedBlob.blob.size);

	return {
		blob: slicedBlob.blob,
		hash: performance.now().toString(),
		partNumber: slicedBlob.partNumber,
	};
};

const onChange = (e: ChangeEvent<HTMLInputElement>) => {
	const { currentTarget } = e;
	const files = currentTarget.files;
	const observable = slicenator(files![0], { size: 1000 }).pipe(map(createHash));

	observable.subscribe();
};

export default (): React.JSX.Element => (
	<div>
		<input type="file" onChange={onChange} />
	</div>
);
