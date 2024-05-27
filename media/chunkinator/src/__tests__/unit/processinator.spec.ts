import { processinator } from '../../processinator';
import { type HashedBlob } from '../../domain';
import { from } from 'rxjs/observable/from';
import { toArray } from 'rxjs/operators/toArray';

describe('processinator', () => {
  it('should process blobs in batches', async () => {
    const chunks: HashedBlob[] = [
      { blob: new Blob(), hash: 'foo', partNumber: 1 },
      { blob: new Blob(), hash: 'bar', partNumber: 2 },
      { blob: new Blob(), hash: 'baz', partNumber: 3 },
    ];
    const processor = jest.fn();
    processor.mockReturnValue(Promise.resolve());

    const results = await processinator(from(chunks), {
      batchSize: 2,
      processor,
    })
      .pipe(toArray())
      .toPromise();

    expect(results).toHaveLength(2);
    expect(processor).toHaveBeenCalledTimes(2);
    expect(processor.mock.calls[0][0]).toEqual([chunks[0], chunks[1]]);
    expect(processor.mock.calls[1][0]).toEqual([chunks[2]]);
  });
});
