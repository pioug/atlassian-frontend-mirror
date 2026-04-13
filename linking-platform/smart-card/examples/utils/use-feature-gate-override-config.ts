import { useEffect, useMemo, useState } from 'react';

import FeatureGates, { FeatureGateEnvironment } from '@atlaskit/feature-gate-js-client';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

type FeatureGateConfig = Parameters<(typeof FeatureGates)['overrideConfig']>[1];

const experimentConfig: Record<string, FeatureGateConfig> = {
	platform_sl_3p_unauth_paste_as_block_card: {
		cohort: 'card_by_default_and_new_design',
	},
	platform_sl_3p_preauth_better_hovercard: {
		isEnabled: true,
	},
	platform_sl_3p_auth_rovo_action: {
		isEnabled: true,
	},
};

const enabledGates = ['platform_sl_3p_preauth_better_hovercard_killswitch'];

const emptyConfig = {};
const emptyGates: string[] = [];

const useFeatureGateOverrideConfig = (withExperiments: boolean = true) => {
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
			currentEnabledGates.forEach((gate) => {
				FeatureGates.overrideGate(gate, true);
			});

			// The example website framework sets a static booleanResolver from
			// URL query params, which intercepts fg() and ignores gate overrides.
			// Override it to delegate to FeatureGates.checkGate() instead.
			// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
			setBooleanFeatureFlagResolver((flagKey) => FeatureGates.checkGate(flagKey));

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
