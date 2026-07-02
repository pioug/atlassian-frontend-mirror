import { useEffect, useMemo, useState } from 'react';

import FeatureGates, { FeatureGateEnvironment } from '@atlaskit/feature-gate-js-client';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

type FeatureGateConfig = Parameters<(typeof FeatureGates)['overrideConfig']>[1];

const experimentConfig: Record<string, FeatureGateConfig> = {
	platform_sl_3p_preauth_better_hovercard: {
		isEnabled: true,
	},
	platform_sl_3p_preauth_social_proof_inline_cta: {
		isEnabled: true,
	},
	social_proof_3p_unauth_block_exp: {
		isEnabled: true,
	},
	platform_sl_3p_auth_inline_tailored_cta: {
		isEnabled: true,
	},
};

const enabledGates = [
	'platform_sl_3p_preauth_better_hovercard_killswitch',
	'smart-card-inline-resolved-view-refactor',
	'platform_sl_3p_preauth_soc_proof_inline_killswitch',
	'social-proof-3p-unauth-block-fg',
	'platform_sl_3p_auth_inline_tailored_cta_killswitch',
];

const emptyConfig = {};
const emptyGates: string[] = [];

/**
 * Same key as `getFeatureFlagLSKey` on the examples website — checkbox selections are
 * persisted here. `groupId` / `packageId` are taken from the examples page query (routing
 * metadata for which package is open), not from `featureFlag` URL params.
 *
 * @see platform/website/src/constants.ts
 * @see platform/website/src/pages/Examples/minimal.tsx (useFeatureFlags)
 */
function getFeatureFlagLocalStorageKey(groupId: string, packageId: string): string {
	return `atlaskitFeatureFlag_${groupId}${packageId}`;
}

function getUserSelectedFeatureFlagsFromExamplesLocalStorage(): string[] {
	if (typeof window === 'undefined') {
		return [];
	}
	const params = new URLSearchParams(window.location.search);
	const groupId = params.get('groupId') ?? '';
	const packageId = params.get('packageId') ?? '';
	if (!groupId || !packageId) {
		return [];
	}
	const raw = window.localStorage.getItem(getFeatureFlagLocalStorageKey(groupId, packageId));
	return raw?.split(',').filter(Boolean) ?? [];
}

const useFeatureGateOverrideConfig = (withExperiments: boolean = true): number => {
	// Revision counter: 0 = not yet initialized, >0 = ready.
	// Incrementing on each config change forces children to re-render
	// (via key={revision} in the consumer) without showing "Loading...".
	const [revision, setRevision] = useState(0);

	const { currentConfig, currentEnabledGates } = useMemo<{
		currentConfig: Record<string, FeatureGateConfig>;
		currentEnabledGates: string[];
	}>(() => {
		if (withExperiments) {
			return {
				currentConfig: experimentConfig,
				currentEnabledGates: enabledGates,
			};
		}
		return { currentConfig: emptyConfig, currentEnabledGates: emptyGates };
	}, [withExperiments]);

	useEffect(() => {
		let cancelled = false;

		const setup = async () => {
			await FeatureGates.initializeFromValues(
				{
					environment: FeatureGateEnvironment.Development,
					localMode: true,
					targetApp: '',
				},
				{},
			);

			FeatureGates.clearAllOverrides();
			Object.entries(currentConfig).forEach(([name, config]) => {
				FeatureGates.overrideConfig(name, config);
			});

			const userSelectedGates = getUserSelectedFeatureFlagsFromExamplesLocalStorage();
			const userSelectedGatesSet = new Set(userSelectedGates);
			const mergedEnabledGates = [...new Set([...currentEnabledGates, ...userSelectedGates])];
			mergedEnabledGates.forEach((gate) => {
				FeatureGates.overrideGate(gate, true);
			});

			// The example website framework sets a static booleanResolver early in boot, which
			// this hook replaces for FeatureGates-driven checks. Delegate to
			// FeatureGates.checkGate() for this package's overrides, but preserve flags the user
			// enabled in the examples shell (read from localStorage above).
			setBooleanFeatureFlagResolver((flagKey) => {
				if (userSelectedGatesSet.has(flagKey)) {
					return true;
				}
				// `fg()` delegates to this resolver, so the bootstrap path must read gates directly.
				// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
				return FeatureGates.checkGate(flagKey);
			});

			if (!cancelled) {
				setRevision((r) => r + 1);
			}
		};

		void setup();

		return () => {
			cancelled = true;
		};
	}, [currentConfig, currentEnabledGates]);

	return revision;
};

export default useFeatureGateOverrideConfig;
