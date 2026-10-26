/**
 * @jest-environment node
 */

import { FlagClient } from '../client';
import * as payloadCapture from '../payload-capture';
import type {
	BulkEvaluationPayload,
	EnvironmentType,
	FlagClientOptions,
	FlagUser,
	PayloadAcquisitionFailureReason,
	PayloadProvider,
} from '../types';
import { EMPTY_USER, type FFPUser } from '../user-normalization';
import {
	bulkEvaluationPayloadFixture,
	initializedClient,
	result,
	TEST_CLIENT_OPTIONS,
	testUser,
	validPayload,
} from './_utils/test-payload-helper';

const PROVIDER_THREW_TIP =
	'Check the payload provider for thrown errors and confirm it synchronously returns a BulkEvaluationPayload.';
const NO_PAYLOAD_TIP =
	'Confirm the payload provider returns a BulkEvaluationPayload value instead of null or undefined.';
const INVALID_SHAPE_TIP =
	'Validate the provider result against the BulkEvaluationPayload shape before passing the provider to the client.';
const CAPTURE_FAILED_TIP =
	'Ensure the payload only contains cloneable data so the SDK can capture an immutable snapshot.';
const INVALID_SCHEMA_VERSION_TIP = 'Supply a payload whose vs schema version is "1", or omit vs.';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('FlagClient initialization', () => {
	it('returns identical values and details for payloads with or without vs = "1"', () => {
		const unversionedPayload = validPayload({
			flags: {
				'flag-a': result({ returnType: 'BOOLEAN', value: true }),
			},
		});
		const versionedPayload: BulkEvaluationPayload = {
			...unversionedPayload,
			vs: '1',
		};
		const unversionedClient = initializedClient(unversionedPayload);
		const versionedClient = initializedClient(versionedPayload);
		const unversionedDetails = unversionedClient.getBooleanDetails('flag-a', false);
		const versionedDetails = versionedClient.getBooleanDetails('flag-a', false);

		expect(unversionedDetails.value).toBe(true);
		expect(versionedDetails.value).toBe(true);
		expect(unversionedDetails).toEqual(versionedDetails);
	});

	it('constructs independent uninitialized clients without invoking providers', () => {
		const provider = jest.fn(() => validPayload());

		const first = new FlagClient(TEST_CLIENT_OPTIONS);
		const second = new FlagClient(TEST_CLIENT_OPTIONS);

		expect(provider).not.toHaveBeenCalled();
		expect(first.initialize(provider, testUser())).toEqual({ initialized: true });
		expect(second.initialize(provider, testUser())).toEqual({ initialized: true });
		expect(provider).toHaveBeenCalledTimes(2);
	});

	it('invokes the provider once during initialization and never during reads', () => {
		const provider = jest.fn(() => validPayload());
		const client = new FlagClient(TEST_CLIENT_OPTIONS);

		expect(client.initialize(provider, testUser())).toEqual({ initialized: true });
		client.getStringValue('selected.flag', 'fallback');
		client.getBooleanDetails('missing.flag', false);

		expect(provider).toHaveBeenCalledTimes(1);
	});

	it('retains the construction options and normalized user after successful initialization', () => {
		const client = initializedClient(validPayload(), testUser({ atlassianAccountId: 'user-a' }));

		expect(clientState(client).options).toEqual(TEST_CLIENT_OPTIONS);
		expect(clientState(client).currentUser.identifiers).toEqual({
			atlassianAccountId: 'user-a',
		});
	});

	it('retains an optional service version and omits it when absent', () => {
		const versioned = new FlagClient({ ...TEST_CLIENT_OPTIONS, serviceVersion: '1.2.3' });
		const unversioned = new FlagClient(TEST_CLIENT_OPTIONS);

		expect(clientState(versioned).options).toEqual({
			...TEST_CLIENT_OPTIONS,
			serviceVersion: '1.2.3',
		});
		expect(clientState(unversioned).options).not.toHaveProperty('serviceVersion');
	});

	it.each([
		['an empty string', ''],
		['whitespace only', ' \t '],
		['the all-apps sentinel', '$all'],
		['an untrimmed string', ' jira-frontend '],
		['a non-string value', 42],
	])(
		'constructs and initializes with %s as the target app, retaining it unchanged',
		(_description, targetApp) => {
			const client = new FlagClient({ ...TEST_CLIENT_OPTIONS, targetApp: targetApp as string });

			expect(client.initialize(() => validPayload(), testUser())).toEqual({ initialized: true });
			expect(clientState(client).options.targetApp).toBe(targetApp);
		},
	);

	it('copies the options so later mutation of the caller object has no effect', () => {
		const options: {
			targetApp: string;
			environmentType: EnvironmentType;
			serviceVersion?: string;
		} = {
			targetApp: 'jira-frontend',
			environmentType: 'staging',
		};
		const client = new FlagClient(options);

		options.targetApp = 'confluence-frontend';
		options.environmentType = 'prod';
		options.serviceVersion = '9.9.9';

		expect(clientState(client).options).toEqual({
			targetApp: 'jira-frontend',
			environmentType: 'staging',
		});
		expect(Object.isFrozen(clientState(client).options)).toBe(true);
	});

	it('constructs without throwing when an untyped caller omits the options', () => {
		const construct = (): FlagClient => new FlagClient(undefined as unknown as FlagClientOptions);

		expect(construct).not.toThrow();
		expect(construct().initialize(() => validPayload(), testUser())).toEqual({ initialized: true });
	});

	it('retains the most recent initialization failure reason and clears it on success', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		silenceWarnings();
		expect(clientState(client).lastInitializeFailure).toBeNull();

		client.initialize(() => {
			throw new Error('provider failed');
		}, testUser());
		expect(clientState(client).lastInitializeFailure).toBe('provider_threw');

		client.initialize(() => null as unknown as BulkEvaluationPayload, testUser());
		expect(clientState(client).lastInitializeFailure).toBe('provider_returned_no_payload');

		expect(client.initialize(() => validPayload(), testUser())).toEqual({ initialized: true });
		expect(clientState(client).lastInitializeFailure).toBeNull();
	});

	it('keeps the retained failure reason when replace fails with not_initialized', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		silenceWarnings();
		client.initialize(() => {
			throw new Error('provider failed');
		}, testUser());

		expect(client.replace(() => validPayload(), testUser())).toMatchObject({
			replaced: false,
			reason: 'not_initialized',
		});
		expect(clientState(client).lastInitializeFailure).toBe('provider_threw');
	});

	it('retains the attempted user when the provider fails, and replaces it on retry', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		silenceWarnings();

		expect(
			client.initialize(
				() => {
					throw new Error('provider failed');
				},
				testUser({ atlassianAccountId: 'user-a' }),
			),
		).toMatchObject({ initialized: false, reason: 'provider_threw' });
		expect(clientState(client).initialized).toBeNull();
		expect(clientState(client).currentUser.identifiers).toEqual({
			atlassianAccountId: 'user-a',
		});

		expect(
			client.initialize(() => validPayload(), testUser({ atlassianAccountId: 'user-b' })),
		).toEqual({ initialized: true });
		expect(clientState(client).currentUser.identifiers).toEqual({
			atlassianAccountId: 'user-b',
		});
	});

	it('fails already_initialized without invoking the provider or changing payload, user, or failure reason', () => {
		const client = initializedClient(
			validPayload({ flags: { 'flag-a': result({ returnType: 'STRING', value: 'first' }) } }),
			testUser({ atlassianAccountId: 'user-a' }),
		);
		const before = clientState(client);
		const warnSpy = silenceWarnings();
		const secondProvider = jest.fn(() =>
			validPayload({ flags: { 'flag-a': result({ returnType: 'STRING', value: 'second' }) } }),
		);

		expect(
			client.initialize(secondProvider, {
				identifiers: { atlassianAccountId: 'user-b', invalid: 7 },
			} as unknown as FlagUser),
		).toEqual({ initialized: false, reason: 'already_initialized' });

		expect(secondProvider).not.toHaveBeenCalled();
		expect(clientState(client).initialized).toBe(before.initialized);
		expect(clientState(client).currentUser).toBe(before.currentUser);
		expect(clientState(client).lastInitializeFailure).toBeNull();
		expect(client.getStringValue('flag-a', 'fallback')).toBe('first');
		expect(warnSpy).toHaveBeenCalledTimes(1);
		expect(warnSpy).toHaveBeenCalledWith('Flag client initialization failed', {
			reason: 'already_initialized',
			tip: 'Call replace() to serve a different payload or user from an initialized FlagClient.',
		});
	});

	it('returns provider_threw with the error and leaves the client uninitialized', () => {
		const error = new Error('provider failed');
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		const warnSpy = silenceWarnings();

		expect(
			client.initialize(() => {
				throw error;
			}, testUser()),
		).toEqual({ initialized: false, reason: 'provider_threw', error });

		expect(warnSpy).toHaveBeenCalledWith('Flag client initialization failed', {
			reason: 'provider_threw',
			tip: PROVIDER_THREW_TIP,
			error,
		});
		expect(client.initialize(() => validPayload(), testUser())).toEqual({
			initialized: true,
		});
	});

	it.each([
		['undefined', undefined],
		['null', null],
	])(
		'returns provider_returned_no_payload when the provider returns %s',
		(_description, missingPayload) => {
			const client = new FlagClient(TEST_CLIENT_OPTIONS);
			const warnSpy = silenceWarnings();
			const outcome = client.initialize(
				(() => missingPayload) as unknown as PayloadProvider,
				testUser(),
			);

			expect(outcome).toEqual({ initialized: false, reason: 'provider_returned_no_payload' });
			expect('error' in outcome).toBe(false);
			expect(warnSpy).toHaveBeenCalledWith('Flag client initialization failed', {
				reason: 'provider_returned_no_payload',
				tip: NO_PAYLOAD_TIP,
			});
		},
	);

	it.each([
		['an async provider', () => Promise.resolve(validPayload())],
		['a bare flag map', () => validPayload().flags],
		['a payload without flags', () => ({ requestContext: { identifiers: {}, attributes: {} } })],
		['a payload without requestContext', () => ({ vs: '1', flags: validPayload().flags })],
	])('returns invalid_payload_shape for %s', (_description, provider) => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		const warnSpy = silenceWarnings();

		expect(client.initialize(provider as unknown as PayloadProvider, testUser())).toEqual({
			initialized: false,
			reason: 'invalid_payload_shape',
		});
		expect(clientState(client).initialized).toBeNull();
		expect(warnSpy).toHaveBeenCalledWith('Flag client initialization failed', {
			reason: 'invalid_payload_shape',
			tip: INVALID_SHAPE_TIP,
		});
	});

	it.each([
		[
			'a payload whose flags getter throws',
			() => {
				const error = new Error('getter failed');
				return {
					error,
					payload: Object.defineProperty({}, 'flags', {
						enumerable: true,
						get: () => {
							throw error;
						},
					}),
				};
			},
		],
		[
			'a revoked proxy payload',
			() => {
				const { proxy, revoke } = Proxy.revocable(validPayload(), {});
				revoke();
				return { error: expect.any(TypeError) as unknown, payload: proxy };
			},
		],
	])('returns invalid_payload_shape without throwing for %s', (_description, makePayload) => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		const warnSpy = silenceWarnings();
		const { error, payload } = makePayload();

		expect(
			client.initialize(() => payload as unknown as BulkEvaluationPayload, testUser()),
		).toEqual({ initialized: false, reason: 'invalid_payload_shape', error });
		expect(clientState(client).initialized).toBeNull();
		expect(warnSpy).toHaveBeenCalledWith('Flag client initialization failed', {
			reason: 'invalid_payload_shape',
			tip: INVALID_SHAPE_TIP,
			error,
		});
	});

	it('returns payload_capture_failed when payload capture fails', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		const warnSpy = silenceWarnings();
		jest.spyOn(payloadCapture, 'capturePayload').mockReturnValueOnce(null);

		expect(client.initialize(() => validPayload(), testUser())).toEqual({
			initialized: false,
			reason: 'payload_capture_failed',
		});
		expect(warnSpy).toHaveBeenCalledWith('Flag client initialization failed', {
			reason: 'payload_capture_failed',
			tip: CAPTURE_FAILED_TIP,
		});
		expect(client.initialize(() => validPayload(), testUser())).toEqual({
			initialized: true,
		});
	});

	it('fails invalid_payload_shape when the payload changes between validation and capture', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		const warnSpy = silenceWarnings();
		const payload = payloadThatChangesDuringCapture();

		expect(client.initialize(() => payload, testUser())).toEqual({
			initialized: false,
			reason: 'invalid_payload_shape',
		});
		expect(clientState(client).initialized).toBeNull();
		expect(client.getBooleanValue('flag-a', false)).toBe(false);
		expect(warnSpy).toHaveBeenCalledWith('Flag client initialization failed', {
			reason: 'invalid_payload_shape',
			tip: INVALID_SHAPE_TIP,
		});
	});
});

describe('FlagClient replacement', () => {
	it('fails not_initialized without invoking the provider or normalizing the user', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		const warnSpy = silenceWarnings();
		const provider = jest.fn(() => validPayload());

		expect(
			client.replace(provider, { identifiers: { invalid: 7 } } as unknown as FlagUser),
		).toEqual({ replaced: false, reason: 'not_initialized' });

		expect(provider).not.toHaveBeenCalled();
		expect(clientState(client).initialized).toBeNull();
		expect(clientState(client).currentUser).toBe(EMPTY_USER);
		expect(warnSpy).toHaveBeenCalledTimes(1);
		expect(warnSpy).toHaveBeenCalledWith('Flag client replacement failed', {
			reason: 'not_initialized',
			tip: 'Call initialize() successfully before calling replace().',
		});
	});

	it('does not change the user retained by a failed initialization when replacement is not_initialized', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		silenceWarnings();
		client.initialize(
			() => {
				throw new Error('provider failed');
			},
			testUser({ atlassianAccountId: 'user-a' }),
		);

		client.replace(() => validPayload(), testUser({ atlassianAccountId: 'user-b' }));

		expect(clientState(client).currentUser.identifiers).toEqual({
			atlassianAccountId: 'user-a',
		});
	});

	it('swaps payload and user together on success and keeps the construction options', () => {
		const client = initializedClient(
			validPayload({ flags: { 'flag-a': result({ returnType: 'BOOLEAN', value: false }) } }),
			testUser({ AtlassianAccountId: 'user-a' }),
		);
		const provider = jest.fn(() =>
			validPayload({ flags: { 'flag-a': result({ returnType: 'BOOLEAN', value: true }) } }),
		);

		expect(client.replace(provider, testUser({ AtlassianAccountId: 'user-b' }))).toEqual({
			replaced: true,
		});

		expect(provider).toHaveBeenCalledTimes(1);
		expect(client.getBooleanValue('flag-a', false)).toBe(true);
		expect(client.getBooleanDetails('flag-a', false).metadata.identifierValue).toBe('user-b');
		expect(clientState(client).options).toEqual(TEST_CLIENT_OPTIONS);
	});

	it('allows repeated replacement', () => {
		const client = initializedClient();

		for (const value of ['one', 'two', 'three']) {
			expect(
				client.replace(
					() => validPayload({ flags: { 'flag-a': result({ returnType: 'STRING', value }) } }),
					testUser(),
				),
			).toEqual({ replaced: true });
			expect(client.getStringValue('flag-a', 'fallback')).toBe(value);
		}
	});

	it.each<[string, PayloadProvider, string, string]>([
		[
			'provider_threw',
			() => {
				throw new Error('replacement failed');
			},
			'provider_threw',
			PROVIDER_THREW_TIP,
		],
		[
			'provider_returned_no_payload',
			(() => null) as unknown as PayloadProvider,
			'provider_returned_no_payload',
			NO_PAYLOAD_TIP,
		],
		[
			'invalid_payload_shape',
			(() => ({ status: 'OK' })) as unknown as PayloadProvider,
			'invalid_payload_shape',
			INVALID_SHAPE_TIP,
		],
		[
			'invalid_payload_shape from a payload that throws when read',
			(() =>
				Object.defineProperty({}, 'flags', {
					get: () => {
						throw new Error('getter failed');
					},
				})) as unknown as PayloadProvider,
			'invalid_payload_shape',
			INVALID_SHAPE_TIP,
		],
	])(
		'keeps the previous payload and user when replacement fails with %s',
		(_name, provider, reason, tip) => {
			const client = initializedClient(
				validPayload({ flags: { 'flag-a': result({ returnType: 'BOOLEAN', value: false }) } }),
				testUser({ AtlassianAccountId: 'user-a' }),
			);
			const before = clientState(client);
			const warnSpy = silenceWarnings();

			const outcome = client.replace(provider, testUser({ AtlassianAccountId: 'user-b' }));

			expect(outcome).toMatchObject({ replaced: false, reason });
			expect(clientState(client).initialized).toBe(before.initialized);
			expect(clientState(client).currentUser).toBe(before.currentUser);
			expect(client.getBooleanValue('flag-a', true)).toBe(false);
			expect(client.getBooleanDetails('flag-a', true).metadata.identifierValue).toBe('user-a');
			expect(warnSpy).toHaveBeenCalledWith(
				'Flag client replacement failed',
				expect.objectContaining({ reason, tip }),
			);
		},
	);

	it('keeps the previous payload and user when replacement capture fails', () => {
		const client = initializedClient(validPayload(), testUser({ AtlassianAccountId: 'user-a' }));
		const before = clientState(client);
		const warnSpy = silenceWarnings();
		jest.spyOn(payloadCapture, 'capturePayload').mockReturnValueOnce(null);

		expect(
			client.replace(() => validPayload(), testUser({ AtlassianAccountId: 'user-b' })),
		).toEqual({
			replaced: false,
			reason: 'payload_capture_failed',
		});
		expect(clientState(client).initialized).toBe(before.initialized);
		expect(clientState(client).currentUser).toBe(before.currentUser);
		expect(warnSpy).toHaveBeenCalledWith('Flag client replacement failed', {
			reason: 'payload_capture_failed',
			tip: CAPTURE_FAILED_TIP,
		});
	});

	it('keeps the previous state when the payload changes between validation and capture', () => {
		const client = initializedClient();
		const before = clientState(client);
		silenceWarnings();
		const payload = payloadThatChangesDuringCapture();

		expect(client.replace(() => payload, testUser({ AtlassianAccountId: 'user-b' }))).toEqual({
			replaced: false,
			reason: 'invalid_payload_shape',
		});
		expect(clientState(client).initialized).toBe(before.initialized);
		expect(clientState(client).currentUser).toBe(before.currentUser);
	});

	it('includes the thrown error in replacement failures', () => {
		const client = initializedClient();
		const error = new Error('replacement failed');
		const warnSpy = silenceWarnings();

		expect(
			client.replace(() => {
				throw error;
			}, testUser()),
		).toEqual({ replaced: false, reason: 'provider_threw', error });
		expect(warnSpy).toHaveBeenCalledWith('Flag client replacement failed', {
			reason: 'provider_threw',
			tip: PROVIDER_THREW_TIP,
			error,
		});
	});
});

describe('FlagClient diagnostics', () => {
	it('never logs identifier values, attribute values, or payload contents', () => {
		const warnSpy = silenceWarnings();
		const user = {
			identifiers: { atlassianAccountId: 'secret-account', tenantId: 999 },
			attributes: { plan: 'secret-plan', ratio: Number.NaN },
		} as unknown as FlagUser;
		const payload: BulkEvaluationPayload = validPayload({
			flags: { 'flag-a': result({ returnType: 'STRING', value: 'secret-value' }) },
			requestContext: { identifiers: { atlassianAccountId: 'secret-context' }, attributes: {} },
		});

		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		client.initialize(() => {
			throw new Error('provider failed');
		}, user);
		client.initialize(() => payload, user);
		client.initialize(() => payload, user);
		client.replace(() => ({ status: 'ERROR' }) as unknown as BulkEvaluationPayload, user);
		new FlagClient(TEST_CLIENT_OPTIONS).replace(() => payload, user);

		const logged = JSON.stringify(warnSpy.mock.calls);
		for (const secret of [
			'secret-account',
			'999',
			'secret-plan',
			'NaN',
			'secret-value',
			'secret-context',
		]) {
			expect(logged).not.toContain(secret);
		}
	});
});

describe('FlagClient schema version', () => {
	const booleanFlags = { 'flag-a': result({ returnType: 'BOOLEAN', value: true }) };

	it('initializes from a payload whose vs is "1" or absent', () => {
		const versioned = initializedClient(validPayload({ vs: '1', flags: booleanFlags }));
		const unversioned = initializedClient({
			flags: booleanFlags,
			requestContext: validPayload().requestContext,
		});
		const fixture = initializedClient(bulkEvaluationPayloadFixture('selected-value'));

		expect(versioned.getBooleanValue('flag-a', false)).toBe(true);
		expect(unversioned.getBooleanValue('flag-a', false)).toBe(true);
		expect(clientState(fixture).initialized).not.toBeNull();
	});

	it.each([
		['null', null, null],
		['the number 1', 1, null],
		['"2"', '2', '2'],
		['an empty string', '', ''],
	])(
		'fails initialization when vs is %s and retains only a string rejected version',
		(_name, vs, rejected) => {
			const warnSpy = silenceWarnings();
			const client = new FlagClient(TEST_CLIENT_OPTIONS);
			const payload = { vs, flags: booleanFlags } as unknown as BulkEvaluationPayload;

			expect(client.initialize(() => payload, testUser())).toEqual({
				initialized: false,
				reason: 'invalid_schema_version',
			});
			expect(clientState(client).initialized).toBeNull();
			expect(clientState(client).lastInitializeFailure).toBe('invalid_schema_version');
			expect(clientState(client).rejectedSchemaVersion).toBe(rejected);
			expect(client.getBooleanValue('flag-a', false)).toBe(false);
			expect(client.getBooleanDetails('flag-a', false).metadata.matchReason).toBe(
				'not_initialized',
			);
			expect(warnSpy).toHaveBeenCalledWith('Flag client initialization failed', {
				reason: 'invalid_schema_version',
				tip: INVALID_SCHEMA_VERSION_TIP,
			});
		},
	);

	it('checks the schema version before the payload shape', () => {
		silenceWarnings();
		const client = new FlagClient(TEST_CLIENT_OPTIONS);

		expect(
			client.initialize(() => ({ vs: '2' }) as unknown as BulkEvaluationPayload, testUser()),
		).toEqual({ initialized: false, reason: 'invalid_schema_version' });
		expect(client.initialize(() => '1' as unknown as BulkEvaluationPayload, testUser())).toEqual({
			initialized: false,
			reason: 'invalid_payload_shape',
		});
		expect(clientState(client).rejectedSchemaVersion).toBeNull();
	});

	it('clears the rejected schema version on any later initialization attempt', () => {
		silenceWarnings();
		const unsupported = (vs: unknown) => () =>
			({ vs, flags: booleanFlags }) as unknown as BulkEvaluationPayload;
		const client = new FlagClient(TEST_CLIENT_OPTIONS);

		client.initialize(unsupported('2'), testUser());
		expect(clientState(client).rejectedSchemaVersion).toBe('2');
		client.initialize(unsupported(2), testUser());
		expect(clientState(client).rejectedSchemaVersion).toBeNull();

		client.initialize(unsupported('3'), testUser());
		client.initialize(() => {
			throw new Error('provider failed');
		}, testUser());
		expect(clientState(client).lastInitializeFailure).toBe('provider_threw');
		expect(clientState(client).rejectedSchemaVersion).toBeNull();

		client.initialize(unsupported('4'), testUser());
		expect(client.initialize(() => validPayload(), testUser())).toEqual({ initialized: true });
		expect(clientState(client).lastInitializeFailure).toBeNull();
		expect(clientState(client).rejectedSchemaVersion).toBeNull();

		client.initialize(unsupported('5'), testUser());
		expect(clientState(client).lastInitializeFailure).toBeNull();
		expect(clientState(client).rejectedSchemaVersion).toBeNull();
	});

	it('keeps the previous state when replacement fails with an unsupported schema version', () => {
		const client = initializedClient(
			validPayload({ flags: { 'flag-a': result({ returnType: 'BOOLEAN', value: false }) } }),
			testUser({ atlassianAccountId: 'user-a' }),
		);
		const before = clientState(client);
		const warnSpy = silenceWarnings();

		expect(
			client.replace(
				() => ({ vs: '2', flags: booleanFlags }) as unknown as BulkEvaluationPayload,
				testUser({ atlassianAccountId: 'user-b' }),
			),
		).toEqual({ replaced: false, reason: 'invalid_schema_version' });
		expect(clientState(client).initialized).toBe(before.initialized);
		expect(clientState(client).currentUser).toBe(before.currentUser);
		expect(clientState(client).lastInitializeFailure).toBeNull();
		expect(clientState(client).rejectedSchemaVersion).toBeNull();
		expect(client.getBooleanValue('flag-a', true)).toBe(false);
		expect(warnSpy).toHaveBeenCalledWith('Flag client replacement failed', {
			reason: 'invalid_schema_version',
			tip: INVALID_SCHEMA_VERSION_TIP,
		});
	});
});

describe('FlagClient client version', () => {
	const clientVersion = { token: 'v1', updatedAt: '2026-10-13T00:00:00Z' };

	it('retains a frozen client version with the payload after initialization', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		const provided = { ...validPayload(), clientVersion: { ...clientVersion } };

		client.initialize(() => provided, testUser());
		provided.clientVersion.token = 'mutated';

		const retained = clientState(client).initialized?.payload.clientVersion;
		expect(retained).toEqual(clientVersion);
		expect(Object.isFrozen(retained)).toBe(true);
	});

	it('swaps the client version on a successful replacement and clears it when omitted', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		client.initialize(() => ({ ...validPayload(), clientVersion }), testUser());

		expect(
			client.replace(() => ({ ...validPayload(), clientVersion: { token: 'v2' } }), testUser()),
		).toEqual({ replaced: true });
		expect(clientState(client).initialized?.payload.clientVersion).toEqual({ token: 'v2' });

		expect(client.replace(() => validPayload(), testUser())).toEqual({ replaced: true });
		expect(clientState(client).initialized?.payload.clientVersion).toBeUndefined();
	});

	it('keeps the client version when a replacement fails', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		client.initialize(() => ({ ...validPayload(), clientVersion }), testUser());

		expect(
			client.replace(
				(() => ({ ...validPayload(), clientVersion: { token: '' } })) as PayloadProvider,
				testUser(),
			),
		).toEqual({ replaced: false, reason: 'invalid_payload_shape' });
		expect(clientState(client).initialized?.payload.clientVersion).toEqual(clientVersion);
	});

	it('fails initialization with a malformed client version', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);

		expect(
			client.initialize(
				(() => ({ ...validPayload(), clientVersion: { token: '' } })) as PayloadProvider,
				testUser(),
			),
		).toEqual({ initialized: false, reason: 'invalid_payload_shape' });
		expect(clientState(client).initialized).toBeNull();
	});

	it('does not affect value reads or details metadata', () => {
		const withVersion = new FlagClient(TEST_CLIENT_OPTIONS);
		const withoutVersion = new FlagClient(TEST_CLIENT_OPTIONS);
		withVersion.initialize(() => ({ ...validPayload(), clientVersion }), testUser());
		withoutVersion.initialize(() => validPayload(), testUser());

		for (const flagKey of Object.keys(validPayload().flags)) {
			expect(withVersion.getBooleanDetails(flagKey, false)).toEqual(
				withoutVersion.getBooleanDetails(flagKey, false),
			);
			expect(withVersion.getStringDetails(flagKey, 'fallback')).toEqual(
				withoutVersion.getStringDetails(flagKey, 'fallback'),
			);
		}
	});
});

describe('FlagClient request context', () => {
	const identifiers = { atlassianAccountId: 'user-a' };

	it('retains empty attributes when a request context loses them between validation and capture', () => {
		const payload = payloadThatChangesDuringCapture(
			'requestContext',
			{ identifiers, attributes: { plan: 'free' } },
			{ identifiers },
		);
		const client = new FlagClient(TEST_CLIENT_OPTIONS);

		expect(client.initialize(() => payload, testUser())).toEqual({ initialized: true });
		expect(clientState(client).initialized?.payload.requestContext).toEqual({
			identifiers,
			attributes: {},
		});
	});

	it('retains empty attributes for a request context that omits them', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		const provided = { ...validPayload(), requestContext: { identifiers } };

		expect(client.initialize(() => provided, testUser())).toEqual({ initialized: true });

		const retained = clientState(client).initialized?.payload.requestContext;
		expect(retained).toEqual({ identifiers, attributes: {} });
		expect(Object.isFrozen(retained?.attributes)).toBe(true);
		expect(provided.requestContext).toEqual({ identifiers });
	});

	it('retains present attributes unchanged', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		const requestContext = { identifiers, attributes: { plan: 'free' } };

		client.initialize(() => ({ ...validPayload(), requestContext }), testUser());

		expect(clientState(client).initialized?.payload.requestContext).toEqual(requestContext);
	});

	it('retains empty attributes after a replacement that omits them', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		client.initialize(
			() => ({ ...validPayload(), requestContext: { identifiers, attributes: { plan: 'free' } } }),
			testUser(),
		);

		expect(
			client.replace(() => ({ ...validPayload(), requestContext: { identifiers } }), testUser()),
		).toEqual({ replaced: true });
		expect(clientState(client).initialized?.payload.requestContext).toEqual({
			identifiers,
			attributes: {},
		});
	});

	it('fails initialization with null attributes', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);

		expect(
			client.initialize(
				(() => ({
					...validPayload(),
					requestContext: { identifiers, attributes: null },
				})) as unknown as PayloadProvider,
				testUser(),
			),
		).toEqual({ initialized: false, reason: 'invalid_payload_shape' });
		expect(clientState(client).initialized).toBeNull();
	});
});

/** Package-internal test seam for private client state. */
function clientState(client: FlagClient): {
	initialized: { payload: BulkEvaluationPayload } | null;
	options: Readonly<FlagClientOptions>;
	lastInitializeFailure: PayloadAcquisitionFailureReason | null;
	rejectedSchemaVersion: string | null;
	currentUser: FFPUser;
} {
	const state = client as unknown as {
		initialized: { payload: BulkEvaluationPayload } | null;
		retained: {
			options: Readonly<FlagClientOptions>;
			lastInitializeFailure: PayloadAcquisitionFailureReason | null;
			rejectedSchemaVersion: string | null;
		};
		currentUser: FFPUser;
	};
	return {
		initialized: state.initialized,
		options: state.retained.options,
		lastInitializeFailure: state.retained.lastInitializeFailure,
		rejectedSchemaVersion: state.retained.rejectedSchemaVersion,
		currentUser: state.currentUser,
	};
}

function silenceWarnings(): ReturnType<typeof jest.spyOn> {
	return jest.spyOn(console, 'warn').mockImplementation(() => undefined);
}

/**
 * A valid payload whose `member` getter returns `before` until capture starts and `after` once it
 * has, so the snapshot differs from the object that was validated. By default `flags` becomes
 * `null`.
 */
function payloadThatChangesDuringCapture(
	member: 'flags' | 'requestContext' = 'flags',
	before: unknown = { 'flag-a': result({ returnType: 'BOOLEAN', value: true }) },
	after: unknown = null,
): BulkEvaluationPayload {
	let capturing = false;
	const capture = payloadCapture.capturePayload;
	jest.spyOn(payloadCapture, 'capturePayload').mockImplementationOnce((...args) => {
		capturing = true;
		return capture(...args);
	});
	const payload: Record<string, unknown> = { ...validPayload() };
	Object.defineProperty(payload, member, {
		enumerable: true,
		get: () => (capturing ? after : before),
	});
	return payload as unknown as BulkEvaluationPayload;
}
