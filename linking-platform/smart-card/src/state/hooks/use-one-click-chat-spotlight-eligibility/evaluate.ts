/** No link, content, or account identifiers belong in eligibility diagnostics. */
export type EligibilityReason =
	| 'gate_off'
	| 'not_resolved_inline'
	| 'unsupported_provider'
	| 'provider_unauthorized'
	| 'object_inaccessible'
	| 'rovo_unavailable'
	| 'consumer_not_opted_in'
	| 'unsupported_product'
	| 'suppression_unavailable'
	| 'spotlight_active'
	| 'dismissal_cooldown'
	| 'shown_today'
	| 'weekly_limit'
	| 'experiment_unavailable'
	| 'control'
	| 'eligible';

export interface SpotlightHistory {
	dismissedAt?: number;
	impressions: readonly number[];
}

export interface EligibilityInput {
	appearance: string;
	authorized: boolean;
	consumerOptedIn: boolean;
	gateEnabled: boolean;
	hasAccess: boolean;
	history?: SpotlightHistory;
	now: number;
	product?: string;
	provider?: string;
	rovoAvailable: boolean;
	spotlightActive: boolean;
	status: string;
}

export interface EligibilityResult {
	isEligible: boolean;
	reason: EligibilityReason;
}

export const SEVEN_DAYS_MS: number = 7 * 24 * 60 * 60 * 1000;

const result = (reason: EligibilityReason): EligibilityResult => ({
	isEligible: reason === 'eligible',
	reason,
});

/** Calendar days use the browser's local timezone; seven-day windows use elapsed time. */
export function evaluateOpportunity(input: EligibilityInput): EligibilityResult {
	if (!input.gateEnabled) {
		return result('gate_off');
	}
	if (input.appearance !== 'inline' || input.status !== 'resolved') {
		return result('not_resolved_inline');
	}
	if (input.provider !== 'google-object-provider' && input.provider !== 'github-object-provider') {
		return result('unsupported_provider');
	}
	if (!input.authorized) {
		return result('provider_unauthorized');
	}
	if (!input.hasAccess) {
		return result('object_inaccessible');
	}
	if (!input.rovoAvailable) {
		return result('rovo_unavailable');
	}
	if (!input.consumerOptedIn) {
		return result('consumer_not_opted_in');
	}
	if (input.product !== 'jira_web' && input.product !== 'confluence_web') {
		return result('unsupported_product');
	}
	if (!input.history) {
		return result('suppression_unavailable');
	}
	if (input.spotlightActive) {
		return result('spotlight_active');
	}
	const { dismissedAt, impressions } = input.history;
	const cutoff = input.now - SEVEN_DAYS_MS;
	if (dismissedAt !== undefined && dismissedAt > cutoff) {
		return result('dismissal_cooldown');
	}
	const startOfDay = new Date(input.now);
	startOfDay.setHours(0, 0, 0, 0);
	if (impressions.some((timestamp) => timestamp >= startOfDay.getTime())) {
		return result('shown_today');
	}
	if (impressions.filter((timestamp) => timestamp > cutoff).length >= 3) {
		return result('weekly_limit');
	}
	return result('eligible');
}

/** Pure cohort evaluation, kept separate so suppressed opportunities never expose the experiment. */
export function evaluateExperiment(value: unknown): EligibilityResult {
	return result(
		value === true ? 'eligible' : value === false ? 'control' : 'experiment_unavailable',
	);
}
