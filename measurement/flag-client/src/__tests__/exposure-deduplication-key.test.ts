/**
 * @jest-environment node
 */

import { FlagClient } from '../client';
import { setExposureClockFactory } from '../exposure/clock';
import { serializeExposureIdentity } from '../exposure/deduplication';
import { setExposureDelivery } from '../exposure/delivery-loader';
import { exposureDigest, initializeExposureHash } from '../exposure/digest';
import { createExposureEnvironment, setExposureEnvironmentFactory } from '../exposure/environment';
import { createExposureLogger } from '../exposure/logger';
import { mapExposureRecord, type ExposureMappingInput } from '../exposure/mapper';
import type { ExportLogsServiceRequest, OtlpLogRecord } from '../exposure/otlp';
import { FakeExposureEnvironment, settle } from './_utils/exposure-fakes';
import { flagResult, plainAttributes, resultInput, user } from './_utils/exposure-test-helper';

function input(overrides: Partial<ExposureMappingInput> = {}): ExposureMappingInput {
	return resultInput(flagResult({ identifierType: 'TenantId' }), {
		requestContext: { identifiers: { TenantId: 'tenant-7' }, attributes: {} },
		...overrides,
	});
}

describe('browser exposure deduplication keys', () => {
	it('uses the producer identifierType and captured value in the dedupe identity', () => {
		const source = flagResult({ identifierType: 'TenantId' });
		const first = resultInput(source, {
			requestContext: { identifiers: { TenantId: 'alice' }, attributes: {} },
		});
		const second = {
			...first,
			requestContext: { identifiers: { TenantId: 'bob' }, attributes: {} },
		};
		const serialized = serializeExposureIdentity(first);
		expect(JSON.parse(serialized!)).toMatchObject({
			randomizationIdentifier: 'TenantId',
			randomizationIdentifierValue: 'alice',
		});
		expect(serializeExposureIdentity(second)).not.toBe(serialized);
	});

	it('captures a stable sorted identity for complete selected-unit context', () => {
		// Exact stable serialization is the shared local-admission and wire-digest input.
		expect(serializeExposureIdentity(input())).toBe(
			'{"flagKey":"flag-a","holdoutAllocation":null,"matchReason":"rule_match","randomizationIdentifier":"TenantId","randomizationIdentifierValue":"tenant-7","returnType":"BOOLEAN","ruleId":"rule-1","stableSplitOutcome":null,"value":true,"variationId":"on"}',
		);
	});

	it('encodes unavailable original identity and return type as explicit nulls', () => {
		expect(serializeExposureIdentity(input({ flagResult: null, requestContext: undefined }))).toBe(
			'{"flagKey":"flag-a","holdoutAllocation":null,"matchReason":"rule_match","randomizationIdentifier":null,"randomizationIdentifierValue":null,"returnType":null,"ruleId":"rule-1","stableSplitOutcome":null,"value":true,"variationId":"on"}',
		);
	});

	it('keeps a key when the original flag result is unavailable', () => {
		expect(serializeExposureIdentity(input({ flagResult: null }))).toMatch(/^\{/);
	});

	it('keeps a key when the original request context is unavailable', () => {
		expect(serializeExposureIdentity(input({ requestContext: undefined }))).toMatch(/^\{/);
	});

	it('normalizes absent and empty selected identifier names to null', () => {
		const missing = resultInput(flagResult(), { requestContext: input().requestContext });
		const empty = resultInput(flagResult({ identifierType: '' }), {
			requestContext: input().requestContext,
		});
		const key = serializeExposureIdentity(missing);
		expect(key).toMatch(/^\{/);
		expect(serializeExposureIdentity(empty)).toBe(key);
	});

	it('preserves empty selected identifier values separately from absence', () => {
		const missing = input({ requestContext: { identifiers: {}, attributes: {} } });
		const empty = input({
			requestContext: { identifiers: { TenantId: '' }, attributes: {} },
		});
		const key = serializeExposureIdentity(missing);
		expect(key).toMatch(/^\{/);
		expect(serializeExposureIdentity(empty)).not.toBe(key);
		expect(JSON.parse(serializeExposureIdentity(empty)!).randomizationIdentifierValue).toBe('');
		expect(serializeExposureIdentity(input())).not.toBe(key);
	});

	it.each(['actual', 'hypothetical'])(
		'preserves empty %s holdout identifier values separately from absence',
		(kind) => {
			const holdout = {
				holdoutKey: 'holdout-a',
				identifierType: 'HoldoutId',
				allocationReason: 'allocated',
			};
			const source = flagResult({
				identifierType: 'TenantId',
				...(kind === 'actual'
					? { holdoutAllocation: holdout }
					: {
							stableSplitOutcome: {
								variationId: 'control',
								matchReason: 'ss_cohort_match',
								holdoutAllocation: holdout,
							},
						}),
			});
			const absent = resultInput(source, {
				requestContext: { identifiers: { TenantId: 'tenant-7' }, attributes: {} },
			});
			const empty = {
				...absent,
				requestContext: { identifiers: { TenantId: 'tenant-7', HoldoutId: '' }, attributes: {} },
			};
			const absentKey = serializeExposureIdentity(absent);
			const emptyKey = serializeExposureIdentity(empty);
			expect(absentKey).not.toBeNull();
			expect(emptyKey).not.toBeNull();
			expect(emptyKey).not.toBe(absentKey);
			const identity = JSON.parse(emptyKey!);
			expect(
				(kind === 'actual'
					? identity.holdoutAllocation
					: identity.stableSplitOutcome.holdoutAllocation
				).identifierValue,
			).toBe('');
		},
	);

	it('groups unknown selected values without substituting current user identities', () => {
		const first = input({ requestContext: undefined, user: user({ TenantId: 'tenant-a' }) });
		const second = input({ requestContext: undefined, user: user({ TenantId: 'tenant-b' }) });
		expect(serializeExposureIdentity(first)).toBe(serializeExposureIdentity(second));
		expect(serializeExposureIdentity(first)).not.toBeNull();
	});

	it('distinguishes an unknown identifier from the literal string null', () => {
		const unknown = input({ requestContext: undefined });
		const literal = input({
			requestContext: { identifiers: { TenantId: 'null' }, attributes: {} },
		});
		expect(serializeExposureIdentity(unknown)).not.toBe(serializeExposureIdentity(literal));
	});

	it('preserves known identifier names when values are unknown', () => {
		const tenant = input({ requestContext: undefined });
		const account = resultInput(flagResult({ identifierType: 'AccountId' }));
		expect(serializeExposureIdentity(tenant)).not.toBe(serializeExposureIdentity(account));
	});

	it('preserves supplied result value changes when original context is missing', () => {
		const first = input({ flagResult: null, requestContext: undefined });
		const second = { ...first, details: { ...first.details, value: false } };
		expect(serializeExposureIdentity(first)).not.toBe(serializeExposureIdentity(second));
	});

	it('encodes an unavailable actual-holdout identifier value as null', () => {
		const result = flagResult({
			identifierType: 'TenantId',
			holdoutAllocation: {
				holdoutKey: 'holdout-a',
				holdoutRuleId: 'holdout-rule',
				identifierType: 'OrgId',
				allocationReason: 'allocated',
			},
		});
		const missing = resultInput(result, { requestContext: input().requestContext });
		const complete = resultInput(result, {
			requestContext: {
				identifiers: { TenantId: 'tenant-7', OrgId: 'org-3' },
				attributes: {},
			},
		});
		expect(serializeExposureIdentity(missing)).toMatch(/^\{/);
		expect(serializeExposureIdentity(missing)).not.toBe(serializeExposureIdentity(complete));
	});

	it('encodes an unavailable actual-holdout identifier name as null', () => {
		const result = flagResult({
			identifierType: 'TenantId',
			holdoutAllocation: {
				holdoutKey: 'holdout-a',
				allocationReason: 'allocated',
			},
		});
		expect(
			serializeExposureIdentity(resultInput(result, { requestContext: input().requestContext })),
		).toMatch(/^\{/);
	});

	it('continues to bypass malformed non-identity holdout metadata', () => {
		const result = flagResult({
			identifierType: 'TenantId',
			holdoutAllocation: { holdoutKey: 7, allocationReason: 'allocated' },
		});
		expect(serializeExposureIdentity(resultInput(result))).toBeNull();
	});

	it('normalizes a reserved per-request holdout identifier value to null', () => {
		const result = flagResult({
			identifierType: 'TenantId',
			holdoutAllocation: {
				holdoutKey: 'holdout-a',
				identifierType: 'randomizationId',
				allocationReason: 'allocated',
			},
		});
		const first = resultInput(result, {
			requestContext: {
				identifiers: { TenantId: 'tenant-7', randomizationId: 'request-a' },
				attributes: {},
			},
		});
		const second = {
			...first,
			requestContext: {
				identifiers: { TenantId: 'tenant-7', randomizationId: 'request-b' },
				attributes: {},
			},
		};
		const key = serializeExposureIdentity(first);
		expect(key).not.toBeNull();
		expect(serializeExposureIdentity(second)).toBe(key);
		expect(JSON.parse(key!).holdoutAllocation).toMatchObject({
			identifierType: 'randomizationId',
			identifierValue: null,
		});
	});

	it.each([
		'not_initialized',
		'flag_not_found',
		'type_mismatch',
		'general_error',
		'invalid_context',
	])('builds the ordinary identity for error outcome %s', (matchReason) => {
		const attempt = input({ flagResult: null, requestContext: undefined });
		const error = {
			...attempt,
			details: { ...attempt.details, metadata: { ...attempt.details.metadata, matchReason } },
		};
		const key = serializeExposureIdentity(error);
		expect(key).not.toBeNull();
		expect(JSON.parse(key!)).toMatchObject({
			matchReason,
			randomizationIdentifierValue: null,
			returnType: null,
		});
		expect(key).not.toBe(serializeExposureIdentity(attempt));
	});

	it('normalizes the reserved per-request identifier value without reading it', () => {
		const result = flagResult({ identifierType: 'randomizationId' });
		const identifiers = Object.defineProperty({}, 'randomizationId', {
			get: () => {
				throw new Error('reserved value must not be read');
			},
		});
		const baseline = serializeExposureIdentity(resultInput(result));
		expect(baseline).not.toBeNull();
		for (const value of [undefined, '', 'request-a', 'request-b']) {
			expect(
				serializeExposureIdentity(
					resultInput(result, {
						requestContext: {
							identifiers: value === undefined ? {} : { randomizationId: value },
							attributes: {},
						},
					}),
				),
			).toBe(baseline);
		}
		expect(
			serializeExposureIdentity(
				resultInput(result, { requestContext: { identifiers, attributes: {} } }),
			),
		).toBe(baseline);
		expect(JSON.parse(baseline!)).toMatchObject({
			randomizationIdentifier: 'randomizationId',
			randomizationIdentifierValue: null,
		});
	});

	it('keeps reserved identifier matching case-sensitive and retains other unit values', () => {
		const result = flagResult({ identifierType: 'RandomizationId' });
		const first = resultInput(result, {
			requestContext: { identifiers: { RandomizationId: 'a' }, attributes: {} },
		});
		const second = {
			...first,
			requestContext: { identifiers: { RandomizationId: 'b' }, attributes: {} },
		};
		expect(serializeExposureIdentity(first)).not.toBe(serializeExposureIdentity(second));
	});

	it('includes a captured counterfactual and preserves indeterminate reasons with null variation', () => {
		const absent = input();
		const source = flagResult({
			identifierType: 'TenantId',
			stableSplitOutcome: { matchReason: 'general_error' },
		});
		const attempt = resultInput(source, { requestContext: absent.requestContext });
		const key = serializeExposureIdentity(attempt);
		expect(key).not.toBe(serializeExposureIdentity(absent));
		expect(JSON.parse(key!).stableSplitOutcome).toEqual({
			matchReason: 'general_error',
			variationId: null,
			holdoutAllocation: null,
		});
	});

	it.each([
		{ variationId: 'control', matchReason: 'ss_cohort_match' },
		{ variationId: 'treatment', matchReason: 'ss_cohort_match' },
		{ variationId: 'control', matchReason: 'ss_not_allocated' },
		{
			variationId: 'control',
			matchReason: 'ss_holdout_withheld',
			holdoutAllocation: {
				holdoutKey: 'hypothetical-holdout',
				identifierType: 'OrgId',
				allocationReason: 'withheld',
			},
		},
	])(
		'distinguishes counterfactual allocation %j under the same served result',
		(stableSplitOutcome) => {
			const baseline = input();
			const attempt = resultInput(flagResult({ identifierType: 'TenantId', stableSplitOutcome }), {
				requestContext: baseline.requestContext,
			});
			expect(serializeExposureIdentity(attempt)).not.toBe(serializeExposureIdentity(baseline));
			const detailsOverride = {
				...baseline,
				details: {
					...baseline.details,
					metadata: { ...baseline.details.metadata, stableSplitOutcome },
				},
			};
			expect(serializeExposureIdentity(detailsOverride)).toBe(serializeExposureIdentity(attempt));
		},
	);

	it('distinguishes counterfactual variation/reason changes and supports explicit absence overrides', () => {
		const result = flagResult({
			identifierType: 'TenantId',
			stableSplitOutcome: { variationId: 'control', matchReason: 'ss_cohort_match' },
		});
		const original = resultInput(result, { requestContext: input().requestContext });
		const changedVariation = {
			...original,
			details: {
				...original.details,
				metadata: {
					...original.details.metadata,
					stableSplitOutcome: { variationId: 'treatment', matchReason: 'ss_cohort_match' },
				},
			},
		};
		const changedReason = {
			...original,
			details: {
				...original.details,
				metadata: {
					...original.details.metadata,
					stableSplitOutcome: { variationId: 'control', matchReason: 'ss_not_allocated' },
				},
			},
		};
		expect(serializeExposureIdentity(original)).not.toBe(
			serializeExposureIdentity(changedVariation),
		);
		expect(serializeExposureIdentity(original)).not.toBe(serializeExposureIdentity(changedReason));
		const removed = {
			...original,
			details: {
				...original.details,
				metadata: { ...original.details.metadata, stableSplitOutcome: null },
			},
		};
		expect(serializeExposureIdentity(removed)).toBe(serializeExposureIdentity(input()));
	});

	it('includes the hypothetical holdout own original unit without substituting actual allocation', () => {
		const result = flagResult({
			identifierType: 'TenantId',
			stableSplitOutcome: {
				variationId: 'control',
				matchReason: 'ss_holdout_withheld',
				holdoutAllocation: {
					holdoutKey: 'holdout-a',
					identifierType: 'OrgId',
					allocationReason: 'withheld',
				},
			},
		});
		const first = resultInput(result, {
			requestContext: {
				identifiers: { TenantId: 'tenant-7', OrgId: 'org-a', AccountId: 'account-a' },
				attributes: {},
			},
		});
		const changed = {
			...first,
			requestContext: {
				identifiers: { TenantId: 'tenant-7', OrgId: 'org-b', AccountId: 'account-a' },
				attributes: {},
			},
		};
		const unrelated = {
			...first,
			requestContext: {
				identifiers: { TenantId: 'tenant-7', OrgId: 'org-a', AccountId: 'account-b' },
				attributes: {},
			},
		};
		const key = serializeExposureIdentity(first);
		expect(key).not.toBe(serializeExposureIdentity(changed));
		expect(key).toBe(serializeExposureIdentity(unrelated));
		expect(JSON.parse(key!).holdoutAllocation).toBeNull();
		expect(JSON.parse(key!).stableSplitOutcome.holdoutAllocation).toEqual({
			holdoutKey: 'holdout-a',
			holdoutRuleId: null,
			identifierType: 'OrgId',
			allocationReason: 'withheld',
			identifierValue: 'org-a',
		});
	});

	it('normalizes hypothetical holdout randomizationId without reading the generated value', () => {
		const result = flagResult({
			identifierType: 'TenantId',
			stableSplitOutcome: {
				matchReason: 'general_error',
				holdoutAllocation: {
					holdoutKey: 'holdout-a',
					identifierType: 'randomizationId',
					allocationReason: 'unsupported_rule',
				},
			},
		});
		const identifiers = Object.defineProperty({ TenantId: 'tenant-7' }, 'randomizationId', {
			get: () => {
				throw new Error('reserved hypothetical value must not be read');
			},
		});
		const attempt = resultInput(result, { requestContext: { identifiers, attributes: {} } });
		const key = serializeExposureIdentity(attempt);
		expect(key).not.toBeNull();
		expect(JSON.parse(key!).stableSplitOutcome.holdoutAllocation.identifierValue).toBeNull();
	});

	it('normalizes unknown hypothetical units without substituting current user identities', () => {
		const result = flagResult({
			identifierType: 'TenantId',
			stableSplitOutcome: {
				matchReason: 'ss_holdout_withheld',
				holdoutAllocation: { holdoutKey: 'holdout-a', allocationReason: 'withheld' },
			},
		});
		const attempt = resultInput(result, { user: user({ OrgId: 'current-org' }) });
		const parsed = JSON.parse(serializeExposureIdentity(attempt)!);
		expect(parsed.stableSplitOutcome.holdoutAllocation).toMatchObject({
			identifierType: null,
			identifierValue: null,
		});
	});

	it('bypasses malformed counterfactual metadata rather than omitting identity components', () => {
		const result = flagResult({
			identifierType: 'TenantId',
			stableSplitOutcome: { matchReason: '' },
		});
		expect(serializeExposureIdentity(resultInput(result))).toBeNull();
	});

	it.each([undefined, NaN, Infinity, BigInt(1)])(
		'continues to bypass unsupported result value %s',
		(value) => {
			const attempt = input({ flagResult: null, requestContext: undefined });
			expect(
				serializeExposureIdentity({ ...attempt, details: { ...attempt.details, value } }),
			).toBeNull();
		},
	);

	it('shares synchronous admission between automatic and manual unknown identities', () => {
		const environment = new FakeExposureEnvironment();
		const logger = createExposureLogger(
			{ endpoint: 'https://xp.atlassian.com/ft/v1/logs', batchSize: 100, flushIntervalMs: 10_000 },
			environment,
		);
		const attempt = input({ flagResult: null, requestContext: undefined });
		let produced = 0;
		const produce = () => {
			produced += 1;
			return mapExposureRecord(attempt);
		};
		logger.log(attempt, produce);
		logger.log({ ...attempt, manual: true }, produce);
		expect(produced).toBe(1);
	});

	it("retains a delayed manual result's unknown identity after a replacement supplies one", async () => {
		const environment = new FakeExposureEnvironment();
		setExposureEnvironmentFactory(() => environment);
		setExposureClockFactory(() => environment);
		setExposureDelivery({ createExposureEnvironment, createExposureLogger, mapExposureRecord });
		try {
			const original = flagResult();
			const originalContext = { identifiers: { TenantId: 'tenant-old' }, attributes: {} };
			const client = new FlagClient({
				targetApp: 'jira-frontend',
				environmentType: 'prod',
				exposureLogging: { enabled: true },
			});
			expect(
				client.initialize(
					() => ({ flags: { 'flag-a': original }, requestContext: originalContext }),
					{ identifiers: { TenantId: 'tenant-old' } },
				),
			).toEqual({ initialized: true });
			const details = client.getBooleanDetails('flag-a', false, { disableExposureLogging: true });
			expect(environment.pendingTimers).toBe(0);
			expect(
				client.replace(
					() => ({
						flags: { 'flag-a': flagResult({ identifierType: 'TenantId' }) },
						requestContext: { identifiers: { TenantId: 'tenant-new' } },
					}),
					{ identifiers: { TenantId: 'tenant-new' } },
				),
			).toEqual({ replaced: true });
			client.logExposure(details);
			client.logExposure(details);
			client.getBooleanValue('flag-a', false);
			environment.advance(10_000);
			await settle();
			const body = JSON.parse(environment.requests[0].init.body) as ExportLogsServiceRequest;
			const records = body.resourceLogs.flatMap((resource) =>
				resource.scopeLogs.flatMap((scope) => scope.logRecords),
			);
			const attributes = records.map((record) =>
				plainAttributes((record as OtlpLogRecord).attributes),
			);
			expect(attributes).toHaveLength(2);
			expect(attributes[0]['atl.feature_flag.deduplication_key']).toBe(
				exposureDigest(
					serializeExposureIdentity(resultInput(original, { requestContext: originalContext }))!,
				),
			);
			expect(attributes[0]['atl.feature_flag.exposure.manual']).toBe(true);
			expect(attributes[1]['atl.feature_flag.deduplication_key']).not.toBe(
				attributes[0]['atl.feature_flag.deduplication_key'],
			);
		} finally {
			setExposureDelivery();
			setExposureClockFactory();
			setExposureEnvironmentFactory();
		}
	});
});

beforeAll(async () => initializeExposureHash());
