import type { StatsigOptions, StatsigUser } from 'statsig-js-lite';

import { isFedRamp } from '@atlaskit/atlassian-context';

import {
	type BaseClientOptions,
	type CustomAttributes,
	type FromValuesClientOptions,
	type Identifiers,
	type OptionsWithDefaults,
	PerimeterType,
	type UpdateUserCompletionCallback,
} from './types';

export const getOptionsWithDefaults = <T extends BaseClientOptions>(
	options: T,
): OptionsWithDefaults<T> => ({
	/**
	 * If more federal PerimeterTypes are added in the future, this should be updated so
	 * that isFedRamp() === true always returns the strictest perimeter.
	 */
	perimeter: isFedRamp() ? PerimeterType.FEDRAMP_MODERATE : PerimeterType.COMMERCIAL,
	...options,
});

export const shallowEquals = (objectA?: object, objectB?: object): boolean => {
	if (!objectA && !objectB) {
		return true;
	}

	if (!objectA || !objectB) {
		return false;
	}

	const aEntries: [string, unknown][] = Object.entries(objectA);
	const bEntries: [string, unknown][] = Object.entries(objectB);
	if (aEntries.length !== bEntries.length) {
		return false;
	}

	const ascendingKeyOrder = ([key1]: [string, unknown], [key2]: [string, unknown]) =>
		key1.localeCompare(key2);
	aEntries.sort(ascendingKeyOrder);
	bEntries.sort(ascendingKeyOrder);

	for (let i = 0; i < aEntries.length; i++) {
		const [, aValue] = aEntries[i];
		const [, bValue] = bEntries[i];
		if (aValue !== bValue) {
			return false;
		}
	}

	return true;
};

/**
 * This method creates an instance of StatsigUser from the given set of identifiers and
 * attributes.
 */
export const toStatsigUser = (
	identifiers: Identifiers,
	customAttributes?: CustomAttributes,
): StatsigUser => {
	const user: StatsigUser = {
		customIDs: identifiers,
		custom: customAttributes,
	};

	if (identifiers.atlassianAccountId) {
		user.userID = identifiers.atlassianAccountId;
	}

	return user;
};

/**
 * This method transforms the options given by the user into the format accepted by the Statsig
 * client.
 */
export const toStatsigOptions = (
	options: FromValuesClientOptions,
	initializeValues: Record<string, unknown>,
): StatsigOptions => {
	const {
		// De-structured to remove from restClientOptions
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		sdkKey,
		// De-structured to remove from restClientOptions
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		updateUserCompletionCallback,
		// De-structured to remove from restClientOptions
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		perimeter,
		...restClientOptions
	} = options;

	return {
		...restClientOptions,
		initializeValues,
		environment: {
			tier: options.environment,
		},
		disableCurrentPageLogging: true,
		...(options.updateUserCompletionCallback && {
			updateUserCompletionCallback: toStatsigUpdateUserCompletionCallback(
				options.updateUserCompletionCallback,
			),
		}),
	};
};

type StatsigUpdateUserCompletionCallback = NonNullable<
	StatsigOptions['updateUserCompletionCallback']
>;

/**
 * This method transforms an UpdateUserCompletionCallback in our own format into the format
 * accepted by the Statsig client.
 */
export const toStatsigUpdateUserCompletionCallback = (
	callback: UpdateUserCompletionCallback,
): StatsigUpdateUserCompletionCallback => {
	/**
	 * The duration passed to the callback indicates how long the update took, but it is deceptive
	 * since it only times the Statsig code and doesn't account for all of the extra custom work we
	 * do to obtain the bootstrap values. As a result, we just suppress this parameter in our own
	 * callback rather than trying to keep it accurate.
	 */
	return (_duration: number, success: boolean, message: string | null) => {
		callback(success, message);
	};
};
