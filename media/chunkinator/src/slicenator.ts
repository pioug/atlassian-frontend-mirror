import { Observable } from 'rxjs/Observable';
import { range } from 'rxjs/observable/range';
import { map } from 'rxjs/operators/map';
import { Slicenator } from './domain';

export const slicenator: Slicenator = (
  blob,
  { size: chunkSize },
): Observable<Blob> => {
  const totalChunks = Math.ceil(blob.size / chunkSize);
  return range(0, totalChunks).pipe(
    map((index) => {
      return blob.slice(index * chunkSize, (index + 1) * chunkSize);
    }),
  );
};
