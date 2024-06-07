import MockDate from 'mockdate';
import { uploadinator } from '../../uploadinator';
import { empty } from 'rxjs/observable/empty';
import { toArray } from 'rxjs/operators/toArray';
import { from } from 'rxjs/observable/from';

const delayPromise = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

	it('invokes uploader for all chunks', async () => {
		const chunks = [
			{ blob: new Blob(), hash: 'foo', partNumber: 1 },
			{ blob: new Blob(), hash: 'bar', partNumber: 2 },
			{ blob: new Blob(), hash: 'baz', partNumber: 3 },
		];

		const uploader = jest.fn(() => Promise.resolve());

		const output = await uploadinator(from(chunks), {
			concurrency: 1,
			uploader,
		})
			.pipe(toArray())
			.toPromise();

		expect(output).toEqual([chunks[0], chunks[1], chunks[2]]);
		expect(uploader).toHaveBeenCalledTimes(3);
		expect(uploader).toHaveBeenCalledWith(chunks[0]);
		expect(uploader).toHaveBeenCalledWith(chunks[1]);
		expect(uploader).toHaveBeenCalledWith(chunks[2]);
	});

	it('returns chunks in-order even if promises resolve out of order', async () => {
		const chunks = [
			{ blob: new Blob(), hash: 'foo', partNumber: 1 },
			{ blob: new Blob(), hash: 'bar', partNumber: 2 },
		];

		const uploader = jest.fn().mockImplementation((chunk) => {
			if (chunk.hash === 'foo') {
				return delayPromise(200);
			} else {
				return delayPromise(100);
			}
		});

		const output = await uploadinator(from(chunks), {
			concurrency: 2,
			uploader,
		})
			.pipe(toArray())
			.toPromise();

		expect(output).toEqual(chunks);
	});

	it('invokes parallel batches of N uploads, sequentially', async () => {
		MockDate.reset();
		const chunks = [
			{ blob: new Blob(), hash: 'foo', partNumber: 1 },
			{ blob: new Blob(), hash: 'bar', partNumber: 2 },
			{ blob: new Blob(), hash: 'baz', partNumber: 3 },
		];

		const invocations = new Array<{ ts: number; hash: string }>();

		const uploader = jest.fn().mockImplementation((chunk) => {
			invocations.push({ ts: Date.now(), hash: chunk.hash });
			return delayPromise(10);
		});

		await uploadinator(from(chunks), {
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
