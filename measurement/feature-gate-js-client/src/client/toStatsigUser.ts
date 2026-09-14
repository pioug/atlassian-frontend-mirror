import { type StatsigUser } from '@statsig/js-client';

import { type CustomAttributes, type Identifiers } from './types';

/**
 * This method creates an instance of StatsigUser from the given set of identifiers and
 * attributes.
 */
export const toStatsigUser = (
	identifiers: Identifiers,
	customAttributes?: CustomAttributes,
): StatsigUser => {
	// Re-map `stableId` to `stableID` to match Statsig's native type.
	const { stableId, ...otherIdentifiers } = identifiers;
	const user: StatsigUser = {
		customIDs: {
			...otherIdentifiers,
			...(stableId !== undefined ? { stableID: stableId } : {}),
		},
		custom: customAttributes,
	};

	if (identifiers.atlassianAccountId) {
		user.userID = identifiers.atlassianAccountId;
	}

	return user;
};
