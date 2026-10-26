/**
 * @jest-environment node
 */

import { isValidBulkEvaluationPayloadV1, payloadSchemaVersion } from '../payload-validation';
import {
	bulkEvaluationPayloadFixture,
	invalidPayload,
	result,
	validPayload,
} from './_utils/test-payload-helper';

describe('isValidBulkEvaluationPayloadV1', () => {
	it.each(['selected-value', 'safe-code-default', 'not-initialised', 'partial'] as const)(
		'accepts the shared %s server fixture, ignoring its status and sdkMetadata',
		(name) => {
			expect(isValidBulkEvaluationPayloadV1(bulkEvaluationPayloadFixture(name))).toBe(true);
		},
	);

	it('accepts the supported schema version and treats an absent vs as supported', () => {
		const { requestContext } = validPayload();
		expect(isValidBulkEvaluationPayloadV1({ vs: '1', flags: {}, requestContext })).toBe(true);
		expect(isValidBulkEvaluationPayloadV1({ vs: undefined, flags: {}, requestContext })).toBe(true);
		expect(payloadSchemaVersion({ flags: {} })).toBe('1');
		expect(payloadSchemaVersion({ vs: undefined })).toBe('1');
		expect(payloadSchemaVersion({ vs: '1' })).toBe('1');
	});

	it.each([
		['null', null],
		['the number 1', 1],
		['"2"', '2'],
		['an empty string', ''],
		['" 1"', ' 1'],
		['an object', { version: '1' }],
	])('rejects a vs of %s as an unsupported schema version', (_name, vs) => {
		expect(payloadSchemaVersion({ vs, flags: {} })).toBeNull();
		expect(isValidBulkEvaluationPayloadV1({ vs, flags: {} })).toBe(false);
	});

	it('accepts a payload containing only flags and a request context, including an empty flag map', () => {
		const { flags, requestContext } = validPayload();
		expect(isValidBulkEvaluationPayloadV1({ flags, requestContext })).toBe(true);
		expect(isValidBulkEvaluationPayloadV1({ flags: {}, requestContext })).toBe(true);
	});

	it('rejects a payload without a request context', () => {
		expect(isValidBulkEvaluationPayloadV1({ flags: validPayload().flags })).toBe(false);
		expect(isValidBulkEvaluationPayloadV1({ vs: '1', flags: {} })).toBe(false);
	});

	it('accepts the Feature Flag Service ffp payload members, ignoring status and targetApp', () => {
		expect(
			isValidBulkEvaluationPayloadV1({
				...validPayload(),
				status: 'STALE',
				targetApp: 'jira-frontend',
				clientVersion: { token: 'v1', updatedAt: '2026-10-13T00:00:00Z' },
				requestContext: { identifiers: { atlassianAccountId: 'abc' }, attributes: { beta: true } },
			}),
		).toBe(true);
	});

	it('accepts a request context without attributes', () => {
		expect(
			isValidBulkEvaluationPayloadV1({
				...validPayload(),
				requestContext: { identifiers: { atlassianAccountId: 'abc' } },
			}),
		).toBe(true);
	});

	it.each([
		['with updatedAt', { token: 'v1', updatedAt: '2026-10-13T00:00:00Z' }],
		['without updatedAt', { token: 'v1' }],
		['with a whitespace-only token', { token: ' ' }],
		['with an updatedAt that is not a timestamp', { token: 'v1', updatedAt: 'yesterday' }],
		['with unknown members', { token: 'v1', source: 'ffs' }],
	])('accepts a client version %s', (_, clientVersion) => {
		expect(isValidBulkEvaluationPayloadV1({ ...validPayload(), clientVersion })).toBe(true);
	});

	it.each([
		['an empty token', { token: '' }],
		['a non-string token', { token: 42 }],
		['a missing token', { updatedAt: '2026-10-13T00:00:00Z' }],
		['a non-string updatedAt', { token: 'v1', updatedAt: 1760313600000 }],
		['a null updatedAt', { token: 'v1', updatedAt: null }],
		['a non-object client version', 'v1'],
		['an array client version', [{ token: 'v1' }]],
		['a null client version', null],
	])('rejects %s', (_, clientVersion) => {
		expect(isValidBulkEvaluationPayloadV1({ ...validPayload(), clientVersion })).toBe(false);
	});

	it('accepts unknown members at payload, flag result, and metadata level', () => {
		const payload: unknown = {
			...validPayload(),
			extra: { ignored: true },
			flags: {
				'flag-a': {
					...result({ returnType: 'BOOLEAN', value: true }),
					extra: 'ignored',
				},
				'flag-b': {
					returnType: 'STRING',
					useCodeDefault: true,
					value: 'ignored because useCodeDefault is true',
					metadata: {
						matchReason: 'no_rules_matched',
						variationId: null,
						ruleId: null,
						identifierType: null,
						extra: 'ignored',
					},
				},
			},
		};

		expect(isValidBulkEvaluationPayloadV1(payload)).toBe(true);
	});

	it('accepts optional per-flag metadata members and passes entry members through', () => {
		expect(
			isValidBulkEvaluationPayloadV1(
				validPayload({
					flags: {
						'flag-a': result({
							metadata: {
								identifierType: 'AtlassianAccountId',
								matchReason: 'holdout_match',
								variationId: null,
								ruleId: null,
								holdoutAllocation: { holdoutKey: 'h1', holdoutRuleId: 7, unexpected: ['kept'] },
								segments: [{ segmentKey: 's1', result: 'MATCHED', extra: { nested: true } }],
								targetApps: ['jira-frontend', 'confluence-frontend'],
								flagVersion: '42',
								errorMessage: 'partial evaluation',
							},
						}),
					},
				}),
			),
		).toBe(true);
	});

	it('accepts empty per-flag metadata arrays and objects', () => {
		expect(
			isValidBulkEvaluationPayloadV1(
				validPayload({
					flags: {
						'flag-a': result({
							metadata: {
								matchReason: 'no_rules_matched',
								holdoutAllocation: {},
								segments: [],
								targetApps: [],
							},
						}),
					},
				}),
			),
		).toBe(true);
	});

	it.each([
		['a null holdoutAllocation', { holdoutAllocation: null }],
		['an ignored holdoutAllocations list', { holdoutAllocations: [{ holdoutKey: 'h1' }] }],
		['an ignored malformed holdoutAllocations member', { holdoutAllocations: 'h1' }],
	])('accepts per-flag metadata with %s', (_description, metadata) => {
		expect(
			isValidBulkEvaluationPayloadV1(
				validPayload({
					flags: {
						'flag-a': result({ metadata: { matchReason: 'no_rules_matched', ...metadata } }),
					},
				}),
			),
		).toBe(true);
	});

	it.each([
		['a non-object payload', null],
		['an array payload', [validPayload()]],
		['a bare flag map', validPayload().flags],
		['missing flags', invalidPayload({ flags: undefined })],
		['null flags', invalidPayload({ flags: null })],
		['array flags', invalidPayload({ flags: [result()] })],
		['missing requestContext', invalidPayload({ requestContext: undefined })],
		['null requestContext', invalidPayload({ requestContext: null })],
		['missing requestContext.identifiers', invalidPayload({ requestContext: {} })],
		[
			'non-object requestContext.identifiers',
			invalidPayload({ requestContext: { identifiers: null, attributes: {} } }),
		],
		[
			'non-string requestContext identifier values',
			invalidPayload({ requestContext: { identifiers: { user: 12 }, attributes: {} } }),
		],
		[
			'null requestContext.attributes',
			invalidPayload({ requestContext: { identifiers: { user: 'abc' }, attributes: null } }),
		],
		[
			'non-object requestContext.attributes',
			invalidPayload({ requestContext: { identifiers: { user: 'abc' }, attributes: 'free' } }),
		],
		[
			'invalid requestContext attribute values',
			invalidPayload({
				requestContext: { identifiers: { user: 'abc' }, attributes: { nested: {} } },
			}),
		],
		[
			'an unknown returnType',
			invalidPayload({ flags: { 'flag-a': result({ returnType: 'DATE' }) } }),
		],
		[
			'non-boolean useCodeDefault',
			invalidPayload({ flags: { 'flag-a': result({ useCodeDefault: 'no' }) } }),
		],
		[
			'missing metadata object',
			invalidPayload({ flags: { 'flag-a': result({ metadata: null }) } }),
		],
		[
			'missing metadata matchReason',
			invalidPayload({
				flags: { 'flag-a': result({ metadata: { variationId: null, ruleId: null } }) },
			}),
		],
		[
			'missing value when useCodeDefault is false',
			invalidPayload({ flags: { 'flag-a': result({ value: undefined }) } }),
		],
	])('rejects %s', (_description, payload) => {
		expect(isValidBulkEvaluationPayloadV1(payload)).toBe(false);
	});

	it.each([
		['a string holdoutAllocation', { holdoutAllocation: 'h1' }],
		['an array holdoutAllocation', { holdoutAllocation: [{ holdoutKey: 'h1' }] }],
		['non-array segments', { segments: 'segment-a' }],
		['a non-object segments entry', { segments: [7] }],
		['non-array targetApps', { targetApps: 'jira-frontend' }],
		['a non-string targetApps entry', { targetApps: ['jira-frontend', 7] }],
		['a non-string flagVersion', { flagVersion: 42 }],
		['a null flagVersion', { flagVersion: null }],
		['a non-string errorMessage', { errorMessage: { message: 'failed' } }],
		['a null errorMessage', { errorMessage: null }],
	])('rejects %s', (_description, metadataOverrides) => {
		expect(
			isValidBulkEvaluationPayloadV1(
				invalidPayload({
					flags: {
						'flag-a': result({
							metadata: { matchReason: 'no_rules_matched', ...metadataOverrides },
						}),
					},
				}),
			),
		).toBe(false);
	});
});
