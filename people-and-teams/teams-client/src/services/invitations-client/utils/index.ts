import {
	type Capability,
	type Recommendation,
	type RecommendationMode,
	type RecommendationsResponse,
} from '../types';

import { type RecommendationsByProductAri, type RecommendationWithCapability } from './types';

/**
 * Determines which capability is more desirable.
 * Users desire direct access over request access since it's instant.
 * @returns 0 if equal, -1 if a is more desirable, 1 if b is more desirable.
 */
const compareCapability = (a: Capability, b: Capability): number => {
	if (a === b) {
		return 0;
	}
	return a === 'DIRECT_ACCESS' ? -1 : 1;
};

/**
 * Determines which mode is more desirable.
 * Atlassian prefers to provide open access over domain restricted access.
 * Both of these modes have already been enabled by an admin.
 * If mode is undefined, it is deemed least desirable.
 * @returns 0 if equal, -1 if a is more open, 1 if b is more open.
 */
const compareMode = (
	a: RecommendationMode | undefined,
	b: RecommendationMode | undefined,
): number => {
	if (a === b) {
		return 0;
	}
	if (!a) {
		return 1;
	}
	if (!b) {
		return -1;
	}
	return a === 'OPEN' ? -1 : 1;
};

/**
 * Determine if a recommendation is more desirable than another.
 * Atlassian prefers a better capability over any mode setting.
 * The mode will only be compared if the capabilities are equal.
 * If both capability and mode are equal, the recommendations are considered the same.
 *
 * Assumes recommendations have the same resource ID.
 * Do not compare recommendations with different resource IDs, as it does not make sense.
 *
 * @returns 0 if capability and mode are equal, -1 if a is more desirable, 1 if b is more desirable.
 */
const compareRecommendations = (
	a: RecommendationWithCapability,
	b: RecommendationWithCapability,
): number => {
	if (a.resourceId !== b.resourceId) {
		throw new Error('Recommendations must have the same resource ID');
	}

	if (compareCapability(a.capability, b.capability) < 0) {
		return -1;
	} else if (compareCapability(a.capability, b.capability) > 0) {
		return 1;
	} else if (compareMode(a.mode, b.mode) < 0) {
		return -1;
	} else if (compareMode(a.mode, b.mode) > 0) {
		return 1;
	}
	return 0;
};

const toRecommendation = (recommendation: RecommendationWithCapability): Recommendation => {
	const { capability, ...rest } = recommendation;
	return { ...rest };
};

/**
 * Removes duplicate recommendations with the same resource ARI.
 * When a collision occurs, select the recommendation with the most desirable capability and mode.
 * @returns a recommendation response with unique resource ARIs.
 */
export const removeDuplicateRecommendations = (
	recommendations: RecommendationsResponse,
): RecommendationsResponse => {
	const { DIRECT_ACCESS, REQUEST_ACCESS } = recommendations.capability;
	const uniqueRecommendations: RecommendationsByProductAri = {};
	const allRecommendations = [
		...DIRECT_ACCESS.map((recommendation) => ({
			...recommendation,
			capability: 'DIRECT_ACCESS' as Capability,
		})),
		...REQUEST_ACCESS.map((recommendation) => ({
			...recommendation,
			capability: 'REQUEST_ACCESS' as Capability,
		})),
	];
	allRecommendations.forEach((recommendation) => {
		const existing = uniqueRecommendations[recommendation.resourceId];
		if (existing && compareRecommendations(existing, recommendation) <= 0) {
			return;
		}
		uniqueRecommendations[recommendation.resourceId] = recommendation;
	});

	const allUniqueRecommendations = Object.values(uniqueRecommendations);
	return {
		capability: {
			DIRECT_ACCESS: allUniqueRecommendations
				.filter((recommendation) => recommendation.capability === 'DIRECT_ACCESS')
				.map(toRecommendation),
			REQUEST_ACCESS: allUniqueRecommendations
				.filter((recommendation) => recommendation.capability === 'REQUEST_ACCESS')
				.map(toRecommendation),
		},
	};
};
