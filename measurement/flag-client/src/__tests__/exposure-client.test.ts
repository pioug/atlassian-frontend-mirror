/**
 * @jest-environment node
 */

import { FlagClient } from '../client';
import { setExposureEnvironmentFactory } from '../exposure/environment';
import type {
	BulkEvaluationPayload,
	EvaluationDetails,
	ExposureLoggingOptions,
	FlagClientOptions,
} from '../types';
import {
	FakeExposureEnvironment,
	FakeStorage,
	settle,
	type FakeRequest,
} from './_utils/exposure-fakes';
import { stubGlobal, unstubAllGlobals } from './_utils/stub-globals';
import { result, testUser, TEST_CLIENT_OPTIONS } from './_utils/test-payload-helper';

type AttributeValue = string | boolean | number | readonly unknown[] | undefined;

interface DeliveredExposure {
	readonly resource: Readonly<Record<string, AttributeValue>>;
	readonly attributes: Readonly<Record<string, AttributeValue>>;
}

interface OtlpValue {
	readonly stringValue?: string;
	readonly boolValue?: boolean;
	readonly intValue?: string;
	readonly doubleValue?: number;
	readonly arrayValue?: { readonly values: readonly OtlpValue[] };
}

interface OtlpAttribute {
	readonly key: string;
	readonly value: OtlpValue;
}

function plain(value: OtlpValue): AttributeValue {
	if (value.stringValue !== undefined) return value.stringValue;
	if (value.boolValue !== undefined) return value.boolValue;
	if (value.intValue !== undefined) return Number(value.intValue);
	if (value.doubleValue !== undefined) return value.doubleValue;
	return value.arrayValue?.values.map(plain);
}

function attributeMap(attributes: readonly OtlpAttribute[]): Record<string, AttributeValue> {
	return Object.fromEntries(attributes.map(({ key, value }) => [key, plain(value)]));
}

/** Every exposure in every request, in delivery order, with plain attribute values. */
function delivered(requests: readonly FakeRequest[]): DeliveredExposure[] {
	return requests.flatMap((request) => {
		const body = JSON.parse(request.init.body) as {
			resourceLogs: {
				resource: { attributes: OtlpAttribute[] };
				scopeLogs: { logRecords: { attributes: OtlpAttribute[] }[] }[];
			}[];
		};
		return body.resourceLogs.flatMap((resourceLogs) =>
			resourceLogs.scopeLogs.flatMap((scope) =>
				scope.logRecords.map((record) => ({
					resource: attributeMap(resourceLogs.resource.attributes),
					attributes: attributeMap(record.attributes),
				})),
			),
		);
	});
}

const PAYLOAD: BulkEvaluationPayload = {
	requestContext: { identifiers: { AtlassianAccountId: 'abc' } },
	flags: {
		'flag-a': result(),
		'string.flag': result({ returnType: 'STRING', value: 'blue' }),
		'number.flag': result({ returnType: 'NUMBER', value: 7 }),
		'object.flag': result({ returnType: 'JSON', value: { theme: 'dark' } }),
	},
};

let environment: FakeExposureEnvironment;
let factory: jest.Mock<FakeExposureEnvironment, []>;

beforeEach(() => {
	environment = new FakeExposureEnvironment();
	factory = jest.fn(() => environment);
	setExposureEnvironmentFactory(factory);
});

afterEach(() => {
	setExposureEnvironmentFactory();
	unstubAllGlobals();
	jest.restoreAllMocks();
});

function clientWith(
	exposureLogging: ExposureLoggingOptions = { enabled: true, batchSize: 1 },
	options: Partial<FlagClientOptions> = {},
): FlagClient {
	return new FlagClient({ ...TEST_CLIENT_OPTIONS, ...options, exposureLogging });
}

function initializedWith(
	exposureLogging?: ExposureLoggingOptions,
	options?: Partial<FlagClientOptions>,
): FlagClient {
	const client = clientWith(exposureLogging, options);
	expect(client.initialize(() => PAYLOAD, testUser())).toEqual({ initialized: true });
	return client;
}

function initializedWithPayload(payload: BulkEvaluationPayload): FlagClient {
	const client = clientWith();
	expect(client.initialize(() => payload, testUser())).toEqual({ initialized: true });
	return client;
}

/** A payload whose `flag-a` has this flag version, request context user, and client version token. */
function attributedPayload(version: string, accountId: string): BulkEvaluationPayload {
	return {
		flags: {
			'flag-a': result({
				metadata: { ...result().metadata, flagVersion: version, targetApps: ['jira-frontend'] },
			}),
		},
		requestContext: {
			identifiers: { AtlassianAccountId: accountId },
			attributes: { plan: 'free' },
		},
		clientVersion: { token: `token-${version}`, updatedAt: '2026-10-01T00:00:00Z' },
	};
}

/**
 * Respond to every pending request with `200`, so single-flight delivery sends the next batch. A
 * batch that a read fills is sent from a zero-delay timer, so each round first runs that timer.
 */
async function deliverAll(): Promise<DeliveredExposure[]> {
	const handled = new Set<FakeRequest>();
	for (;;) {
		environment.advance(0);
		await settle();
		const pending = environment.requests.filter((request) => !handled.has(request));
		if (pending.length === 0) return delivered(environment.requests);
		for (const request of pending) {
			handled.add(request);
			request.respond(200);
		}
	}
}

describe('exposure logging configuration', () => {
	it('is disabled by default without a global window and creates no environment', async () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		client.initialize(() => PAYLOAD, testUser());

		client.getBooleanValue('flag-a', false);
		client.logExposure(client.getBooleanDetails('flag-a', false));

		expect(factory).not.toHaveBeenCalled();
		expect(await deliverAll()).toEqual([]);
	});

	it('is enabled by default with a global window and delivers to the production endpoint', async () => {
		stubGlobal('window', {});
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		client.initialize(() => PAYLOAD, testUser());

		client.getBooleanValue('flag-a', false);
		environment.advance(10_000);

		expect(factory).toHaveBeenCalledTimes(1);
		environment.advance(0);
		expect(environment.requests.map((request) => request.url)).toEqual([
			'https://xp.atlassian.com/ft/v1/logs',
		]);
	});

	it('creates no environment and emits nothing when explicitly disabled', async () => {
		stubGlobal('window', {});
		const client = initializedWith({ enabled: false });

		client.getBooleanValue('flag-a', false);
		client.logExposure(client.getBooleanDetails('flag-a', false, { disableExposureLogging: true }));

		expect(factory).not.toHaveBeenCalled();
		expect(await deliverAll()).toEqual([]);
	});

	it('delivers to an overridden endpoint', async () => {
		const client = initializedWith({
			enabled: true,
			batchSize: 1,
			endpoint: 'http://localhost:4318/v1/logs',
		});

		client.getBooleanValue('flag-a', false);

		environment.advance(0);
		expect(environment.requests.map((request) => request.url)).toEqual([
			'http://localhost:4318/v1/logs',
		]);
	});

	it.each<[string, unknown, unknown]>([
		['enabled', 'yes', 'yes'],
		['endpoint', 'relative/v1/logs', 'relative/v1/logs'],
		['endpoint', 'ftp://example.com/v1/logs', 'ftp://example.com/v1/logs'],
		['batchSize', 0, 0],
		['batchSize', 2.5, 2.5],
		['flushIntervalMs', Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
		['flushIntervalMs', -1, -1],
	])('ignores unsupported %s %p with one warning that omits the value', (option, value) => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

		expect(
			() =>
				new FlagClient({
					...TEST_CLIENT_OPTIONS,
					exposureLogging: { enabled: true, [option]: value } as ExposureLoggingOptions,
				}),
		).not.toThrow();

		expect(warn).toHaveBeenCalledTimes(1);
		const [message, context] = warn.mock.calls[0] as [string, Record<string, unknown>];
		expect(message).toBe('Flag client ignored an unsupported exposure logging option');
		expect(context['option']).toBe(option);
		expect(Object.values(context)).not.toContain(value);
	});

	it.each([
		[
			'a throwing getter',
			() =>
				({
					get enabled(): boolean {
						throw new Error('getter');
					},
				}) as ExposureLoggingOptions,
		],
		[
			'a revoked proxy',
			() => {
				const { proxy, revoke } = Proxy.revocable({}, {});
				revoke();
				return proxy as ExposureLoggingOptions;
			},
		],
	])('warns about an exposureLogging with %s without throwing', (_name, create) => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

		expect(
			() => new FlagClient({ ...TEST_CLIENT_OPTIONS, exposureLogging: create() }),
		).not.toThrow();
		expect(warn.mock.calls.map(([, context]) => (context as { option: string }).option)).toEqual([
			'exposureLogging',
		]);
	});

	it('warns about a non-object exposureLogging and uses every default', () => {
		stubGlobal('window', {});
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		const client = new FlagClient({
			...TEST_CLIENT_OPTIONS,
			exposureLogging: 5 as unknown as ExposureLoggingOptions,
		});
		client.initialize(() => PAYLOAD, testUser());

		client.getBooleanValue('flag-a', false);
		environment.advance(9_999);
		expect(environment.requests).toHaveLength(0);
		environment.advance(1);

		expect(warn.mock.calls.map(([, context]) => (context as { option: string }).option)).toEqual([
			'exposureLogging',
		]);
		environment.advance(0);
		expect(environment.requests.map((request) => request.url)).toEqual([
			'https://xp.atlassian.com/ft/v1/logs',
		]);
	});

	it('uses the default batch size when batchSize is unsupported', () => {
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		const client = initializedWith({ enabled: true, batchSize: 0 });

		client.getBooleanValue('flag-a', false);
		client.getStringValue('string.flag', 'red');

		expect(environment.requests).toHaveLength(0);
		environment.advance(10_000);
		expect(environment.requests).toHaveLength(1);
	});

	it('resolves a path endpoint against the page origin', () => {
		stubGlobal('window', { location: { origin: 'https://example.atlassian.net' } });
		const client = initializedWith({ batchSize: 1, endpoint: '/gateway/api/ft/v1/logs' });

		client.getBooleanValue('flag-a', false);

		environment.advance(0);
		expect(environment.requests.map((request) => request.url)).toEqual([
			'https://example.atlassian.net/gateway/api/ft/v1/logs',
		]);
	});

	it.each([
		[
			'protocol-relative',
			{ location: { origin: 'https://example.atlassian.net' } },
			'//other.example/v1/logs',
		],
		[
			'backslash protocol-relative',
			{ location: { origin: 'https://example.atlassian.net' } },
			'/\\other.example/v1/logs',
		],
		...['\t', '\n', '\r'].map((character): [string, object, string] => [
			`${JSON.stringify(character)}-separated protocol-relative`,
			{ location: { origin: 'https://example.atlassian.net' } },
			`/${character}/other.example/v1/logs`,
		]),
		['opaque origin', { location: { origin: 'null' } }, '/gateway/api/ft/v1/logs'],
		['missing location', {}, '/gateway/api/ft/v1/logs'],
	])('rejects a %s path endpoint and uses the production endpoint', (_case, host, endpoint) => {
		stubGlobal('window', host);
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		const client = initializedWith({ batchSize: 1, endpoint });

		client.getBooleanValue('flag-a', false);

		expect(warn.mock.calls.map(([, context]) => (context as { option: string }).option)).toEqual([
			'endpoint',
		]);
		environment.advance(0);
		expect(environment.requests.map((request) => request.url)).toEqual([
			'https://xp.atlassian.com/ft/v1/logs',
		]);
	});

	it.each([
		'https://user:token@collector.example/v1/logs',
		'https://user@collector.example/v1/logs',
		'https://:token@collector.example/v1/logs',
	])('rejects endpoint %s with credentials and uses the production endpoint', (endpoint) => {
		stubGlobal('window', {});
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		const client = initializedWith({ batchSize: 1, endpoint });

		client.getBooleanValue('flag-a', false);

		expect(warn).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(warn.mock.calls[0])).not.toMatch(/user|token/);
		environment.advance(0);
		expect(environment.requests.map((request) => request.url)).toEqual([
			'https://xp.atlassian.com/ft/v1/logs',
		]);
	});

	it('rejects a path endpoint when enabled without a global window', () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		const client = initializedWith({
			enabled: true,
			batchSize: 1,
			endpoint: '/gateway/api/ft/v1/logs',
		});

		client.getBooleanValue('flag-a', false);

		expect(warn).toHaveBeenCalledTimes(1);
		environment.advance(0);
		expect(environment.requests.map((request) => request.url)).toEqual([
			'https://xp.atlassian.com/ft/v1/logs',
		]);
	});

	it.each<[string, ExposureLoggingOptions]>([
		['explicitly disabled', { enabled: false, batchSize: 0, endpoint: '//other.example/v1/logs' }],
		['disabled by default without a window', { batchSize: 0, endpoint: '/gateway/api/ft/v1/logs' }],
	])('does not check delivery options when %s', (_case, exposureLogging) => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

		new FlagClient({ ...TEST_CLIENT_OPTIONS, exposureLogging });

		expect(warn).not.toHaveBeenCalled();
		expect(factory).not.toHaveBeenCalled();
	});

	it('copies exposure logging options at construction', () => {
		const exposureLogging = { enabled: true, batchSize: 1, endpoint: 'https://a.example/v1/logs' };
		const client = initializedWith(exposureLogging);

		exposureLogging.endpoint = 'https://b.example/v1/logs';
		client.getBooleanValue('flag-a', false);

		environment.advance(0);
		expect(environment.requests.map((request) => request.url)).toEqual([
			'https://a.example/v1/logs',
		]);
	});

	it.each([
		[
			'the environment',
			() => {
				factory.mockImplementation(() => {
					throw new TypeError('crypto is not defined');
				});
			},
		],
		[
			'page-lifecycle registration',
			() => {
				environment.onPageLifecycle = () => {
					throw new TypeError('addEventListener is not a function');
				};
			},
		],
	])('constructs a client that logs nothing when %s throws', (_, breakSetup) => {
		breakSetup();

		const client = initializedWith();

		expect(client.getBooleanValue('flag-a', false)).toBe(true);
		client.logExposure(client.getBooleanDetails('flag-a', false));
		environment.advance(60_000);
		expect(environment.requests).toHaveLength(0);
	});
});

describe('automatic exposures', () => {
	it('returns the value when the read options throw', () => {
		const client = initializedWith();
		const options = {
			get disableExposureLogging(): boolean {
				throw new Error('getter');
			},
		};

		expect(client.getBooleanValue('flag-a', false, options)).toBe(true);
		expect(client.getBooleanDetails('flag-a', false, options).value).toBe(true);
	});

	it('records exactly one exposure for each typed value and details read', async () => {
		const client = initializedWith();

		client.getBooleanValue('flag-a', false);
		client.getStringDetails('string.flag', 'red');
		client.getNumberValue('number.flag', 0);
		client.getObjectDetails('object.flag', {});

		expect((await deliverAll()).map((exposure) => exposure.attributes['feature_flag.key'])).toEqual(
			['flag-a', 'string.flag', 'number.flag', 'object.flag'],
		);
	});

	it('maps a retained flag result with the constructor resource identity', async () => {
		const client = initializedWith(
			{ enabled: true, batchSize: 1 },
			{ targetApp: 'confluence-frontend', environmentType: 'staging', serviceVersion: '2.4.1' },
		);

		client.getBooleanValue('flag-a', false);

		const [exposure] = await deliverAll();
		expect(exposure?.resource).toEqual({
			'service.name': 'confluence-frontend',
			'service.version': '2.4.1',
			'deployment.environment.name': 'staging',
			'deployment.environment_type': 'staging',
		});
		expect(exposure?.attributes).toMatchObject({
			'feature_flag.key': 'flag-a',
			'feature_flag.set.id': 'confluence-frontend',
			'feature_flag.result.variant': 'variation-on',
			'feature_flag.result.reason': 'ss_cohort_match',
			'atl.feature_flag.rule_id': 'rule-a',
			'atl.feature_flag.result.source': 'bootstrap',
			'atl.feature_flag.exposure.manual': false,
			'atl.identifiers.AtlassianAccountId': 'abc',
		});
	});

	it('records a missing flag as a bootstrap exposure', async () => {
		const client = initializedWith();

		expect(client.getBooleanValue('missing.flag', true)).toBe(true);

		const [exposure] = await deliverAll();
		expect(exposure?.attributes).toMatchObject({
			'feature_flag.key': 'missing.flag',
			'feature_flag.result.reason': 'flag_not_found',
			'feature_flag.error.message': 'FFP evaluation failed: flag_not_found',
			'atl.feature_flag.result.source': 'bootstrap',
		});
	});

	it.each(['constructor', 'toString', '__proto__'])(
		'records the inherited member name %s as a missing flag',
		async (flagKey) => {
			const client = initializedWith();
			const constructed = new FlagClient(TEST_CLIENT_OPTIONS).getBooleanDetails(flagKey, false);

			expect(client.getBooleanDetails(flagKey, false).metadata.matchReason).toBe('flag_not_found');
			client.logExposure({ value: false, metadata: { ...constructed.metadata } });

			const exposures = await deliverAll();
			expect(exposures.map((exposure) => exposure.attributes['feature_flag.key'])).toEqual([
				flagKey,
				flagKey,
			]);
			expect(exposures[0]?.attributes['feature_flag.result.reason']).toBe('flag_not_found');
		},
	);

	it('keeps the payload flag attribution for a type mismatch', async () => {
		const client = initializedWithPayload(attributedPayload('7', 'user-a'));

		expect(client.getStringValue('flag-a', 'safe')).toBe('safe');

		const [exposure] = await deliverAll();
		expect(exposure?.attributes).toMatchObject({
			'feature_flag.result.reason': 'type_mismatch',
			'feature_flag.version': '7',
			'atl.feature_flag.target_apps': ['jira-frontend'],
			'feature_flag.error.message': 'FFP evaluation failed: type_mismatch',
			'atl.feature_flag.result.source': 'bootstrap',
		});
		expect(exposure?.attributes).not.toHaveProperty('feature_flag.result.variant');
	});

	it('attributes exposures to the payload request context when present', async () => {
		const client = initializedWithPayload(attributedPayload('7', 'user-a'));

		const details = client.getBooleanDetails('flag-a', false);

		const [exposure] = await deliverAll();
		expect(details.metadata.identifierValue).toBe('abc');
		expect(exposure?.attributes).toMatchObject({
			'atl.identifiers.AtlassianAccountId': 'user-a',
			'atl.attributes.plan': 'free',
		});
	});

	it('records no attributes when the payload request context omits them', async () => {
		const payload: BulkEvaluationPayload = {
			...attributedPayload('7', 'user-a'),
			requestContext: { identifiers: { AtlassianAccountId: 'user-a' } },
		};
		const client = clientWith();
		const user = testUser({ AtlassianAccountId: 'abc' }, { plan: 'enterprise' });
		expect(client.initialize(() => payload, user)).toEqual({ initialized: true });

		client.getBooleanValue('flag-a', false);

		const [exposure] = await deliverAll();
		expect(exposure?.attributes['atl.identifiers.AtlassianAccountId']).toBe('user-a');
		expect(
			Object.keys(exposure?.attributes ?? {}).filter((key) => key.startsWith('atl.attributes.')),
		).toEqual([]);
	});

	it('attributes exposures to the user passed to a failed initialization', async () => {
		const client = clientWith();
		const user = testUser({ AtlassianAccountId: 'user-a' }, { seats: 12 });
		const payloadWithoutRequestContext = { flags: PAYLOAD.flags } as BulkEvaluationPayload;
		expect(client.initialize(() => payloadWithoutRequestContext, user)).toMatchObject({
			initialized: false,
			reason: 'invalid_payload_shape',
		});

		client.getBooleanValue('flag-a', false);

		const [exposure] = await deliverAll();
		expect(exposure?.attributes).toMatchObject({
			'atl.feature_flag.result.source': 'fallback',
			'atl.identifiers.AtlassianAccountId': 'user-a',
			'atl.attributes.seats': 12,
		});
	});

	it('records a read before initialization without identifiers', async () => {
		const client = clientWith();

		client.getBooleanValue('flag-a', false);

		const [exposure] = await deliverAll();
		expect(exposure?.attributes['atl.feature_flag.result.source']).toBe('fallback');
		expect(
			Object.keys(exposure?.attributes ?? {}).some((key) => key.startsWith('atl.identifiers.')),
		).toBe(false);
	});

	it('suppresses the exposure of a read without changing its details', async () => {
		const client = initializedWith();
		const unsuppressed = clientWith({ enabled: false });
		unsuppressed.initialize(() => PAYLOAD, testUser());

		const details = client.getBooleanDetails('flag-a', false, { disableExposureLogging: true });

		expect(details).toEqual(unsuppressed.getBooleanDetails('flag-a', false));
		expect(client.getStringValue('string.flag', 'red', { disableExposureLogging: true })).toBe(
			'blue',
		);
		expect(await deliverAll()).toEqual([]);
	});

	it('records an exposure when options are not an object', async () => {
		const client = initializedWith();

		client.getBooleanValue('flag-a', false, null as unknown as undefined);

		expect(await deliverAll()).toHaveLength(1);
	});

	it('returns the same result without throwing when exposure telemetry fails', async () => {
		const client = initializedWith();
		environment.now = () => {
			throw new Error('clock unavailable');
		};
		environment.storageImpl = null;

		expect(() => client.getBooleanValue('flag-a', false)).not.toThrow();
		expect(client.getObjectDetails('object.flag', {}).value).toEqual({ theme: 'dark' });
		expect(() => client.logExposure(client.getBooleanDetails('flag-a', false))).not.toThrow();
	});
});

describe('manual exposures', () => {
	it('records one manual exposure after a suppressed read', async () => {
		const client = initializedWith();

		client.logExposure(client.getBooleanDetails('flag-a', false, { disableExposureLogging: true }));

		const exposures = await deliverAll();
		expect(exposures).toHaveLength(1);
		expect(exposures[0]?.attributes).toMatchObject({
			'feature_flag.key': 'flag-a',
			'atl.feature_flag.exposure.manual': true,
			'atl.feature_flag.result.source': 'bootstrap',
		});
	});

	it('deduplicates a manual exposure by the identifiers of its own read after replacement', async () => {
		const client = initializedWithPayload(attributedPayload('7', 'user-a'));
		const earlier = client.getBooleanDetails('flag-a', false, { disableExposureLogging: true });

		expect(client.replace(() => attributedPayload('7', 'user-b'), testUser()).replaced).toBe(true);
		client.getBooleanDetails('flag-a', false);
		client.logExposure(earlier);

		const exposures = await deliverAll();
		expect(
			exposures.map((exposure) => exposure.attributes['atl.identifiers.AtlassianAccountId']),
		).toEqual(['user-b', 'user-a']);
	});

	it('discards a manual exposure within the automatic deduplication window', async () => {
		const client = initializedWith();

		const details = client.getBooleanDetails('flag-a', false);
		environment.nowMs += 60_000;
		client.logExposure(details);

		expect(await deliverAll()).toHaveLength(1);
	});

	it('records a manual not-initialized exposure as a client fallback', async () => {
		const client = clientWith();

		client.logExposure(client.getBooleanDetails('flag-a', false, { disableExposureLogging: true }));

		const [exposure] = await deliverAll();
		expect(exposure?.attributes).toMatchObject({
			'feature_flag.result.reason': 'not_initialized',
			'feature_flag.error.message':
				'FFP evaluation failed: not_initialized (no initialize attempt completed)',
			'atl.feature_flag.result.source': 'fallback',
			'atl.feature_flag.exposure.manual': true,
		});
	});

	it('keeps a client-generated fallback a fallback after initialization supplies the flag', async () => {
		const client = clientWith();
		const details = client.getBooleanDetails('flag-a', false, { disableExposureLogging: true });
		client.initialize(() => PAYLOAD, testUser());

		client.logExposure({ ...details });

		const [exposure] = await deliverAll();
		expect(exposure?.attributes).toMatchObject({
			'feature_flag.result.reason': 'not_initialized',
			'feature_flag.error.message':
				'FFP evaluation failed: not_initialized (no initialize attempt completed)',
			'atl.feature_flag.result.source': 'fallback',
		});
		expect(exposure?.attributes).not.toHaveProperty('feature_flag.version');
	});

	it("keeps the read's attribution after a replacement", async () => {
		const client = initializedWithPayload(attributedPayload('3', 'user-a'));
		const details = client.getBooleanDetails('flag-a', false, { disableExposureLogging: true });
		expect(client.replace(() => attributedPayload('4', 'user-b'), testUser())).toEqual({
			replaced: true,
		});

		client.logExposure(details);

		const [exposure] = await deliverAll();
		expect(exposure?.attributes).toMatchObject({
			'feature_flag.version': '3',
			'atl.identifiers.AtlassianAccountId': 'user-a',
			'atl.feature_flag.client.version.token': 'token-3',
			'atl.feature_flag.exposure.manual': true,
		});
	});

	it.each([
		['before', true],
		['after', false],
	])(
		"does not share a replayed exposure's window with the new user's read %s it",
		async (_order, replayFirst) => {
			const client = initializedWithPayload(attributedPayload('3', 'user-a'));
			const details = client.getBooleanDetails('flag-a', false, { disableExposureLogging: true });
			client.replace(() => attributedPayload('4', 'user-b'), testUser());

			if (replayFirst) client.logExposure(details);
			client.getBooleanValue('flag-a', false);
			if (!replayFirst) client.logExposure(details);

			const users = (await deliverAll()).map(
				(exposure) => exposure.attributes['atl.identifiers.AtlassianAccountId'],
			);
			expect(users.sort()).toEqual(['user-a', 'user-b']);
		},
	);

	it('keeps the payload flag attribution for a manual type mismatch', async () => {
		const client = initializedWithPayload(attributedPayload('7', 'user-a'));

		client.logExposure(client.getStringDetails('flag-a', 'safe', { disableExposureLogging: true }));

		const [exposure] = await deliverAll();
		expect(exposure?.attributes).toMatchObject({
			'feature_flag.result.reason': 'type_mismatch',
			'feature_flag.version': '7',
			'atl.feature_flag.target_apps': ['jira-frontend'],
			'atl.feature_flag.exposure.manual': true,
		});
	});

	it('maps constructed not-initialized details against the initialized client', async () => {
		const client = initializedWithPayload(attributedPayload('3', 'user-a'));

		client.logExposure({
			value: false,
			metadata: {
				flagKey: 'flag-a',
				identifierType: null,
				identifierValue: null,
				matchReason: 'not_initialized',
				variationId: null,
				ruleId: null,
				holdoutAllocation: null,
				segments: [],
			},
		});

		const [exposure] = await deliverAll();
		expect(exposure?.attributes).toMatchObject({
			'feature_flag.result.reason': 'not_initialized',
			'atl.feature_flag.result.source': 'bootstrap',
			'feature_flag.error.message': 'FFP evaluation failed: not_initialized',
		});
	});

	it('maps details the client did not return against the current payload', async () => {
		const client = initializedWithPayload(attributedPayload('3', 'user-a'));
		expect(client.replace(() => attributedPayload('4', 'user-b'), testUser())).toEqual({
			replaced: true,
		});
		const details: EvaluationDetails<boolean> = {
			value: true,
			metadata: {
				flagKey: 'flag-a',
				identifierType: null,
				identifierValue: null,
				matchReason: 'ss_cohort_match',
				variationId: 'variation-on',
				ruleId: 'rule-a',
				holdoutAllocation: null,
				segments: [],
			},
		};

		client.logExposure(details);

		const [exposure] = await deliverAll();
		expect(exposure?.attributes).toMatchObject({
			'feature_flag.version': '4',
			'atl.identifiers.AtlassianAccountId': 'user-b',
			'atl.feature_flag.client.version.token': 'token-4',
			'atl.feature_flag.result.source': 'bootstrap',
		});
	});

	it('ignores malformed details without throwing', async () => {
		const client = initializedWith();

		expect(() => client.logExposure(null as unknown as EvaluationDetails<boolean>)).not.toThrow();
		expect(() => client.logExposure({} as EvaluationDetails<boolean>)).not.toThrow();
		for (const metadata of [{}, { flagKey: 'flag-a' }, { matchReason: 'default' }]) {
			client.logExposure({ metadata } as unknown as EvaluationDetails<boolean>);
		}
		expect(await deliverAll()).toEqual([]);
	});
});

describe('not-initialized messages and deduplication across replacement', () => {
	function messageOf(exposure: DeliveredExposure | undefined): AttributeValue {
		return exposure?.attributes['feature_flag.error.message'];
	}

	it('describes a read before any initialization attempt', async () => {
		clientWith().getBooleanValue('flag-a', false);

		expect(messageOf((await deliverAll())[0])).toBe(
			'FFP evaluation failed: not_initialized (no initialize attempt completed)',
		);
	});

	it('describes a re-entrant read from inside the first provider callback', async () => {
		const client = clientWith();

		client.initialize(() => {
			client.getBooleanValue('flag-a', false);
			return PAYLOAD;
		}, testUser());

		expect(messageOf((await deliverAll())[0])).toBe(
			'FFP evaluation failed: not_initialized (no initialize attempt completed)',
		);
	});

	it('names the most recent initialization failure reason', async () => {
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		const client = clientWith();
		client.initialize(
			() => ({ flags: 'not-a-map' }) as unknown as BulkEvaluationPayload,
			testUser(),
		);

		client.getBooleanValue('flag-a', false);

		expect(messageOf((await deliverAll())[0])).toBe(
			'FFP evaluation failed: not_initialized (invalid_payload_shape)',
		);
	});

	it('names the rejected schema version the client retains', async () => {
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		const client = clientWith();
		client.initialize(
			() => ({ ...PAYLOAD, vs: '2' }) as unknown as BulkEvaluationPayload,
			testUser(),
		);

		client.getBooleanValue('flag-a', false);

		expect(messageOf((await deliverAll())[0])).toBe(
			'FFP evaluation failed: not_initialized (invalid_schema_version "2")',
		);
	});

	it('keeps serving retained results after an already_initialized attempt', async () => {
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		const client = initializedWith();
		expect(client.initialize(() => PAYLOAD, testUser()).initialized).toBe(false);

		client.getBooleanValue('flag-a', false);

		const [exposure] = await deliverAll();
		expect(exposure?.attributes['feature_flag.result.reason']).toBe('ss_cohort_match');
		expect(messageOf(exposure)).toBeUndefined();
	});

	it('ends deduplication windows only on successful replacement', async () => {
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		const client = initializedWith();

		client.getBooleanValue('flag-a', false);
		client.getBooleanValue('flag-a', false);
		expect(
			client.replace(() => null as unknown as BulkEvaluationPayload, testUser()).replaced,
		).toBe(false);
		client.getBooleanValue('flag-a', false);
		expect(await deliverAll()).toHaveLength(1);

		expect(client.replace(() => PAYLOAD, testUser()).replaced).toBe(true);
		client.getBooleanValue('flag-a', false);
		expect(await deliverAll()).toHaveLength(2);
	});
});

describe('exposure storage', () => {
	it('reads and writes nothing in storage while disabled', () => {
		const storage = new FakeStorage();
		const setItem = jest.spyOn(storage, 'setItem');
		const getItem = jest.spyOn(storage, 'getItem');
		environment = new FakeExposureEnvironment(storage);
		stubGlobal('window', {});
		const client = initializedWith({ enabled: false });

		client.getBooleanValue('flag-a', false);

		expect(setItem).not.toHaveBeenCalled();
		expect(getItem).not.toHaveBeenCalled();
	});
});
