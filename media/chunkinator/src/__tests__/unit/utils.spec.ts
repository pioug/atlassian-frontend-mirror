import { asMock } from '@atlaskit/media-common/test-helpers';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { toArray } from 'rxjs/operators/toArray';
import { fetchBlob, asyncMap } from '../../utils';

describe('utils', () => {
	describe('fetchBlob', () => {
		const setup = (blob: Blob) => ({
			fetch: asMock(fetch).mockReturnValue(Promise.resolve({ blob: () => blob })),
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
			const output = await input.pipe(asyncMap(project, 0)).pipe(toArray()).toPromise();

			expect(output).toEqual([]);
		});

		it('calls project function in-order for all values in input', async () => {
			const project = jest.fn((x) => Promise.resolve(x.length));
			const input = of('f', 'ba', 'baz');
			const output = await input.pipe(asyncMap(project, 1)).pipe(toArray()).toPromise();

			expect(output).toEqual([1, 2, 3]);
			expect(project.mock.calls).toEqual([['f'], ['ba'], ['baz']]);
		});

		it('calls project function with the given concurrency', async () => {
			const invocations: { [v: string]: boolean } = { foo: false, baz: false, bar: false };
			const resolvers: { [v: string]: () => void } = {};
			const promises: { [v: string]: Promise<unknown> } = {};

			const input = of('foo', 'bar', 'baz');

			const project = jest.fn((v) => {
				promises[v] = new Promise((resolve) => {
					resolvers[v] = () => {
						resolve(42);
					};
				});
				invocations[v] = true;
				return promises[v];
			});

			input.pipe(asyncMap(project, 2)).pipe(toArray()).toPromise();

			expect(invocations['foo']).toBe(true);
			expect(invocations['bar']).toBe(true);
			expect(invocations['baz']).toBe(false);

			resolvers['bar']();
			resolvers['foo']();
			await Promise.all([promises['foo'], promises['bar']]);

			expect(invocations['baz']).toBe(true);
			resolvers['baz']();
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
			const output = await input.pipe(asyncMap(project, 2)).pipe(toArray()).toPromise();

			expect(resolveOrder).toEqual(['bar', 'foo']);
			expect(output).toEqual(['foo', 'bar']);
		});
	});
});
