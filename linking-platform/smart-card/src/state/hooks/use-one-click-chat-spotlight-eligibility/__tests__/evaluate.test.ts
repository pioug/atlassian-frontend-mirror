import {
	evaluateExperiment,
	evaluateOpportunity,
	SEVEN_DAYS_MS,
	type EligibilityInput,
} from '../evaluate';

const now = new Date(2026, 8, 17, 12).getTime();
const day = 24 * 60 * 60 * 1000;
const eligible: EligibilityInput = {
	gateEnabled: true,
	appearance: 'inline',
	status: 'resolved',
	provider: 'google-object-provider',
	authorized: true,
	hasAccess: true,
	rovoAvailable: true,
	consumerOptedIn: true,
	product: 'jira_web',
	history: { impressions: [] },
	spotlightActive: false,
	now,
};

describe('evaluateOpportunity', () => {
	it.each([
		[{ gateEnabled: false }, 'gate_off'],
		[{ status: 'pending' }, 'not_resolved_inline'],
		[{ status: 'unauthorized' }, 'not_resolved_inline'],
		[{ appearance: 'block' }, 'not_resolved_inline'],
		[{ appearance: 'embed' }, 'not_resolved_inline'],
		[{ provider: 'slack-object-provider' }, 'unsupported_provider'],
		[{ provider: undefined }, 'unsupported_provider'],
		[{ authorized: false }, 'provider_unauthorized'],
		[{ hasAccess: false }, 'object_inaccessible'],
		[{ rovoAvailable: false }, 'rovo_unavailable'],
		[{ consumerOptedIn: false }, 'consumer_not_opted_in'],
		[{ product: 'trello_web' }, 'unsupported_product'],
		[{ history: undefined }, 'suppression_unavailable'],
		[{ spotlightActive: true }, 'spotlight_active'],
		[{ history: { impressions: [now] } }, 'shown_today'],
		[{ history: { impressions: [now - day, now - 2 * day, now - 3 * day] } }, 'weekly_limit'],
		[{ history: { impressions: [], dismissedAt: now - SEVEN_DAYS_MS + 1 } }, 'dismissal_cooldown'],
	] as [Partial<EligibilityInput>, string][])('rejects %j with %s', (overrides, reason) => {
		expect(evaluateOpportunity({ ...eligible, ...overrides })).toEqual({
			isEligible: false,
			reason,
		});
	});

	it.each(['jira_web', 'confluence_web'])('supports both providers in %s', (product) => {
		for (const provider of ['google-object-provider', 'github-object-provider']) {
			expect(evaluateOpportunity({ ...eligible, product, provider }).isEligible).toBe(true);
		}
	});

	it('opens the daily window at local midnight', () => {
		const midnight = new Date(2026, 8, 17).getTime();
		expect(
			evaluateOpportunity({ ...eligible, history: { impressions: [midnight - 1] } }).isEligible,
		).toBe(true);
		expect(evaluateOpportunity({ ...eligible, history: { impressions: [midnight] } }).reason).toBe(
			'shown_today',
		);
	});

	it('expires an impression at exactly seven elapsed days', () => {
		const impressions = [now - day, now - 2 * day, now - SEVEN_DAYS_MS];
		expect(evaluateOpportunity({ ...eligible, history: { impressions } }).isEligible).toBe(true);
		expect(
			evaluateOpportunity({
				...eligible,
				history: { impressions: [...impressions.slice(0, 2), now - SEVEN_DAYS_MS + 1] },
			}).reason,
		).toBe('weekly_limit');
	});

	it('expires dismissal at exactly seven elapsed days', () => {
		expect(
			evaluateOpportunity({
				...eligible,
				history: { impressions: [], dismissedAt: now - SEVEN_DAYS_MS },
			}).isEligible,
		).toBe(true);
	});

	it('fails closed for timestamps in the future', () => {
		expect(evaluateOpportunity({ ...eligible, history: { impressions: [now + day] } }).reason).toBe(
			'shown_today',
		);
		expect(
			evaluateOpportunity({ ...eligible, history: { impressions: [], dismissedAt: now + day } })
				.reason,
		).toBe('dismissal_cooldown');
	});

	it('keeps the specified rejection order', () => {
		expect(
			evaluateOpportunity({
				...eligible,
				gateEnabled: false,
				authorized: false,
				history: undefined,
			}).reason,
		).toBe('gate_off');
		expect(evaluateOpportunity({ ...eligible, authorized: false, history: undefined }).reason).toBe(
			'provider_unauthorized',
		);
	});
});

it.each([
	[true, 'eligible'],
	[false, 'control'],
	[undefined, 'experiment_unavailable'],
	[null, 'experiment_unavailable'],
	['true', 'experiment_unavailable'],
])('evaluates cohort %s as %s', (value, reason) => {
	expect(evaluateExperiment(value)).toEqual({ isEligible: value === true, reason });
});
