import {
	clearWarmedImages,
	getWarmedImageKey,
	hasWarmedImage,
	hasWarmedImageForFile,
	setWarmedImage,
	takeWarmedImage,
	WARMED_IMAGE_TTL_MS,
} from '../../../warmedImages';

const warmUp = (image: Promise<Blob> = new Promise(() => {})) => ({
	image,
	controller: new AbortController(),
});

describe('warmedImages', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		clearWarmedImages();
	});

	afterEach(() => {
		clearWarmedImages();
		jest.useRealTimers();
	});

	it('hands a warm-up and its controller to whoever takes it, once', () => {
		const warmed = warmUp();
		setWarmedImage('a', warmed);

		expect(takeWarmedImage('a')).toEqual(warmed);
		expect(takeWarmedImage('a')).toBeUndefined();
		expect(warmed.controller.signal.aborted).toBe(false);
	});

	it('leaves a taken warm-up alone when its time runs out', () => {
		const warmed = warmUp();
		setWarmedImage('a', warmed);
		takeWarmedImage('a');

		jest.advanceTimersByTime(WARMED_IMAGE_TTL_MS);

		expect(warmed.controller.signal.aborted).toBe(false);
	});

	it('aborts and drops a warm-up nobody takes in time', () => {
		const warmed = warmUp();
		setWarmedImage('a', warmed);

		jest.advanceTimersByTime(WARMED_IMAGE_TTL_MS - 1);
		expect(hasWarmedImage('a')).toBe(true);

		jest.advanceTimersByTime(1);
		expect(hasWarmedImage('a')).toBe(false);
		expect(warmed.controller.signal.aborted).toBe(true);
	});

	it('aborts the oldest warm-up when a third one is added', () => {
		const first = warmUp();
		const second = warmUp();
		setWarmedImage('a', first);
		setWarmedImage('b', second);
		setWarmedImage('c', warmUp());

		expect(hasWarmedImage('a')).toBe(false);
		expect(first.controller.signal.aborted).toBe(true);
		expect(hasWarmedImage('b')).toBe(true);
		expect(second.controller.signal.aborted).toBe(false);
	});

	it('drops a failed warm-up so a later hover can try again', async () => {
		setWarmedImage('a', warmUp(Promise.reject(new Error('offline'))));

		await Promise.resolve();
		await Promise.resolve();

		expect(hasWarmedImage('a')).toBe(false);
	});

	it('keeps the store on globalThis, so a second copy of the module shares it', () => {
		setWarmedImage('a', warmUp());

		let hasInOtherCopy = false;
		jest.isolateModules(() => {
			// A fresh module registry stands in for the same file bundled twice.
			const otherCopy = require('../../../warmedImages');
			hasInOtherCopy = otherCopy.hasWarmedImage('a');
		});

		expect(hasInOtherCopy).toBe(true);
	});

	describe('reporting', () => {
		const deferredBlob = () => {
			let resolve: (blob: Blob) => void = () => {};
			let reject: (error: Error) => void = () => {};
			const image = new Promise<Blob>((res, rej) => {
				resolve = res;
				reject = rej;
			});
			return { warmed: { image, controller: new AbortController() }, resolve, reject };
		};

		const flush = async () => {
			await Promise.resolve();
			await Promise.resolve();
		};

		it('reports a take, with the blob when it had already downloaded', async () => {
			const onEnd = jest.fn();
			const { warmed, resolve } = deferredBlob();
			const blob = new Blob(['abc']);
			setWarmedImage('a', warmed, { onEnd });

			resolve(blob);
			await flush();
			takeWarmedImage('a');

			expect(onEnd).toHaveBeenCalledTimes(1);
			expect(onEnd).toHaveBeenCalledWith('taken', blob);
		});

		it('reports a take while still downloading without a blob', () => {
			const onEnd = jest.fn();
			setWarmedImage('a', warmUp(), { onEnd });

			takeWarmedImage('a');

			expect(onEnd).toHaveBeenCalledWith('taken', undefined);
		});

		it.each([
			[
				'expired',
				() => {
					jest.advanceTimersByTime(WARMED_IMAGE_TTL_MS);
				},
			],
			[
				'evicted',
				() => {
					setWarmedImage('b', warmUp());
					setWarmedImage('c', warmUp());
				},
			],
			[
				'replaced',
				() => {
					setWarmedImage('a', warmUp());
				},
			],
		])('reports a warm-up that is %s', (outcome, act) => {
			const onEnd = jest.fn();
			setWarmedImage('a', warmUp(), { onEnd });

			act();

			expect(onEnd).toHaveBeenCalledTimes(1);
			expect(onEnd).toHaveBeenCalledWith(outcome, undefined);
		});

		it('reports a failure before anyone takes the warm-up', async () => {
			const onEnd = jest.fn();
			const onError = jest.fn();
			const error = new Error('offline');
			const { warmed, reject } = deferredBlob();
			setWarmedImage('a', warmed, { onEnd, onError });

			reject(error);
			await flush();

			expect(onEnd).toHaveBeenCalledWith('failed', undefined);
			expect(onError).toHaveBeenCalledWith(error, false);
		});

		it('reports a failure after the viewer took the warm-up', async () => {
			const onError = jest.fn();
			const error = new Error('server error');
			const { warmed, reject } = deferredBlob();
			setWarmedImage('a', warmed, { onError });

			takeWarmedImage('a');
			reject(error);
			await flush();

			expect(onError).toHaveBeenCalledWith(error, true);
		});

		it('does not report an aborted request as a failure', async () => {
			const onError = jest.fn();
			const { warmed, reject } = deferredBlob();
			setWarmedImage('a', warmed, { onError });

			// The viewer closing after a take aborts the request.
			takeWarmedImage('a')?.controller.abort();
			reject(new Error('aborted'));
			await flush();

			expect(onError).not.toHaveBeenCalled();
		});

		it.each([
			[
				'evicted',
				() => {
					setWarmedImage('b', warmUp());
					setWarmedImage('c', warmUp());
				},
			],
			[
				'expired',
				() => {
					jest.advanceTimersByTime(WARMED_IMAGE_TTL_MS);
				},
			],
			[
				'replaced',
				() => {
					setWarmedImage('a', warmUp());
				},
			],
		])('does not report the abort of a warm-up that is %s as a failure', async (outcome, act) => {
			const onEnd = jest.fn();
			const onError = jest.fn();
			const { warmed, reject } = deferredBlob();
			setWarmedImage('a', warmed, { onEnd, onError });

			act();
			// A real fetch rejects once its controller aborts.
			reject(new Error('aborted'));
			await flush();

			expect(onError).not.toHaveBeenCalled();
			expect(onEnd).toHaveBeenCalledTimes(1);
			expect(onEnd).toHaveBeenCalledWith(outcome, undefined);
		});

		it('still hands over a warm-up when a listener throws', () => {
			const warmed = warmUp();
			setWarmedImage('a', warmed, {
				onEnd: () => {
					throw new Error('analytics is down');
				},
			});

			expect(takeWarmedImage('a')).toEqual(warmed);
		});

		it('does not report anything when the store is cleared', () => {
			const onEnd = jest.fn();
			setWarmedImage('a', warmUp(), { onEnd });

			clearWarmedImages();

			expect(onEnd).not.toHaveBeenCalled();
		});
	});

	describe('hasWarmedImageForFile', () => {
		it('finds a warm-up for the file whatever its watermark version', () => {
			setWarmedImage(
				getWarmedImageKey({ id: 'file', collectionName: 'collection', watermarkVersion: 'v1' }),
				warmUp(),
			);

			expect(hasWarmedImageForFile({ id: 'file', collectionName: 'collection' })).toBe(true);
			expect(hasWarmedImageForFile({ id: 'file', collectionName: 'other' })).toBe(false);
			expect(hasWarmedImageForFile({ id: 'file' })).toBe(false);
			expect(hasWarmedImageForFile({ id: 'fil', collectionName: 'collection' })).toBe(false);
		});
	});

	describe('getWarmedImageKey', () => {
		it('gives each watermark version of a file its own key', () => {
			const key = (watermarkVersion: string | undefined) =>
				getWarmedImageKey({ id: 'file', collectionName: 'collection', watermarkVersion });

			expect(key('version-1')).toBe(key('version-1'));
			expect(key('version-1')).not.toBe(key('version-2'));
			expect(key('version-1')).not.toBe(key(undefined));
		});

		it('keeps parts apart when they contain separator characters', () => {
			expect(
				getWarmedImageKey({ id: 'file', collectionName: 'a-b', watermarkVersion: undefined }),
			).not.toBe(getWarmedImageKey({ id: 'file', collectionName: 'a', watermarkVersion: 'b' }));
			expect(
				getWarmedImageKey({ id: 'file', collectionName: 'a', watermarkVersion: 'b-c' }),
			).not.toBe(getWarmedImageKey({ id: 'file', collectionName: 'a-b', watermarkVersion: 'c' }));
		});
	});
});
