/**
 * @jest-environment node
 */

import { FlagClient } from '../client';
import { isValidBulkEvaluationPayloadV1 } from '../payload-validation';
import { TEST_CLIENT_OPTIONS, testUser, validPayload } from './_utils/test-payload-helper';

const combinations = [false, true].flatMap((segments): readonly [boolean, boolean, boolean][] =>
	[false, true].flatMap((actual): readonly [boolean, boolean, boolean][] =>
		[false, true].map((hypothetical): [boolean, boolean, boolean] => [
			segments,
			actual,
			hypothetical,
		]),
	),
);

describe('server assignment metadata is preserved independently of actual allocations', (): void => {
	it.each(combinations)(
		'accepts segments=%s actual=%s counterfactual=%s, returns actual and counterfactual allocations',
		(segments, actual, hypothetical): void => {
			const holdout = {
				holdoutKey: 'holdout',
				holdoutRuleId: 'eligible',
				identifierType: 'AtlassianAccountId',
				allocationReason: 'holdout_not_eligible',
			};
			const segment = {
				segmentKey: 'selected-segment',
				result: 'PASS',
				ruleId: 'member',
				reason: 'rule_matched',
			};
			const serverMetadata = {
				identifierType: 'AtlassianAccountId',
				matchReason: 'aa_test_match',
				variationId: 'on',
				ruleId: 'selected',
				sdkMetadata: { migrationState: 'FFP' },
				...(segments ? { segments: [segment] } : {}),
				...(actual ? { holdoutAllocation: holdout } : {}),
				stableSplitOutcome: {
					variationId: 'on',
					matchReason: 'ss_cohort_match',
					...(hypothetical ? { holdoutAllocation: holdout } : {}),
				},
			};
			const payload = {
				...validPayload(),
				flags: {
					'slim-flag': {
						returnType: 'BOOLEAN' as const,
						value: true,
						useCodeDefault: false,
						metadata: serverMetadata,
					},
				},
			};
			expect(isValidBulkEvaluationPayloadV1(payload)).toBe(true);
			const client = new FlagClient(TEST_CLIENT_OPTIONS);
			expect(client.initialize(() => payload, testUser())).toEqual({ initialized: true });
			const details = client.getBooleanDetails('slim-flag', false);
			expect(details.value).toBe(true);
			expect(details.metadata).toEqual({
				flagKey: 'slim-flag',
				identifierType: 'AtlassianAccountId',
				identifierValue: 'abc',
				matchReason: 'aa_test_match',
				variationId: 'on',
				ruleId: 'selected',
				holdoutAllocation: actual ? holdout : null,
				segments: segments ? [segment] : [],
				stableSplitOutcome: serverMetadata.stableSplitOutcome,
			});
			expect(details.metadata).not.toHaveProperty('holdoutAllocations');
			expect(Object.isFrozen(details.metadata.stableSplitOutcome)).toBe(true);
		},
	);
});
