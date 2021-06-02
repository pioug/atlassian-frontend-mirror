import MockDate from 'mockdate';
import { uploadinator } from '../../src/uploadinator';
import { empty } from 'rxjs/observable/empty';
import { toArray } from 'rxjs/operators/toArray';
import { from } from 'rxjs/observable/from';

const delayPromise = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

describe('Uploadinator', () => {
  it('returns empty observable for empty input', async () => {
    const output = await uploadinator(empty(), {
      concurrency: 0,
      uploader: () => Promise.resolve(),
    })
      .pipe(toArray())
      .toPromise();

    expect(output).toEqual([]);
  });

  it('invokes uploader for all non-existing chunks', async () => {
    const probedChunks = [
      { blob: new Blob(), hash: 'foo', exists: true },
      { blob: new Blob(), hash: 'bar', exists: false },
      { blob: new Blob(), hash: 'baz', exists: false },
    ];

    const uploader = jest.fn(() => Promise.resolve());

    const output = await uploadinator(from(probedChunks), {
      concurrency: 1,
      uploader,
    })
      .pipe(toArray())
      .toPromise();

    expect(output).toEqual([probedChunks[0], probedChunks[1], probedChunks[2]]);
    expect(uploader).toHaveBeenCalledTimes(2);
    expect(uploader).toHaveBeenCalledWith(probedChunks[1]);
    expect(uploader).toHaveBeenCalledWith(probedChunks[2]);
  });

  it('returns chunks in-order even if promises resolve out of order', async () => {
    const probedChunks = [
      { blob: new Blob(), hash: 'foo', exists: false },
      { blob: new Blob(), hash: 'bar', exists: false },
    ];

    const uploader = jest.fn().mockImplementation((chunk) => {
      if (chunk.hash === 'foo') {
        return delayPromise(200);
      } else {
        return delayPromise(100);
      }
    });

    const output = await uploadinator(from(probedChunks), {
      concurrency: 2,
      uploader,
    })
      .pipe(toArray())
      .toPromise();

    expect(output).toEqual(probedChunks);
  });

  it('invokes parallel batches of N uploads, sequentially', async () => {
    MockDate.reset();
    const probedChunks = [
      { blob: new Blob(), hash: 'foo', exists: false },
      { blob: new Blob(), hash: 'bar', exists: false },
      { blob: new Blob(), hash: 'baz', exists: false },
    ];

    const invocations = new Array<{ ts: number; hash: string }>();

    const uploader = jest.fn().mockImplementation((chunk) => {
      invocations.push({ ts: Date.now(), hash: chunk.hash });
      return delayPromise(10);
    });

    await uploadinator(from(probedChunks), {
      concurrency: 2,
      uploader,
    })
      .pipe(toArray())
      .toPromise();

    expect(invocations[0].hash).toBe('foo');
    expect(invocations[1].hash).toBe('bar');
    expect(invocations[2].hash).toBe('baz');
    expect(invocations[2].ts).toBeGreaterThan(invocations[0].ts);
    expect(invocations[2].ts).toBeGreaterThan(invocations[1].ts);
  });
});
