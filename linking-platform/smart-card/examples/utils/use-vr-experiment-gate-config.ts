import { useEffect, useState } from 'react';

import FeatureGates, {
	FeatureGateEnvironment,
} from '@atlaskit/feature-gate-js-client/feature-gates';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import {
	setupEditorExperiments,
	type EditorExperimentOverrides,
} from '@atlaskit/tmp-editor-statsig/setup';

export type GateOverride = {
	/** The feature gate key to override. */
	key: string;
	/** The value to set for the gate (true = enabled). */
	value: boolean;
};

export type ExperimentConfig = {
	/** The experiment key to override (used for both FeatureGates config and editor experiments). */
	key: string;
	/**
	 * The config value to set for this experiment. Can be any shape that
	 * `FeatureGates.overrideConfig()` accepts — most commonly `{ isEnabled: boolean }`
	 * but may include other fields like `{ variant: string }`.
	 */
	value: Record<string, unknown>;
};

export type VrExperimentGateConfig = {
	/** List of experiment configs to override (FeatureGates config + editor experiments). */
	experiments?: ExperimentConfig[];
	/** List of plain gate overrides (FeatureGates gate + platform feature flag resolver). */
	gates?: GateOverride[];
};

/**
 * A reusable hook for VR tests that sets up FeatureGates overrides for one or more
 * experiments and/or gates.
 *
 * Returns a `revision` number that increments once the async setup is complete.
 * Consumers should render nothing (or a placeholder) until `revision` is non-zero.
 *
 * @example
 * const EXPERIMENT_KEY = 'my_experiment_key';
 * const KILL_SWITCH_KEY = 'my_kill_switch';
 *
 * const revision = useVrExperimentGateConfig({
 *   experiments: [{ key: EXPERIMENT_KEY, value: { isEnabled: true } }],
 *   gates: [{ key: KILL_SWITCH_KEY, value: false }],
 * });
 */
const useVrExperimentGateConfig = ({
	experiments = [],
	gates = [],
}: VrExperimentGateConfig): number => {
	const [revision, setRevision] = useState(0);

	// Stable serialized deps so the effect only re-runs when the config actually changes.
	const experimentsDep = JSON.stringify(experiments);
	const gatesDep = JSON.stringify(gates);

	useEffect(() => {
		let cancelled = false;

		// Deserialize from stable string deps — avoids capturing the raw object refs
		// which would be new on every render when callers pass inline config objects.
		const parsedExperiments: ExperimentConfig[] = JSON.parse(experimentsDep);
		const parsedGates: GateOverride[] = JSON.parse(gatesDep);

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

			// Override each experiment via FeatureGates config.
			parsedExperiments.forEach(({ key, value }) => {
				FeatureGates.overrideConfig(key, value);
			});

			// Override each plain gate via FeatureGates.
			parsedGates.forEach(({ key, value }) => {
				FeatureGates.overrideGate(key, value);
			});

			// Set up editor experiments for all experiment keys.
			if (parsedExperiments.length > 0) {
				const editorOverrides = parsedExperiments.reduce<EditorExperimentOverrides>(
					(acc, { key, value }) => {
						(acc as Record<string, unknown>)[key] = value;
						return acc;
					},
					{} as EditorExperimentOverrides,
				);

				setupEditorExperiments('test', editorOverrides, undefined, {
					disableTestOverrides: true,
				});
			}

			// Build a map for fast lookup in the resolver.
			const gateValueMap = new Map<string, boolean>(
				parsedGates.map(({ key, value }) => [key, value]),
			);

			setBooleanFeatureFlagResolver((flagKey) => {
				if (gateValueMap.has(flagKey)) {
					return gateValueMap.get(flagKey)!;
				}

				// `fg()` delegates to this resolver, so read the local FeatureGates overrides directly.
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
	}, [experimentsDep, gatesDep]);

	return revision;
};

export default useVrExperimentGateConfig;
