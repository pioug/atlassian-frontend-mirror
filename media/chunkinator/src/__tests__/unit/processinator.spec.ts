import { processinator } from '../../processinator';
import { ProbedBlob } from '../../domain';
import { from } from 'rxjs/observable/from';
import { toArray } from 'rxjs/operators/toArray';

describe('processinator', () => {
  it('should process blobs in batches', async () => {
    const probedChunks: ProbedBlob[] = [
      { blob: new Blob(), hash: 'foo', exists: true, partNumber: 1 },
      { blob: new Blob(), hash: 'bar', exists: false, partNumber: 2 },
      { blob: new Blob(), hash: 'baz', exists: false, partNumber: 3 },
    ];
    const processor = jest.fn();
    processor.mockReturnValue(Promise.resolve());

    const results = await processinator(from(probedChunks), {
      batchSize: 2,
      processor,
    })
      .pipe(toArray())
      .toPromise();

    expect(results).toHaveLength(2);
    expect(processor).toHaveBeenCalledTimes(2);
    expect(processor.mock.calls[0][0]).toEqual([
      probedChunks[0],
      probedChunks[1],
    ]);
    expect(processor.mock.calls[1][0]).toEqual([probedChunks[2]]);
  });
});
