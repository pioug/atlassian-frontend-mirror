/**
 * @jest-environment node
 */

import { FlagClient } from '../client';
import type {
	BulkEvaluationPayload,
	BulkEvaluationPayloadV1,
	BulkEvaluationResult,
	EnvironmentType,
	ExposureLoggingOptions,
	FlagClientOptions,
	EvaluationDetails,
	EvaluationMetadata,
	EvaluationOptions,
	FlagResult,
	FlagUser,
	HoldoutAllocationMetadata,
	InitializeResult,
	PayloadProvider,
	ReplaceResult,
	SegmentEvaluationMetadata,
} from '../types';
import {
	bulkEvaluationPayloadFixture,
	initializedClient,
	result,
	TEST_CLIENT_OPTIONS,
	testUser,
	validPayload,
} from './_utils/test-payload-helper';
import { assertTypeEqual, assertTypeAssignable } from './_utils/type-assertions';

const BOOLEAN_FLAG = 'admin-toolbar.enabled';
const STRING_FLAG = 'selected.flag';
const NUMBER_FLAG = 'search.max-results';
const OBJECT_FLAG = 'object.flag';

type ObjectFlagValue = { readonly fallback: true } | { readonly nested: readonly string[] };

afterEach(() => {
	jest.restoreAllMocks();
});

describe('FlagClient evaluation', () => {
	it('returns initialized values and keeps value reads aligned with details', () => {
		const client = initializedClient(evaluatedFlagsPayload());
		const fallbackObject: ObjectFlagValue = { fallback: true };

		const booleanDetails = client.getBooleanDetails(BOOLEAN_FLAG, false);
		const stringDetails = client.getStringDetails(STRING_FLAG, 'fallback-value');
		const numberDetails = client.getNumberDetails(NUMBER_FLAG, 10);
		const objectDetails = client.getObjectDetails<ObjectFlagValue>(OBJECT_FLAG, fallbackObject);

		expect(booleanDetails.value).toBe(true);
		expect(client.getBooleanValue(BOOLEAN_FLAG, false)).toBe(booleanDetails.value);
		expect(stringDetails.value).toBe('value-0');
		expect(client.getStringValue(STRING_FLAG, 'fallback-value')).toBe(stringDetails.value);
		expect(numberDetails.value).toBe(25);
		expect(client.getNumberValue(NUMBER_FLAG, 10)).toBe(numberDetails.value);
		expect(objectDetails.value).toEqual({ nested: ['value'] });
		expect(client.getObjectValue<ObjectFlagValue>(OBJECT_FLAG, fallbackObject)).toEqual(
			objectDetails.value,
		);
		assertTypeEqual<typeof objectDetails, EvaluationDetails<ObjectFlagValue>>();
	});

	it('accepts additive server SDK metadata without applying migration routing', () => {
		const client = initializedClient(
			validPayload({
				flags: {
					[BOOLEAN_FLAG]: result({
						returnType: 'BOOLEAN',
						value: true,
						metadata: {
							sdkMetadata: { migrationState: 'STATSIG' },
							identifierType: null,
							matchReason: 'migration_deferred',
							variationId: null,
							ruleId: null,
						},
					}),
				},
			}),
		);

		expect(client.getBooleanValue(BOOLEAN_FLAG, false)).toBe(true);
		expect(client.getBooleanDetails(BOOLEAN_FLAG, false).metadata).toEqual(
			fallbackShapedMetadata(BOOLEAN_FLAG, 'migration_deferred'),
		);
	});

	it('ignores a payload-level status when serving reads', () => {
		expect(
			initializedClient(bulkEvaluationPayloadFixture('partial')).getStringValue(
				STRING_FLAG,
				'fallback-value',
			),
		).toBe('value-0');

		const errorStatusPayload = {
			status: 'ERROR',
			requestContext: validPayload().requestContext,
			flags: { 'service.degraded.flag': result({ returnType: 'NUMBER', value: 99 }) },
		} as unknown as BulkEvaluationPayload;
		expect(initializedClient(errorStatusPayload).getNumberValue('service.degraded.flag', 10)).toBe(
			99,
		);
	});

	it('reports flag_not_found for an empty payload that carries a NOT_INITIALISED status', () => {
		const client = initializedClient(bulkEvaluationPayloadFixture('not-initialised'));

		expect(client.getStringDetails(STRING_FLAG, 'fallback-value')).toEqual({
			value: 'fallback-value',
			metadata: fallbackMetadata(STRING_FLAG, 'flag_not_found'),
		});
	});

	it('returns safe defaults for absent flags', () => {
		const client = initializedClient(validPayload({ flags: {} }));
		const fallbackObject: ObjectFlagValue = { fallback: true };

		expect(client.getStringValue('missing.flag', 'fallback-value')).toBe('fallback-value');
		expect(client.getObjectValue('bad-object.flag', fallbackObject)).toBe(fallbackObject);
	});

	it('returns safe defaults for unusable flag results', () => {
		const client = initializedClient(
			validPayload({
				flags: {
					[BOOLEAN_FLAG]: result({ returnType: 'BOOLEAN', value: true }),
					[NUMBER_FLAG]: result({ returnType: 'NUMBER', value: 'twenty-five' }),
				},
			}),
		);
		const safeCodeDefaultClient = initializedClient(
			bulkEvaluationPayloadFixture('safe-code-default'),
		);

		expect(client.getStringValue(BOOLEAN_FLAG, 'fallback-label')).toBe('fallback-label');
		expect(client.getNumberValue(NUMBER_FLAG, 10)).toBe(10);
		expect(safeCodeDefaultClient.getBooleanValue('safe-default.flag', false)).toBe(false);
	});

	it('returns type mismatch details when the requested value type does not match the flag result', () => {
		const client = initializedClient(
			validPayload({
				flags: {
					[BOOLEAN_FLAG]: result({ returnType: 'BOOLEAN', value: true }),
				},
			}),
		);

		const details = client.getStringDetails(BOOLEAN_FLAG, 'fallback-label');

		expect(details).toEqual({
			value: 'fallback-label',
			metadata: fallbackMetadata(BOOLEAN_FLAG, 'type_mismatch'),
		});
		expect(client.getStringValue(BOOLEAN_FLAG, 'fallback-label')).toBe(details.value);
	});

	it('hydrates result metadata and resolves identifier values from the current user', () => {
		const client = initializedClient(
			validPayload({
				flags: {
					[BOOLEAN_FLAG]: result({
						returnType: 'BOOLEAN',
						value: true,
						metadata: {
							identifierType: 'AtlassianAccountId',
							matchReason: 'ss_cohort_match',
							variationId: 'variation-on',
							ruleId: 'rule-a',
						},
					}),
				},
			}),
			testUser({ AtlassianAccountId: 'abc' }),
		);

		expect(client.getBooleanDetails(BOOLEAN_FLAG, false).metadata).toEqual({
			flagKey: BOOLEAN_FLAG,
			identifierType: 'AtlassianAccountId',
			identifierValue: 'abc',
			matchReason: 'ss_cohort_match',
			variationId: 'variation-on',
			ruleId: 'rule-a',
			holdoutAllocation: null,
			segments: [],
		});
	});

	it('never resolves identifier values from the payload request context', () => {
		const flags = {
			[BOOLEAN_FLAG]: result({
				metadata: {
					identifierType: 'AtlassianAccountId',
					matchReason: 'ss_cohort_match',
					variationId: 'variation-on',
					ruleId: 'rule-a',
				},
			}),
		};
		const requestContext = {
			identifiers: { AtlassianAccountId: 'context-value' },
			attributes: {},
		};

		const userValueClient = initializedClient(
			validPayload({ flags, requestContext }),
			testUser({ AtlassianAccountId: 'user-value' }),
		);
		const userLacksIdentifierClient = initializedClient(
			validPayload({ flags, requestContext }),
			testUser({ OtherId: 'other' }),
		);

		expect(userValueClient.getBooleanDetails(BOOLEAN_FLAG, false).metadata.identifierValue).toBe(
			'user-value',
		);
		expect(
			userLacksIdentifierClient.getBooleanDetails(BOOLEAN_FLAG, false).metadata.identifierValue,
		).toBeNull();
	});

	it('uses null identifier fields when identifier values or types are absent', () => {
		const client = initializedClient(
			validPayload({
				flags: {
					'missing-identifier.flag': result({
						returnType: 'BOOLEAN',
						value: true,
						metadata: {
							identifierType: 'AtlassianAccountId',
							matchReason: 'ss_cohort_match',
							variationId: 'variation-on',
							ruleId: 'rule-a',
						},
					}),
					'no-identifier-type.flag': result({
						returnType: 'BOOLEAN',
						value: true,
						metadata: {
							matchReason: 'all_rules_skipped',
							variationId: null,
							ruleId: null,
						},
					}),
				},
			}),
			{ identifiers: {} },
		);

		expect(client.getBooleanDetails('missing-identifier.flag', false).metadata).toMatchObject({
			identifierType: 'AtlassianAccountId',
			identifierValue: null,
		});
		expect(client.getBooleanDetails('no-identifier-type.flag', false).metadata).toEqual(
			fallbackShapedMetadata('no-identifier-type.flag', 'all_rules_skipped'),
		);
	});

	it('treats a null identifier type as absent even when the user has identifiers', () => {
		const client = initializedClient(
			validPayload({
				flags: {
					'null-identifier-type.flag': result({
						returnType: 'BOOLEAN',
						value: true,
						metadata: {
							identifierType: null,
							matchReason: 'all_rules_skipped',
							variationId: null,
							ruleId: null,
						},
					}),
				},
			}),
			{ identifiers: { AtlassianAccountId: 'abc' } },
		);

		expect(client.getBooleanDetails('null-identifier-type.flag', false).metadata).toMatchObject({
			identifierType: null,
			identifierValue: null,
		});
	});

	it('returns client-generated fallback metadata for unavailable results', () => {
		expect(new FlagClient(TEST_CLIENT_OPTIONS).getBooleanDetails(BOOLEAN_FLAG, false)).toEqual({
			value: false,
			metadata: fallbackMetadata(BOOLEAN_FLAG, 'not_initialized'),
		});

		expect(
			initializedClient(validPayload({ flags: {} })).getStringDetails('missing.flag', 'fallback'),
		).toEqual({
			value: 'fallback',
			metadata: fallbackMetadata('missing.flag', 'flag_not_found'),
		});

		const mismatchClient = initializedClient(
			validPayload({
				flags: {
					[BOOLEAN_FLAG]: result({ returnType: 'BOOLEAN', value: true }),
					[NUMBER_FLAG]: result({ returnType: 'NUMBER', value: 'twenty-five' }),
				},
			}),
		);

		expect(mismatchClient.getStringDetails(BOOLEAN_FLAG, 'fallback')).toEqual({
			value: 'fallback',
			metadata: fallbackMetadata(BOOLEAN_FLAG, 'type_mismatch'),
		});
		expect(mismatchClient.getNumberDetails(NUMBER_FLAG, 10)).toEqual({
			value: 10,
			metadata: fallbackMetadata(NUMBER_FLAG, 'type_mismatch'),
		});
	});

	it('reports not_initialized after a failed initialization, even though the user was retained', () => {
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		const client = new FlagClient(TEST_CLIENT_OPTIONS);

		client.initialize(
			() => {
				throw new Error('provider failed');
			},
			testUser({ AtlassianAccountId: 'abc' }),
		);

		expect(client.getStringDetails(STRING_FLAG, 'fallback')).toEqual({
			value: 'fallback',
			metadata: fallbackMetadata(STRING_FLAG, 'not_initialized'),
		});
	});

	it('preserves server metadata and resolves the user identifier for code-default-backed reads', () => {
		const client = initializedClient(
			validPayload({
				flags: {
					[BOOLEAN_FLAG]: result({
						returnType: 'BOOLEAN',
						useCodeDefault: true,
						metadata: {
							identifierType: 'AtlassianAccountId',
							matchReason: 'ss_cohort_match',
							variationId: 'variation-off',
							ruleId: 'rule-code-default',
						},
					}),
				},
			}),
			testUser({ AtlassianAccountId: 'abc' }),
		);

		expect(client.getBooleanDetails(BOOLEAN_FLAG, false)).toEqual({
			value: false,
			metadata: {
				flagKey: BOOLEAN_FLAG,
				identifierType: 'AtlassianAccountId',
				identifierValue: 'abc',
				matchReason: 'ss_cohort_match',
				variationId: 'variation-off',
				ruleId: 'rule-code-default',
				holdoutAllocation: null,
				segments: [],
			},
		});
	});

	it('returns holdout and segment metadata in details, frozen, for value and code-default results', () => {
		const holdoutAllocation = { holdoutKey: 'h1', holdoutRuleId: 'hr-1', extra: true };
		const segments = [{ segmentKey: 's1', result: 'MATCHED' }];
		const metadata = {
			identifierType: null,
			matchReason: 'holdout_match',
			variationId: null,
			ruleId: null,
			holdoutAllocation,
			segments,
			targetApps: ['jira-frontend'],
			flagVersion: '42',
			errorMessage: 'partial evaluation',
		};
		const client = initializedClient(
			validPayload({
				flags: {
					'value.flag': result({ returnType: 'BOOLEAN', value: true, metadata }),
					'code-default.flag': result({ returnType: 'BOOLEAN', useCodeDefault: true, metadata }),
				},
			}),
		);

		for (const flagKey of ['value.flag', 'code-default.flag']) {
			const detailsMetadata = client.getBooleanDetails(flagKey, false).metadata;

			expect(detailsMetadata.holdoutAllocation).toEqual(holdoutAllocation);
			expect(detailsMetadata.segments).toEqual(segments);
			expect(Object.isFrozen(detailsMetadata.holdoutAllocation)).toBe(true);
			expect(Object.isFrozen(detailsMetadata.segments)).toBe(true);
			expect(detailsMetadata).not.toHaveProperty('targetApps');
			expect(detailsMetadata).not.toHaveProperty('flagVersion');
			expect(detailsMetadata).not.toHaveProperty('errorMessage');
		}
	});

	it.each([
		['a null holdout allocation', { holdoutAllocation: null }],
		['a holdout allocation list', { holdoutAllocations: [{ holdoutKey: 'h1' }] }],
	])('returns a null holdout allocation in details for %s', (_description, holdout) => {
		const client = initializedClient({
			requestContext: validPayload().requestContext,
			flags: {
				'holdout.flag': result({
					returnType: 'BOOLEAN',
					value: true,
					metadata: { matchReason: 'ss_cohort_match', ...holdout },
				}),
			},
		});

		expect(client.getBooleanDetails('holdout.flag', false).metadata.holdoutAllocation).toBeNull();
	});

	it('ignores provider payload mutation after initialization or replacement', () => {
		const initialPayload = metadataArrayPayload('initial');
		const client = initializedClient(initialPayload);

		initialPayload.flags['array-metadata.flag'].metadata.holdoutAllocation.holdoutKey = 'x';
		initialPayload.flags['array-metadata.flag'].metadata.segments.length = 0;
		expect(client.getBooleanDetails('array-metadata.flag', false).metadata).toMatchObject({
			holdoutAllocation: { holdoutKey: 'initial' },
			segments: [{ segmentKey: 'initial' }],
		});

		const replacementPayload = metadataArrayPayload('replacement');
		expect(client.replace(() => replacementPayload, testUser())).toEqual({ replaced: true });
		replacementPayload.flags['array-metadata.flag'].metadata.holdoutAllocation.holdoutKey = 'x';
		replacementPayload.flags['array-metadata.flag'].value = false;

		expect(client.getBooleanValue('array-metadata.flag', false)).toBe(true);
		expect(client.getBooleanDetails('array-metadata.flag', false).metadata).toMatchObject({
			holdoutAllocation: { holdoutKey: 'replacement' },
			segments: [{ segmentKey: 'replacement' }],
		});
	});

	it('keeps later object and array reads stable after mutation attempts against initialized values', () => {
		const client = initializedClient(
			validPayload({
				flags: {
					'object.flag': result({
						returnType: 'JSON',
						value: { nested: ['before'] },
					}),
					'array.flag': result({
						returnType: 'JSON',
						value: ['before'],
					}),
				},
			}),
		);

		const objectDetails = client.getObjectDetails<{ nested: string[] }>('object.flag', {
			nested: ['fallback'],
		});
		const arrayDetails = client.getObjectDetails<string[]>('array.flag', ['fallback']);

		attemptMutation(() => {
			objectDetails.value.nested.push('after');
		});
		attemptMutation(() => {
			arrayDetails.value.push('after');
		});

		expect(client.getObjectValue('object.flag', { nested: ['fallback'] })).toEqual({
			nested: ['before'],
		});
		expect(client.getObjectValue('array.flag', ['fallback'])).toEqual(['before']);
	});
});

describe('FlagClient public types', () => {
	it('declares the initialize, replace, payload, and user signatures', () => {
		assertTypeEqual<ConstructorParameters<typeof FlagClient>, [FlagClientOptions]>();
		assertTypeEqual<
			FlagClientOptions,
			{
				readonly targetApp: string;
				readonly environmentType: EnvironmentType;
				readonly serviceVersion?: string;
				readonly exposureLogging?: ExposureLoggingOptions;
			}
		>();
		assertTypeEqual<
			ExposureLoggingOptions,
			{
				readonly enabled?: boolean;
				readonly endpoint?: string;
				readonly batchSize?: number;
				readonly flushIntervalMs?: number;
			}
		>();
		assertTypeEqual<
			EvaluationOptions,
			{
				readonly disableExposureLogging?: boolean;
			}
		>();
		assertTypeEqual<
			Parameters<FlagClient['getBooleanValue']>,
			[string, boolean, EvaluationOptions?]
		>();
		assertTypeEqual<
			Parameters<FlagClient['getStringDetails']>,
			[string, string, EvaluationOptions?]
		>();
		assertTypeEqual<ReturnType<FlagClient['logExposure']>, void>();
		assertTypeEqual<EnvironmentType, 'dev' | 'local' | 'staging' | 'prod'>();
		assertTypeEqual<Parameters<FlagClient['initialize']>, [PayloadProvider, FlagUser]>();
		assertTypeEqual<ReturnType<FlagClient['initialize']>, InitializeResult>();
		assertTypeEqual<Parameters<FlagClient['replace']>, [PayloadProvider, FlagUser]>();
		assertTypeEqual<ReturnType<FlagClient['replace']>, ReplaceResult>();
		assertTypeEqual<ReturnType<PayloadProvider>, BulkEvaluationPayload>();
		assertTypeEqual<BulkEvaluationPayload['flags'], BulkEvaluationResult>();
		assertTypeEqual<BulkEvaluationResult, Readonly<Record<string, FlagResult>>>();
		assertTypeEqual<FlagUser['identifiers'], Readonly<Record<string, string>>>();
		assertTypeEqual<EvaluationMetadata['holdoutAllocation'], HoldoutAllocationMetadata | null>();
		assertTypeEqual<EvaluationMetadata['segments'], readonly SegmentEvaluationMetadata[]>();
	});

	it('declares BulkEvaluationPayload as the union of supported wire formats', () => {
		assertTypeEqual<BulkEvaluationPayload, BulkEvaluationPayloadV1>();
		assertTypeEqual<BulkEvaluationPayloadV1['vs'], '1' | undefined>();
	});

	it('declares the initialization and replacement failure reasons', () => {
		type InitializeReason = Extract<InitializeResult, { initialized: false }>['reason'];
		type ReplaceReason = Extract<ReplaceResult, { replaced: false }>['reason'];

		assertTypeEqual<
			InitializeReason,
			| 'already_initialized'
			| 'provider_threw'
			| 'provider_returned_no_payload'
			| 'invalid_schema_version'
			| 'invalid_payload_shape'
			| 'payload_capture_failed'
		>();
		assertTypeEqual<
			ReplaceReason,
			| 'not_initialized'
			| 'provider_threw'
			| 'provider_returned_no_payload'
			| 'invalid_schema_version'
			| 'invalid_payload_shape'
			| 'payload_capture_failed'
		>();
	});

	it('rejects construction without options, calls that omit the user, and mistyped values', () => {
		const client = new FlagClient(TEST_CLIENT_OPTIONS);
		const provider: PayloadProvider = () => validPayload();
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);

		// @ts-expect-error construction requires client options.
		const withoutOptions = new FlagClient();
		// @ts-expect-error client options require a target app.
		const withoutTargetApp = new FlagClient({ environmentType: 'dev' });
		// @ts-expect-error client options require an environment type.
		const withoutEnvironmentType = new FlagClient({ targetApp: 'jira-frontend' });
		const unknownEnvironment = new FlagClient({
			targetApp: 'jira-frontend',
			// @ts-expect-error the environment type must be dev, local, staging, or prod.
			environmentType: 'production',
		});
		const withoutServiceVersion = new FlagClient({
			targetApp: 'jira-frontend',
			environmentType: 'prod',
		});
		// @ts-expect-error initialize requires a user.
		client.initialize(provider);
		// @ts-expect-error initialize no longer accepts a target app.
		client.initialize(provider, 'jira-frontend', testUser());
		// @ts-expect-error replace does not accept a target app.
		client.replace(provider, 'jira-frontend', testUser());
		// @ts-expect-error replace requires a user.
		client.replace(provider);
		// @ts-expect-error identifier values must be strings.
		const numericIdentifier: FlagUser = { identifiers: { atlassianAccountId: 42 } };
		// @ts-expect-error attribute values must be strings, numbers, or booleans.
		const objectAttribute: FlagUser = { identifiers: {}, attributes: { nested: {} } };
		// @ts-expect-error a bare flag map is not a BulkEvaluationPayload.
		const bareMap: BulkEvaluationPayload = validPayload().flags;
		const { requestContext } = validPayload();
		const withoutSchemaVersion: BulkEvaluationPayload = { flags: {}, requestContext };
		const unsupportedSchemaVersion: BulkEvaluationPayload = {
			// @ts-expect-error the schema version must be '1'.
			vs: '2',
			flags: {},
			requestContext,
		};
		// @ts-expect-error a payload must carry its request context.
		const withoutRequestContext: BulkEvaluationPayload = { flags: {} };

		expect([
			withoutOptions,
			withoutTargetApp,
			withoutEnvironmentType,
			unknownEnvironment,
			withoutServiceVersion,
			numericIdentifier,
			objectAttribute,
			bareMap,
			withoutSchemaVersion,
			unsupportedSchemaVersion,
			withoutRequestContext,
		]).toHaveLength(11);
	});

	it('accepts a user without attributes', () => {
		assertTypeAssignable<{ identifiers: Record<string, string> }, FlagUser>();
	});
});

/** A payload whose single flag has mutable holdout and segment metadata tagged with `label`. */
function metadataArrayPayload(label: string): {
	flags: Record<
		string,
		{
			returnType: 'BOOLEAN';
			value: boolean;
			useCodeDefault: false;
			metadata: {
				matchReason: string;
				holdoutAllocation: Record<string, unknown>;
				segments: Array<Record<string, unknown>>;
			};
		}
	>;
	requestContext: BulkEvaluationPayload['requestContext'];
} {
	return {
		requestContext: validPayload().requestContext,
		flags: {
			'array-metadata.flag': {
				returnType: 'BOOLEAN',
				value: true,
				useCodeDefault: false,
				metadata: {
					matchReason: 'no_rules_matched',
					holdoutAllocation: { holdoutKey: label },
					segments: [{ segmentKey: label }],
				},
			},
		},
	};
}

function evaluatedFlagsPayload(): BulkEvaluationPayload {
	return {
		requestContext: validPayload().requestContext,
		flags: {
			[BOOLEAN_FLAG]: result({ returnType: 'BOOLEAN', value: true }),
			[STRING_FLAG]: result({ returnType: 'STRING', value: 'value-0' }),
			[NUMBER_FLAG]: result({ returnType: 'NUMBER', value: 25 }),
			[OBJECT_FLAG]: result({
				returnType: 'JSON',
				value: { nested: ['value'] },
			}),
		},
	};
}

/** Metadata the client generates when it cannot use a flag result. */
function fallbackMetadata(flagKey: string, matchReason: string): EvaluationMetadata {
	return fallbackShapedMetadata(flagKey, matchReason);
}

/** Metadata with null identifier, variation, and rule fields and no holdouts or segments. */
function fallbackShapedMetadata(flagKey: string, matchReason: string): EvaluationMetadata {
	return {
		flagKey,
		identifierType: null,
		identifierValue: null,
		matchReason,
		variationId: null,
		ruleId: null,
		holdoutAllocation: null,
		segments: [],
	};
}

function attemptMutation(mutation: () => void): void {
	try {
		mutation();
	} catch (error) {
		// Compare by name rather than `instanceof`: under Jest's node environment, errors thrown by
		// built-ins (for example pushing to a frozen array) come from a different realm than the
		// test's global `TypeError`.
		if (
			!(
				typeof error === 'object' &&
				error !== null &&
				'name' in error &&
				error.name === 'TypeError'
			)
		) {
			throw error;
		}
	}
}
