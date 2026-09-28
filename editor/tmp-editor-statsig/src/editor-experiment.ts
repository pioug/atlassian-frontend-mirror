/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { addFeatureFlagAccessed } from '@atlaskit/react-ufo/feature-flags-accessed';

import { editorExperimentsConfig } from './experiments-config';
import type { EditorExperimentsConfig } from './experiments-config';
import { _overrides, _product } from './setup';

const EDITOR_CONTROLS_EXPERIMENT = 'platform_editor_controls';
const EDITOR_CONTROLS_OTHER_APPS_KILL_SWITCH = 'platform_editor_controls_other_apps_ks';

/**
 * Resolves the `platform_editor_controls` cohort while the experiment is being cleaned up.
 *
 * - Confluence and Jira always get `variant1`. Their product code has been cleaned up to always
 *   behave as `variant1` (EDITOR-9269, EDITOR-9270), so the editor must agree with it.
 * - Every other app (no product, or a product without a product key such as Bitbucket) gets
 *   `variant1` unless the kill switch `platform_editor_controls_other_apps_ks` passes for that app,
 *   in which case it gets `control`. The kill switch defaults to false, so controls are on by
 *   default. Its exposure always fires so Statsig shows which apps run this code.
 * - Before the Statsig client is initialised, other apps get the experiment's default value.
 * - The `test` product keeps the experiment's default value.
 *
 * Remove together with the experiment in EDITOR-9262.
 */
function getEditorControlsCohort(defaultValue: 'control' | 'variant1'): 'control' | 'variant1' {
	if (_product === 'confluence' || _product === 'jira') {
		return 'variant1';
	}

	if (_product === 'test') {
		return defaultValue;
	}

	if (!FeatureGates.initializeCompleted()) {
		return defaultValue;
	}

	// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
	return FeatureGates.checkGate(EDITOR_CONTROLS_OTHER_APPS_KILL_SWITCH, { fireGateExposure: true })
		? 'control'
		: 'variant1';
}

/**
 * Check the value of an editor experiment.
 *
 * Note: By default this will not fire an [exposure event](https://hello.atlassian.net/wiki/spaces/~732385844/pages/3187295823/Exposure+Events+101).
 *
 * You need explicitly call it using the exposure property when you need an exposure event to be fired (all experiments should fire exposure events).
 *
 * @example Boolean experiment
 * ```ts
 * if (editorExperiment('example-boolean', true)) {
 *   // Run code for on variant
 * } else {
 *   // Run code for off variant
 * }
 * ```
 *
 * @example Multivariate experiment
 * ```ts
 * switch (true) {
 * 	 case editorExperiment('example-multivariate', 'one'):
 *   	 // Run code for variant one
 *   break;
 *   case editorExperiment('example-multivariate', 'two'):
 *     // Run code for variant two
 *     break;
 *   case editorExperiment('example-multivariate', 'three'):
 *     // Run code for variant three
 *     break;
 *   }
 * }
 *```

 @example Experiment with exposure event
 * ```ts
 * // Inside feature surface where either the control or variant should be shown
 * if (editorExperiment('example-boolean', true, { exposure: true })) {
 * 	// Run code for on variant
 * } else {
 * 	// Run code for off variant
 * }
 * ```
 *
 * @private
 * @deprecated This utility is deprecated in favour of using `expValEquals` from `@atlaskit/tmp-editor-statsig/exp-val-equals`.
 *             ExpValEquals fires exposure events by default preventing cases when consumers of exitorExperiment forget to pass the `exposure` option.
 *             It also closely aligns with similar utilities in other Atlassian products.
 *             For no exposure option use `expValEqualsNoExposure` from `@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure`.
 */

export function editorExperiment<ExperimentName extends keyof EditorExperimentsConfig>(
	experimentName: ExperimentName,
	expectedExperimentValue: EditorExperimentsConfig[ExperimentName]['defaultValue'],
	options: { exposure: boolean } = { exposure: false },
): boolean {
	const experimentConfig = editorExperimentsConfig[experimentName];

	if (_overrides[experimentName] !== undefined) {
		// This will be hit in the case of a test setting an override
		return _overrides[experimentName] === expectedExperimentValue;
	}

	if (experimentConfig === undefined) {
		// Warning! If a product is improperly configured (ie. their editor packages are misaligned)
		// it can cause the editor to crash here or if the experiment does not exist.
		// We will definitely crash via any code path later in this function - this just makes the error explicit and clear.
		throw new Error(
			`Editor experiment configuration is not defined ${experimentName}. Likely the experiment does not exist or editor package versions are misaligned`,
		);
	}

	if (experimentName === EDITOR_CONTROLS_EXPERIMENT) {
		const cohort = getEditorControlsCohort(experimentConfig.defaultValue as 'control' | 'variant1');

		if (
			// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
			FeatureGates.getExperimentValue(
				'cc_editor_experiments_ufo_gate_reporting',
				'isEnabled',
				false,
			)
		) {
			addFeatureFlagAccessed(`${experimentName}:${experimentConfig.param}`, cohort);
		}

		return cohort === expectedExperimentValue;
	}

	if (!_product) {
		// This will be hit in the case of a product not having setup the editor experiment tooling
		return experimentConfig.defaultValue === expectedExperimentValue;
	}

	// Typescript is complaining here about accessing the productKeys property
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const experimentKey = (experimentConfig?.productKeys as { [key: string]: string })?.[_product!];

	if (!experimentKey) {
		// This will be hit in the case of an experiment not being set up for the product
		return editorExperimentsConfig[experimentName]?.defaultValue === expectedExperimentValue;
	}

	// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
	const experimentValue = FeatureGates.getExperimentValue(
		experimentKey,
		experimentConfig.param,
		experimentConfig.defaultValue,
		{ typeGuard: experimentConfig.typeGuard, fireExperimentExposure: options.exposure },
	);

	if (
		// When cleaning this gate up -- `calling where the experiments have the product key set`
		// in __tests__/experiments should be updated (as it's had the count bumped to include these).
		// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
		FeatureGates.getExperimentValue('cc_editor_experiments_ufo_gate_reporting', 'isEnabled', false)
	) {
		addFeatureFlagAccessed(`${experimentName}:${experimentConfig.param}`, experimentValue);
	}

	return expectedExperimentValue === experimentValue;
}
