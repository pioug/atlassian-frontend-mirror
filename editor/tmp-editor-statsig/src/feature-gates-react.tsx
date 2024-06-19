import React, { useEffect, useState } from 'react';

import { type EditorFeatureGateKeys } from './feature-gate-js-client';

import FeatureGates, {
	type ClientOptions,
	type LocalOverrides,
} from '@atlaskit/feature-gate-js-client';

/**
 * This component initializes the @atlassian/feature-flag-js-client by fetching the gate and experiment
 * evaluations for the given user, and blocks rendering of the children until the rendering is complete.
 *
 * This is based on the private dependency @atlassian/feature-gates-react, which is not intended for public use.
 *
 * https://bitbucket.org/atlassian/feature-gate-clients/src/main/packages/react-sdk/src/FeatureGatesInitialization.tsx
 * https://bitbucket.org/atlassian/feature-gate-clients/src/main/packages/react-sdk/src/utils.tsx
 */
export const EditorFeatureGatesInitialization = ({
	children,
	overrides,
}: {
	children: React.ReactNode;
	overrides: { gates: { [key in EditorFeatureGateKeys]: boolean } };
}) => {
	// Rather than checking the state of all overrides, we can just assume that if overrides are provided
	// then some sort of update will need to be performed, and hold off rendering until the useEffect is run.
	const [isInitialized, setInitialized] = useState(!overrides && isClientAlreadyInCorrectState());

	useEffect(() => {
		const _overrides = { configs: {}, layers: {}, ...overrides };
		if (isClientAlreadyInCorrectState()) {
			applyOverrides(_overrides);
			setInitialized(true);
		} else {
			setInitialized(false);
			const initPromise: Promise<void> = FeatureGates.initialize({} as ClientOptions, {}, {});

			void initPromise
				.then(() => applyOverrides(_overrides))
				.catch((err) => toError(err))
				.then((err) => {
					setInitialized(true);
				});
		}
		return () => clearOverrides(_overrides);
	}, [overrides]);

	if (!isInitialized) {
		return <>loading feature flags</>;
	}

	return <>{children}</>;
};

let hasWarnedAboutMissingOverrideSupport = false;

function applyOverrides(overrides?: LocalOverrides) {
	// Allow newer versions of the React SDK to be used with older v3.x JS client versions,
	// provided the caller does not try to leverage the overrides which were introduced in v4.
	if (overrides && (!FeatureGates.overrideGate || !FeatureGates.overrideConfig)) {
		if (!hasWarnedAboutMissingOverrideSupport) {
			// eslint-disable-next-line no-console
			console.warn('Overrides are only supported in @atlaskit/feature-gate-js-client v4.0.0+');
			hasWarnedAboutMissingOverrideSupport = true;
		}
		return;
	}

	Object.entries(overrides?.gates || {}).forEach(([gateName, value]) => {
		FeatureGates.overrideGate?.(gateName, value);
	});

	Object.entries(overrides?.configs || {}).forEach(([configName, values]) => {
		FeatureGates.overrideConfig?.(configName, values);
	});
}

function isClientAlreadyInCorrectState() {
	// If either of these methods don't exist (ie. if the product is using <v4.2.0), then this method will always return false
	return FeatureGates.initializeCompleted?.();
}

function toError(err: unknown) {
	if (err instanceof Error) {
		return err;
	}

	return new Error(err?.toString());
}

function clearOverrides(overrides?: LocalOverrides) {
	Object.keys(overrides?.gates || {}).forEach((gateName) => {
		FeatureGates.clearGateOverride?.(gateName);
	});

	Object.keys(overrides?.configs || {}).forEach((configName) => {
		FeatureGates.clearConfigOverride?.(configName);
	});
}
