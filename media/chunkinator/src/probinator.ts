import { Observable } from 'rxjs/Observable';
import { bufferCount } from 'rxjs/operators/bufferCount';
import { concatMap } from 'rxjs/operators/concatMap';
import { from } from 'rxjs/observable/from';
import { HashedBlob, ProbedBlob, ProbingFunction } from './domain';

export interface ProbinatorOptions {
  readonly batchSize: number;
  readonly prober: ProbingFunction;
}

export function probinator(
  hashedBlob$: Observable<HashedBlob>,
  { batchSize, prober }: ProbinatorOptions,
): Observable<ProbedBlob> {
  return hashedBlob$.pipe(
    bufferCount(batchSize),
    concatMap((hashedBlobs) =>
      prober(hashedBlobs).then((probes) =>
        hashedBlobs.map((hashedBlob, index) => ({
          ...hashedBlob,
          exists: probes[index],
        })),
      ),
    ),
    concatMap((probedBlobs) => from(probedBlobs)),
  );
}
