import { type Observable } from 'rxjs/Observable';
import { range } from 'rxjs/observable/range';
import { map } from 'rxjs/operators/map';
import { type SlicedBlob, type Slicenator } from './domain';

export const slicenator: Slicenator = (blob, { size: chunkSize }): Observable<SlicedBlob> => {
	const totalChunks = Math.ceil(blob.size / chunkSize);
	return range(0, totalChunks).pipe(
		map((index) => {
			return {
				partNumber: index + 1,
				blob: blob.slice(index * chunkSize, (index + 1) * chunkSize),
			};
		}),
	);
};
