import FeatureGates from '@atlaskit/feature-gate-js-client';

import { type EditorExperimentsConfig, editorExperimentsConfig } from './experiments-config';
import { _overrides, _product } from './setup';

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

	if (!_product) {
		// This will be hit in the case of a product not having setup the editor experiment tooling
		return experimentConfig.defaultValue === expectedExperimentValue;
	}

	// Typescript is complaining here about accessing the productKeys property
	const experimentKey = (experimentConfig.productKeys as { [key: string]: string })?.[_product!];

	if (!experimentKey) {
		// This will be hit in the case of an experiment not being set up for the product
		return editorExperimentsConfig[experimentName].defaultValue === expectedExperimentValue;
	}

	// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
	const experimentValue = FeatureGates.getExperimentValue(
		// @ts-ignore
		experimentKey,
		experimentConfig.param,
		experimentConfig.defaultValue,
		{ typeGuard: experimentConfig.typeGuard, fireExperimentExposure: options.exposure },
	);

	return expectedExperimentValue === experimentValue;
}
