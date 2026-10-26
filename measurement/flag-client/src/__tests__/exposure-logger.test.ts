/**
 * @jest-environment node
 */

import {
	createExposureLogger,
	NOOP_EXPOSURE_LOGGER,
	type ExposureDeliveryOptions,
} from '../exposure/logger';
import {
	deliveredFlagKeys,
	exposure,
	FakeExposureEnvironment,
	settle,
} from './_utils/exposure-fakes';

const ENDPOINT = 'https://xp.atlassian.com/ft/v1/logs';

function setup(options: Partial<ExposureDeliveryOptions> = {}) {
	const environment = new FakeExposureEnvironment();
	const logger = createExposureLogger(
		{ endpoint: ENDPOINT, batchSize: 100, flushIntervalMs: 10_000, ...options },
		environment,
	);
	// A batch that `log` fills is sent from a zero-delay timer, so run it as the host's next task would.
	const log = (flagKey: string) => {
		logger.log(flagKey, () => exposure(flagKey));
		environment.advance(0);
	};
	return { environment, logger, log };
}

describe('NOOP_EXPOSURE_LOGGER', () => {
	it('never produces a record', () => {
		const produce = jest.fn(() => exposure('flag-a'));

		NOOP_EXPOSURE_LOGGER.log('flag-a', produce);
		NOOP_EXPOSURE_LOGGER.endDeduplicationWindows();

		expect(produce).not.toHaveBeenCalled();
	});
});

describe('createExposureLogger', () => {
	it('registers one page-lifecycle listener and arms nothing while idle', () => {
		const { environment } = setup();

		expect(environment.listeners).toHaveLength(1);
		expect(environment.pendingTimers).toBe(0);
		expect(environment.requests).toHaveLength(0);
	});

	it('produces a record only for an exposure it queues', () => {
		const { logger } = setup();
		const produce = jest.fn(() => exposure('flag-a'));

		logger.log('identity', produce);
		logger.log('identity', produce);

		expect(produce).toHaveBeenCalledTimes(1);
	});

	it('contains a failing producer and keeps its identity unsuppressed', () => {
		const { logger } = setup();
		const produce = jest
			.fn<ReturnType<typeof exposure>, []>()
			.mockImplementationOnce(() => {
				throw new Error('mapping failed');
			})
			.mockImplementation(() => exposure('flag-a'));

		expect(() => logger.log('identity', produce)).not.toThrow();
		logger.log('identity', produce);

		expect(produce).toHaveBeenCalledTimes(2);
	});

	it('queues the same identity again after the windows end', () => {
		const { logger } = setup();
		const produce = jest.fn(() => exposure('flag-a'));

		logger.log('identity', produce);
		logger.endDeduplicationWindows();
		logger.log('identity', produce);

		expect(produce).toHaveBeenCalledTimes(2);
	});
});

describe('batching and delivery', () => {
	it('delivers a full batch in one POST with only the JSON content type', () => {
		const { environment, log } = setup({ batchSize: 2 });

		log('flag-a');
		expect(environment.requests).toHaveLength(0);
		log('flag-b');

		expect(environment.requests).toHaveLength(1);
		const [request] = environment.requests;
		expect(request?.url).toBe(ENDPOINT);
		expect(request?.init).toEqual({
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: request?.init.body,
			credentials: 'omit',
			signal: expect.any(AbortSignal),
		});
		expect(request?.init).not.toHaveProperty('keepalive');
		expect(deliveredFlagKeys(request!)).toEqual(['flag-a', 'flag-b']);
	});

	it('sends a batch that log fills from a later task, not inside log', () => {
		const { environment, logger } = setup({ batchSize: 2 });

		logger.log('flag-a', () => exposure('flag-a'));
		logger.log('flag-b', () => exposure('flag-b'));
		expect(environment.requests).toHaveLength(0);
		environment.advance(0);

		expect(environment.requests).toHaveLength(1);
		expect(deliveredFlagKeys(environment.requests[0]!)).toEqual(['flag-a', 'flag-b']);
	});

	it('sends a filled batch without waiting for an armed flush timer', () => {
		const { environment, logger } = setup({ batchSize: 2, flushIntervalMs: 10_000 });

		logger.log('flag-a', () => exposure('flag-a'));
		environment.advance(5_000);
		logger.log('flag-b', () => exposure('flag-b'));
		logger.log('flag-c', () => exposure('flag-c'));
		environment.advance(0);

		expect(environment.requests).toHaveLength(1);
		expect(deliveredFlagKeys(environment.requests[0]!)).toEqual(['flag-a', 'flag-b']);
	});

	it('waits a full flush interval for an exposure queued after a filled batch', async () => {
		const { environment, logger } = setup({ batchSize: 2, flushIntervalMs: 10_000 });

		logger.log('flag-a', () => exposure('flag-a'));
		environment.advance(5_000);
		logger.log('flag-b', () => exposure('flag-b'));
		environment.advance(0);
		environment.requests[0]!.respond(200);
		await settle();
		environment.advance(1_000);
		logger.log('flag-c', () => exposure('flag-c'));
		environment.advance(9_999);
		expect(environment.requests).toHaveLength(1);
		environment.advance(1);

		expect(environment.requests).toHaveLength(2);
		expect(deliveredFlagKeys(environment.requests[1]!)).toEqual(['flag-c']);
	});

	it('sends a filled batch at once when the page is hidden before the zero-delay timer', () => {
		const { environment, logger } = setup({ batchSize: 2 });

		logger.log('flag-a', () => exposure('flag-a'));
		logger.log('flag-b', () => exposure('flag-b'));
		environment.hide();

		expect(environment.requests).toHaveLength(1);
		environment.advance(0);
		expect(environment.requests).toHaveLength(1);
	});

	it('delivers queued exposures when the flush interval elapses', () => {
		const { environment, log } = setup({ flushIntervalMs: 10_000 });

		log('flag-a');
		environment.advance(9_999);
		expect(environment.requests).toHaveLength(0);
		environment.advance(1);

		expect(environment.requests).toHaveLength(1);
		expect(deliveredFlagKeys(environment.requests[0]!)).toEqual(['flag-a']);
	});

	it('keeps at most one delivery in flight', async () => {
		const { environment, log } = setup({ batchSize: 1 });

		log('flag-a');
		log('flag-b');
		expect(environment.requests).toHaveLength(1);

		environment.requests[0]!.respond(200);
		await settle();

		expect(environment.requests).toHaveLength(2);
		expect(deliveredFlagKeys(environment.requests[1]!)).toEqual(['flag-b']);
	});

	it('cancels the unread response body', async () => {
		const { environment, log } = setup({ batchSize: 1 });
		const cancel = jest.fn(() => Promise.resolve());

		log('flag-a');
		environment.requests[0]!.respond(204, { cancel });
		await settle();

		expect(cancel).toHaveBeenCalledTimes(1);
	});

	it.each([
		['rejects', () => Promise.reject(new TypeError('locked'))],
		[
			'throws',
			() => {
				throw new TypeError('locked');
			},
		],
	])('classifies by status when cancelling the body %s', async (_, cancel) => {
		const { environment, log } = setup({ batchSize: 1 });

		log('flag-a');
		environment.requests[0]!.respond(204, { cancel });
		await settle();
		environment.advance(60_000);

		expect(environment.requests).toHaveLength(1);
	});

	it('treats any 2xx as delivered', async () => {
		const { environment, log } = setup({ batchSize: 1 });

		log('flag-a');
		environment.requests[0]!.respond(204);
		await settle();
		environment.advance(60_000);

		expect(environment.requests).toHaveLength(1);
		expect(environment.pendingTimers).toBe(0);
	});
});

describe('delivery retry', () => {
	it.each([[429], [503]])('retries HTTP %i after the retry delay', async (status) => {
		const { environment, log } = setup({ batchSize: 1 });

		log('flag-a');
		environment.requests[0]!.respond(status);
		await settle();
		environment.advance(999);
		expect(environment.requests).toHaveLength(1);
		environment.advance(1);

		expect(environment.requests).toHaveLength(2);
		expect(environment.requests[1]!.init.body).toBe(environment.requests[0]!.init.body);
	});

	it('retries a network error', async () => {
		const { environment, log } = setup({ batchSize: 1 });

		log('flag-a');
		environment.requests[0]!.fail();
		await settle();
		environment.advance(1_000);

		expect(environment.requests).toHaveLength(2);
	});

	it('abandons and retries a delivery not settled after 30,000 ms', async () => {
		const { environment, log } = setup({ batchSize: 1 });

		log('flag-a');
		environment.advance(29_999);
		await settle();
		expect(environment.requests[0]!.init.signal?.aborted).toBe(false);
		environment.advance(1);
		await settle();
		expect(environment.requests[0]!.init.signal?.aborted).toBe(true);
		environment.advance(1_000);

		expect(environment.requests).toHaveLength(2);
		expect(environment.requests[1]!.init.body).toBe(environment.requests[0]!.init.body);
	});

	it('abandons and retries a delivery after 30,000 ms without an AbortController', async () => {
		const { environment, log } = setup({ batchSize: 1 });
		environment.hasAbortController = false;

		log('flag-a');
		await settle();
		expect(environment.requests[0]!.init).not.toHaveProperty('signal');
		environment.advance(30_000);
		await settle();
		environment.advance(1_000);

		expect(environment.requests).toHaveLength(2);
		expect(environment.requests[1]!.init.body).toBe(environment.requests[0]!.init.body);
	});

	it('ignores a response that arrives after its delivery was abandoned', async () => {
		const { environment, log } = setup({ batchSize: 1 });

		log('flag-a');
		environment.advance(30_000);
		await settle();
		environment.requests[0]!.respond(204);
		await settle();
		environment.advance(1_000);

		expect(environment.requests).toHaveLength(2);
	});

	it('cancels the body of a response that arrives after its delivery was abandoned', async () => {
		const { environment, log } = setup({ batchSize: 1 });
		environment.hasAbortController = false;
		const cancel = jest.fn(() => Promise.resolve());

		log('flag-a');
		environment.advance(30_000);
		await settle();
		environment.requests[0]!.respond(204, { cancel });
		await settle();

		expect(cancel).toHaveBeenCalledTimes(1);
	});

	it('stops the timeout once a delivery settles', async () => {
		const { environment, log } = setup({ batchSize: 1 });

		log('flag-a');
		environment.requests[0]!.respond(204);
		await settle();

		expect(environment.pendingTimers).toBe(0);
	});

	it('doubles the delay up to 30,000 ms, varied by up to 20 percent', async () => {
		const { environment, log } = setup({ batchSize: 1 });
		environment.randomValue = 0;
		const delays: number[] = [];

		log('flag-a');
		for (let failure = 1; failure <= 7; failure += 1) {
			environment.requests.at(-1)!.respond(503);
			await settle();
			const before = environment.requests.length;
			let waited = 0;
			while (environment.requests.length === before) {
				environment.advance(100);
				waited += 100;
			}
			delays.push(waited);
		}

		expect(delays).toEqual([800, 1_600, 3_200, 6_400, 12_800, 24_000, 24_000]);
	});

	it('applies the upper jitter bound', async () => {
		const { environment, log } = setup({ batchSize: 1 });
		environment.randomValue = 0.999_999;

		log('flag-a');
		environment.requests[0]!.respond(503);
		await settle();
		environment.advance(1_199);
		expect(environment.requests).toHaveLength(1);
		environment.advance(1);

		expect(environment.requests).toHaveLength(2);
	});

	it('resets the delay after a successful delivery', async () => {
		const { environment, log } = setup({ batchSize: 1 });

		log('flag-a');
		environment.requests[0]!.respond(503);
		await settle();
		environment.advance(1_000);
		environment.requests[1]!.respond(200);
		await settle();
		log('flag-b');
		environment.requests[2]!.respond(503);
		await settle();
		environment.advance(1_000);

		expect(environment.requests).toHaveLength(4);
	});

	it('discards an exposure after 10 failed attempts and still delivers later ones', async () => {
		const { environment, log } = setup({ batchSize: 1 });

		log('flag-a');
		for (let attempt = 1; attempt <= 10; attempt += 1) {
			environment.requests.at(-1)!.fail();
			await settle();
			environment.advance(30_000);
		}
		expect(environment.requests).toHaveLength(10);

		log('flag-b');
		environment.advance(30_000);

		expect(environment.requests).toHaveLength(11);
		expect(deliveredFlagKeys(environment.requests[10]!)).toEqual(['flag-b']);
	});

	it('arms no retry once a retryable failure discards every exposure', async () => {
		const { environment, log } = setup({ batchSize: 1 });

		log('flag-a');
		for (let attempt = 1; attempt <= 10; attempt += 1) {
			environment.requests.at(-1)!.fail();
			await settle();
			if (attempt < 10) environment.advance(30_000);
		}
		expect(environment.pendingTimers).toBe(0);
		log('flag-b');

		expect(environment.requests).toHaveLength(11);
		expect(deliveredFlagKeys(environment.requests[10]!)).toEqual(['flag-b']);
	});

	it('discards a batch it cannot encode and still delivers later ones', async () => {
		const { environment, logger, log } = setup({ batchSize: 1 });
		const record = exposure('flag-a');
		const unencodable = {
			...record,
			logRecord: {
				...record.logRecord,
				attributes: [{ key: 'feature_flag.key', value: { intValue: BigInt(1) } }],
			},
		} as unknown as typeof record;

		logger.log('unencodable', () => unencodable);
		await settle();
		log('flag-b');
		await settle();

		expect(environment.requests).toHaveLength(1);
		expect(deliveredFlagKeys(environment.requests[0]!)).toEqual(['flag-b']);
	});

	it.each([[400], [404], [413], [500], [502], [504]])(
		'discards exposures on HTTP %i without retry',
		async (status) => {
			const { environment, log } = setup({ batchSize: 1 });

			log('flag-a');
			environment.requests[0]!.respond(status);
			await settle();
			environment.advance(60_000);
			expect(environment.requests).toHaveLength(1);

			log('flag-b');
			expect(deliveredFlagKeys(environment.requests[1]!)).toEqual(['flag-b']);
		},
	);

	it('treats a missing fetch as terminal', async () => {
		const { environment, log } = setup({ batchSize: 1 });
		environment.fetch = undefined;

		log('flag-a');
		await settle();
		environment.advance(60_000);

		expect(environment.pendingTimers).toBe(0);
	});
});
