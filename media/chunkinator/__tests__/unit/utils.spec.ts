import { asMock } from '@atlaskit/media-test-helpers';
import { empty } from 'rxjs/observable/empty';
import MockDate from 'mockdate';
import { of } from 'rxjs/observable/of';
import { toArray } from 'rxjs/operators/toArray';
import { fetchBlob, asyncMap } from '../../src/utils';

describe('utils', () => {
  describe('fetchBlob', () => {
    const setup = (blob: Blob) => ({
      fetch: asMock(fetch).mockReturnValue(
        Promise.resolve({ blob: () => blob }),
      ),
    });

    it('should resolve with fetched Blob given url', () => {
      const blob = new Blob();
      const url = 'http://some-url';
      const { fetch } = setup(blob);

      return fetchBlob(url).then((actualBlob) => {
        expect(fetch).toBeCalledWith(url);
        expect(actualBlob).toEqual(blob);
      });
    });

    it('should resolve original blob given blob', () => {
      const blob = new Blob();

      return fetchBlob(blob).then((actualBlob) => {
        expect(actualBlob).toEqual(blob);
      });
    });
  });
  describe('asyncMap', () => {
    it('returns empty observable for empty input', async () => {
      const project = jest.fn();
      const input = empty();
      const output = await input
        .pipe(asyncMap(project, 0))
        .pipe(toArray())
        .toPromise();

      expect(output).toEqual([]);
    });

    it('calls project function in-order for all values in input', async () => {
      const project = jest.fn((x) => Promise.resolve(x.length));
      const input = of('f', 'ba', 'baz');
      const output = await input
        .pipe(asyncMap(project, 1))
        .pipe(toArray())
        .toPromise();

      expect(output).toEqual([1, 2, 3]);
      expect(project.mock.calls).toEqual([['f'], ['ba'], ['baz']]);
    });

    it('calls project function with the given concurrency', async () => {
      MockDate.reset();
      const invocations: { [v: string]: number } = {};
      const input = of('foo', 'bar', 'baz');
      const project = jest.fn((v) => {
        return new Promise((resolve) => {
          invocations[v] = Date.now();
          setTimeout(() => {
            resolve(42);
          }, 10);
        });
      });

      await input.pipe(asyncMap(project, 2)).pipe(toArray()).toPromise();
      expect(invocations['bar'] - invocations['foo']).toBeLessThan(5);
      expect(invocations['baz']).toBeGreaterThan(invocations['foo']);
      expect(invocations['baz']).toBeGreaterThan(invocations['bar']);
    });

    it('returns projected values in-order even if promises resolve out of order', async () => {
      const resolveOrder: string[] = [];
      const project = jest.fn((x) => {
        return new Promise((resolve) => {
          setTimeout(
            () => {
              resolveOrder.push(x);
              resolve(x);
            },
            x === 'foo' ? 100 : 50,
          );
        });
      });
      const input = of('foo', 'bar');
      const output = await input
        .pipe(asyncMap(project, 2))
        .pipe(toArray())
        .toPromise();

      expect(resolveOrder).toEqual(['bar', 'foo']);
      expect(output).toEqual(['foo', 'bar']);
    });
  });
});
