/**
 * @jest-environment node
 */

import {
	NO_COMPLETED_ATTEMPT,
	resolveExposureIdentity,
	type InitializationStatus,
} from '../exposure/attribution';
import { mapExposureRecord } from '../exposure/mapper';
import { PACKAGE_NAME, PACKAGE_VERSION } from '../version';
import {
	fallbackDetails,
	fallbackInput,
	flagResult,
	plainAttributes,
	resultInput,
	user,
	wireAttributes,
} from './_utils/exposure-test-helper';

describe('mapExposureRecord', () => {
	it('maps a retained result to a bootstrap flag-evaluated record', () => {
		const record = mapExposureRecord(
			resultInput(
				flagResult({
					matchReason: 'rule_match',
					variationId: 'on',
					ruleId: 'rule-1',
					flagVersion: '7',
					targetApps: ['jira-frontend', 'confluence-frontend'],
				}),
				{ clientVersion: { token: 'v-1', updatedAt: '2026-08-17T11:00:00Z' } },
			),
		);

		expect(record.resource).toEqual({ serviceName: 'jira-frontend', environmentType: 'prod' });
		expect(record.scopeVersion).toBe(PACKAGE_VERSION);
		expect(record.logRecord).toMatchObject({
			timeUnixNano: '1786964600000000000',
			severityNumber: 1,
			severityText: 'TRACE',
			eventName: 'flag-evaluated',
		});
		expect(plainAttributes(record.logRecord.attributes)).toEqual({
			'feature_flag.key': 'flag-a',
			'feature_flag.set.id': 'jira-frontend',
			'feature_flag.result.variant': 'on',
			'feature_flag.result.reason': 'rule_match',
			'feature_flag.version': '7',
			'atl.feature_flag.rule_id': 'rule-1',
			'atl.feature_flag.client.version.token': 'v-1',
			'atl.feature_flag.client.version.updated_at': '2026-08-17T11:00:00Z',
			'atl.feature_flag.target_apps': ['jira-frontend', 'confluence-frontend'],
			'atl.feature_flag.result.source': 'bootstrap',
			'atl.feature_flag.exposure.manual': false,
			'atl.feature_flag.sampling.rate': 1,
			'atl.feature_flag.sampling.item.count': 1,
		});
	});

	it('encodes schema-typed attributes with their declared OTLP types', () => {
		const attributes = wireAttributes(
			mapExposureRecord(resultInput(flagResult())).logRecord.attributes,
		);

		expect(attributes['atl.feature_flag.sampling.rate']).toEqual({ doubleValue: 1 });
		expect(attributes['atl.feature_flag.sampling.item.count']).toEqual({ intValue: '1' });
		expect(attributes['atl.feature_flag.exposure.manual']).toEqual({ boolValue: false });
	});

	it('marks manual exposures', () => {
		const attributes = plainAttributes(
			mapExposureRecord(resultInput(flagResult(), { manual: true })).logRecord.attributes,
		);

		expect(attributes['atl.feature_flag.exposure.manual']).toBe(true);
	});

	it('uses the bootstrap source for code-default-backed results', () => {
		const result = { ...flagResult({ variationId: 'off' }), useCodeDefault: true };
		const record = mapExposureRecord(
			resultInput(result, {
				details: {
					...resultInput(result).details,
					value: false,
				},
			}),
		);

		expect(plainAttributes(record.logRecord.attributes)).toMatchObject({
			'atl.feature_flag.result.source': 'bootstrap',
			'feature_flag.result.variant': 'off',
		});
	});

	it('maps a missing flag to a bootstrap record without flag attribution', () => {
		const attributes = plainAttributes(
			mapExposureRecord(fallbackInput('flag_not_found')).logRecord.attributes,
		);

		expect(attributes).toMatchObject({
			'feature_flag.result.reason': 'flag_not_found',
			'feature_flag.error.message': 'FFP evaluation failed: flag_not_found',
			'atl.feature_flag.result.source': 'bootstrap',
		});
		expect(attributes).not.toHaveProperty('feature_flag.result.variant');
		expect(attributes).not.toHaveProperty('atl.feature_flag.rule_id');
		expect(attributes).not.toHaveProperty('feature_flag.version');
		expect(attributes).not.toHaveProperty('atl.feature_flag.target_apps');
	});

	it('keeps the payload flag attribution for a type mismatch', () => {
		const result = flagResult({
			variationId: 'on',
			ruleId: 'rule-a',
			flagVersion: '42',
			targetApps: ['jira-frontend'],
		});
		const attributes = plainAttributes(
			mapExposureRecord(
				resultInput(result, { details: fallbackDetails('flag-a', 'type_mismatch') }),
			).logRecord.attributes,
		);

		expect(attributes).toMatchObject({
			'feature_flag.result.reason': 'type_mismatch',
			'feature_flag.error.message': 'FFP evaluation failed: type_mismatch',
			'feature_flag.version': '42',
			'atl.feature_flag.target_apps': ['jira-frontend'],
			'atl.feature_flag.result.source': 'bootstrap',
		});
		expect(attributes).not.toHaveProperty('feature_flag.result.variant');
		expect(attributes).not.toHaveProperty('atl.feature_flag.rule_id');
	});

	it.each([['general_error'], ['invalid_context']])(
		'omits variant and rule attribution for payload reason %s',
		(matchReason) => {
			const attributes = plainAttributes(
				mapExposureRecord(
					resultInput(flagResult({ matchReason, variationId: 'off', ruleId: 'rule-a' })),
				).logRecord.attributes,
			);

			expect(attributes).toMatchObject({
				'feature_flag.result.reason': matchReason,
				'feature_flag.error.message': `FFP evaluation failed: ${matchReason}`,
				'atl.feature_flag.result.source': 'bootstrap',
			});
			expect(attributes).not.toHaveProperty('feature_flag.result.variant');
			expect(attributes).not.toHaveProperty('atl.feature_flag.rule_id');
		},
	);

	it('uses the reserved default rule ID for the default variation', () => {
		const attributes = plainAttributes(
			mapExposureRecord(
				resultInput(
					flagResult({ matchReason: 'no_rules_matched', variationId: 'off', ruleId: null }),
				),
			).logRecord.attributes,
		);

		expect(attributes['atl.feature_flag.rule_id']).toBe('default');
	});

	it.each([
		['uses the reserved default rule ID', 'no_rules_matched', 'default'],
		['omits the rule ID', 'targeting_match', undefined],
	])('treats an empty rule ID as absent: %s', (_case, matchReason, expected) => {
		const attributes = plainAttributes(
			mapExposureRecord(resultInput(flagResult({ matchReason, variationId: 'on', ruleId: '' })))
				.logRecord.attributes,
		);

		expect(attributes['atl.feature_flag.rule_id']).toBe(expected);
	});

	it('omits the rule ID for another reason with a variation but no rule', () => {
		const attributes = plainAttributes(
			mapExposureRecord(
				resultInput(
					flagResult({ matchReason: 'targeting_match', variationId: 'on', ruleId: null }),
				),
			).logRecord.attributes,
		);

		expect(attributes).not.toHaveProperty('atl.feature_flag.rule_id');
	});

	it.each([['general_error'], ['invalid_context']])(
		'prefers the payload error message for %s',
		(matchReason) => {
			const attributes = plainAttributes(
				mapExposureRecord(
					resultInput(flagResult({ matchReason, variationId: null, errorMessage: 'boom' })),
				).logRecord.attributes,
			);

			expect(attributes['feature_flag.error.message']).toBe('boom');
		},
	);

	it('keeps the fixed message for a type mismatch whose payload result has an error message', () => {
		const result = flagResult({ errorMessage: 'boom' });
		const attributes = plainAttributes(
			mapExposureRecord(
				resultInput(result, { details: fallbackDetails('flag-a', 'type_mismatch') }),
			).logRecord.attributes,
		);

		expect(attributes['feature_flag.error.message']).toBe('FFP evaluation failed: type_mismatch');
	});

	it('maps a payload error message for a non-error reason', () => {
		const attributes = plainAttributes(
			mapExposureRecord(
				resultInput(flagResult({ matchReason: 'rule_match', errorMessage: 'note' })),
			).logRecord.attributes,
		);

		expect(attributes['feature_flag.error.message']).toBe('note');
	});

	it('omits empty and blank-only optional values rather than synthesizing them', () => {
		const attributes = plainAttributes(
			mapExposureRecord(
				resultInput(flagResult({ targetApps: [], flagVersion: '', errorMessage: '' })),
			).logRecord.attributes,
		);

		expect(attributes).not.toHaveProperty('atl.feature_flag.target_apps');
		expect(attributes).not.toHaveProperty('feature_flag.version');
		expect(attributes).not.toHaveProperty('feature_flag.error.message');
		expect(attributes).not.toHaveProperty('atl.feature_flag.client.version.token');
	});

	it('passes a nonempty update time through unparsed', () => {
		const attributes = plainAttributes(
			mapExposureRecord(
				resultInput(flagResult(), { clientVersion: { token: 'v-1', updatedAt: 'yesterday' } }),
			).logRecord.attributes,
		);

		expect(attributes['atl.feature_flag.client.version.token']).toBe('v-1');
		expect(attributes['atl.feature_flag.client.version.updated_at']).toBe('yesterday');
	});

	it('omits an empty update time', () => {
		const attributes = plainAttributes(
			mapExposureRecord(
				resultInput(flagResult(), { clientVersion: { token: 'v-1', updatedAt: '' } }),
			).logRecord.attributes,
		);

		expect(attributes).not.toHaveProperty('atl.feature_flag.client.version.updated_at');
	});

	it('maps a complete holdout allocation to the holdout allocation attributes', () => {
		const attributes = plainAttributes(
			mapExposureRecord(
				resultInput(
					flagResult({
						holdoutAllocation: {
							holdoutKey: 'holdout-a',
							holdoutRuleId: 'holdout-rule-a',
							identifierType: 'atlassianAccountId',
							allocationReason: 'holdout_not_withheld',
						},
					}),
				),
			).logRecord.attributes,
		);

		expect(attributes).toMatchObject({
			'atl.feature_flag.holdout_allocation.holdout_key': 'holdout-a',
			'atl.feature_flag.holdout_allocation.holdout_rule_id': 'holdout-rule-a',
			'atl.feature_flag.holdout_allocation.identifier_type': 'atlassianAccountId',
			'atl.feature_flag.holdout_allocation.allocation_reason': 'holdout_not_withheld',
		});
	});

	it.each([
		['null', null],
		['missing', undefined],
		['non-string', 7],
	])('omits only the holdout rule ID when it is %s', (_description, holdoutRuleId) => {
		const attributes = plainAttributes(
			mapExposureRecord(
				resultInput(
					flagResult({
						holdoutAllocation: {
							holdoutKey: 'holdout-a',
							holdoutRuleId,
							identifierType: 'atlassianAccountId',
							allocationReason: 'holdout_withheld',
						},
					}),
				),
			).logRecord.attributes,
		);

		expect(attributes).toMatchObject({
			'atl.feature_flag.holdout_allocation.holdout_key': 'holdout-a',
			'atl.feature_flag.holdout_allocation.identifier_type': 'atlassianAccountId',
			'atl.feature_flag.holdout_allocation.allocation_reason': 'holdout_withheld',
		});
		expect(attributes).not.toHaveProperty('atl.feature_flag.holdout_allocation.holdout_rule_id');
	});

	it('maps empty and future holdout allocation strings unchanged', () => {
		const attributes = plainAttributes(
			mapExposureRecord(
				resultInput(
					flagResult({
						holdoutAllocation: {
							holdoutKey: '',
							holdoutRuleId: '',
							identifierType: '',
							allocationReason: 'holdout_future_reason',
						},
					}),
				),
			).logRecord.attributes,
		);

		expect(attributes).toMatchObject({
			'atl.feature_flag.holdout_allocation.holdout_key': '',
			'atl.feature_flag.holdout_allocation.holdout_rule_id': '',
			'atl.feature_flag.holdout_allocation.identifier_type': '',
			'atl.feature_flag.holdout_allocation.allocation_reason': 'holdout_future_reason',
		});
	});

	it.each([
		['absent', {}],
		['null', { holdoutAllocation: null }],
		[
			'missing its identifier type',
			{ holdoutAllocation: { holdoutKey: 'holdout-a', allocationReason: 'holdout_withheld' } },
		],
		[
			'carrying a non-string key',
			{
				holdoutAllocation: {
					holdoutKey: 7,
					identifierType: 'atlassianAccountId',
					allocationReason: 'holdout_withheld',
				},
			},
		],
		[
			'missing its allocation reason',
			{ holdoutAllocation: { holdoutKey: 'holdout-a', identifierType: 'atlassianAccountId' } },
		],
	])(
		'omits every holdout allocation attribute when the allocation is %s',
		(_description, holdout) => {
			const attributes = plainAttributes(
				mapExposureRecord(resultInput(flagResult(holdout))).logRecord.attributes,
			);

			expect(
				Object.keys(attributes).some((key) =>
					key.startsWith('atl.feature_flag.holdout_allocation.'),
				),
			).toBe(false);
		},
	);

	it('omits holdout attributes when caller-built details have no holdout allocation member', () => {
		const input = resultInput(flagResult());
		const { holdoutAllocation: _omitted, ...metadata } = input.details.metadata;
		const details = { ...input.details, metadata } as unknown as typeof input.details;

		const attributes = plainAttributes(
			mapExposureRecord({ ...input, details }).logRecord.attributes,
		);

		expect(
			Object.keys(attributes).some((key) => key.startsWith('atl.feature_flag.holdout_allocation.')),
		).toBe(false);
	});

	it('omits variant and rule when caller-built details have no variation ID member', () => {
		const input = resultInput(flagResult({ matchReason: 'no_rules_matched', ruleId: null }));
		const { variationId: _omitted, ...metadata } = input.details.metadata;
		const details = { ...input.details, metadata } as unknown as typeof input.details;

		const attributes = plainAttributes(
			mapExposureRecord({ ...input, details }).logRecord.attributes,
		);

		expect(attributes['feature_flag.result.reason']).toBe('no_rules_matched');
		expect(attributes).not.toHaveProperty('feature_flag.result.variant');
		expect(attributes).not.toHaveProperty('atl.feature_flag.rule_id');
	});

	it('uses the payload request context instead of the current user', () => {
		const attributes = plainAttributes(
			mapExposureRecord(
				resultInput(flagResult(), {
					user: user({ atlassianAccountId: 'user-a' }, { seats: 12 }),
					requestContext: { identifiers: { atlassianAccountId: 'user-b' }, attributes: {} },
				}),
			).logRecord.attributes,
		);

		expect(attributes['atl.identifiers.atlassianAccountId']).toBe('user-b');
		expect(Object.keys(attributes).some((key) => key.startsWith('atl.attributes.'))).toBe(false);
	});

	it('maps nonempty identifiers and typed attributes, omitting empty strings', () => {
		const attributes = wireAttributes(
			mapExposureRecord(
				resultInput(flagResult(), {
					user: user(
						{ AtlassianAccountId: 'abc', tenantId: '' },
						{ tier: 'gold', note: '', admin: false, seats: 0, ratio: 87.5, huge: 1e21 },
					),
				}),
			).logRecord.attributes,
		);

		expect(attributes).toMatchObject({
			'atl.identifiers.AtlassianAccountId': { stringValue: 'abc' },
			'atl.attributes.tier': { stringValue: 'gold' },
			'atl.attributes.admin': { boolValue: false },
			'atl.attributes.seats': { intValue: '0' },
			'atl.attributes.ratio': { doubleValue: 87.5 },
			'atl.attributes.huge': { doubleValue: 1e21 },
		});
		expect(attributes).not.toHaveProperty('atl.identifiers.tenantId');
		expect(attributes).not.toHaveProperty('atl.attributes.note');
	});

	it('never includes the flag value', () => {
		const attributes = plainAttributes(
			mapExposureRecord(resultInput(flagResult())).logRecord.attributes,
		);

		expect(attributes).not.toHaveProperty('feature_flag.result.value');
	});
});

describe('resolveExposureIdentity', () => {
	it('uses a full constructed identity for every record', () => {
		const identity = resolveExposureIdentity({
			targetApp: 'jira-frontend',
			environmentType: 'staging',
			serviceVersion: '1.2.3',
		});
		const before = mapExposureRecord(
			fallbackInput('not_initialized', { identity, initialization: NO_COMPLETED_ATTEMPT }),
		);
		const after = mapExposureRecord(resultInput(flagResult(), { identity }));

		for (const record of [before, after]) {
			expect(record.resource).toEqual({
				serviceName: 'jira-frontend',
				environmentType: 'staging',
				serviceVersion: '1.2.3',
			});
			expect(plainAttributes(record.logRecord.attributes)['feature_flag.set.id']).toBe(
				'jira-frontend',
			);
		}
	});

	it('keeps "$all" unchanged as the target app', () => {
		const identity = resolveExposureIdentity({ targetApp: '$all', environmentType: 'prod' });

		expect(identity).toEqual({
			resource: { serviceName: '$all', environmentType: 'prod' },
			flagSetId: '$all',
		});
	});

	it.each([[' '], [''], [42], [undefined]])(
		'falls back to the package identity for target app %j',
		(targetApp) => {
			const identity = resolveExposureIdentity({ targetApp, environmentType: 'prod' });

			expect(identity.resource.serviceName).toBe(PACKAGE_NAME);
			expect(identity.flagSetId).toBeNull();
		},
	);

	it.each([['qa'], [''], ['PROD'], [1], [undefined]])(
		'omits unsupported environment type %j',
		(environmentType) => {
			const identity = resolveExposureIdentity({ targetApp: 'jira-frontend', environmentType });

			expect(identity.resource).toEqual({ serviceName: 'jira-frontend' });
		},
	);

	it.each([['dev'], ['local'], ['staging'], ['prod']])(
		'keeps supported environment type %s',
		(environmentType) => {
			expect(
				resolveExposureIdentity({ targetApp: 'jira-frontend', environmentType }).resource
					.environmentType,
			).toBe(environmentType);
		},
	);

	it.each([[undefined], [''], [' '], [3]])('omits service version %j', (serviceVersion) => {
		const identity = resolveExposureIdentity({
			targetApp: 'jira-frontend',
			environmentType: 'prod',
			serviceVersion,
		});

		expect(identity.resource).not.toHaveProperty('serviceVersion');
	});
});

describe('not-initialized messages', () => {
	const read = (initialization: InitializationStatus) =>
		plainAttributes(
			mapExposureRecord(fallbackInput('not_initialized', { initialization })).logRecord.attributes,
		);

	it('reports a read before any completed initialization attempt', () => {
		const attributes = read(NO_COMPLETED_ATTEMPT);

		expect(attributes).toMatchObject({
			'feature_flag.result.reason': 'not_initialized',
			'feature_flag.error.message':
				'FFP evaluation failed: not_initialized (no initialize attempt completed)',
			'atl.feature_flag.result.source': 'fallback',
		});
		expect(Object.keys(attributes).some((key) => key.startsWith('atl.identifiers.'))).toBe(false);
	});

	it('uses the bare message for constructed details after initialization', () => {
		expect(read({ state: 'initialized' })).toMatchObject({
			'feature_flag.result.reason': 'not_initialized',
			'feature_flag.error.message': 'FFP evaluation failed: not_initialized',
			'atl.feature_flag.result.source': 'bootstrap',
		});
	});

	it('reports the most recent failure reason', () => {
		expect(
			read({ state: 'uninitialized', lastFailureReason: 'invalid_payload_shape' })[
				'feature_flag.error.message'
			],
		).toBe('FFP evaluation failed: not_initialized (invalid_payload_shape)');
	});

	it('includes a rejected schema version that fits the message', () => {
		expect(
			read({
				state: 'uninitialized',
				lastFailureReason: 'invalid_schema_version',
				rejectedSchemaVersion: '2',
			})['feature_flag.error.message'],
		).toBe('FFP evaluation failed: not_initialized (invalid_schema_version "2")');
	});

	it('cuts a long rejected schema version short with an ellipsis', () => {
		expect(
			read({
				state: 'uninitialized',
				lastFailureReason: 'invalid_schema_version',
				rejectedSchemaVersion: 'abcdefghijklmnopqrstuvwxyz',
			})['feature_flag.error.message'],
		).toBe('FFP evaluation failed: not_initialized (invalid_schema_version "abcdefghijklmnop"...)');
	});

	it('keeps an uncut rejected schema version that ends in an ellipsis inside its quotes', () => {
		expect(
			read({
				state: 'uninitialized',
				lastFailureReason: 'invalid_schema_version',
				rejectedSchemaVersion: '2...',
			})['feature_flag.error.message'],
		).toBe('FFP evaluation failed: not_initialized (invalid_schema_version "2...")');
	});

	it('escapes a rejected schema version so it cannot be mistaken for message text', () => {
		expect(
			read({
				state: 'uninitialized',
				lastFailureReason: 'invalid_schema_version',
				rejectedSchemaVersion: '2") x\n',
			})['feature_flag.error.message'],
		).toBe('FFP evaluation failed: not_initialized (invalid_schema_version "2\\") x\\n")');
	});

	it('names only the reason when no rejected schema version is retained', () => {
		expect(
			read({ state: 'uninitialized', lastFailureReason: 'invalid_schema_version' })[
				'feature_flag.error.message'
			],
		).toBe('FFP evaluation failed: not_initialized (invalid_schema_version)');
	});
});
