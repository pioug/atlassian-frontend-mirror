/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import FeatureGates from '@atlaskit/feature-gate-js-client';

import { type EditorExperimentsConfig, editorExperimentsConfig } from './experiments-config';
import { _overrides, _paramOverrides, _product } from './setup';

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
		// @ts-ignore
		experimentKey,
		experimentConfig.param,
		experimentConfig.defaultValue,
		{ typeGuard: experimentConfig.typeGuard, fireExperimentExposure: options.exposure },
	);

	return expectedExperimentValue === experimentValue;
}

type Unstable_EditorExperimentParams = {
	platform_editor_ai_proactive_ai_nudge_parameters: {
		params:
			| 'min_final_confidence'
			| 'min_length_percentage_difference'
			| 'max_length_percentage_difference'
			| 'min_input_readability_score'
			| 'min_output_readability_score'
			| 'max_readability_score_delta'
			| 'min_readability_score_delta'
			| 'min_alternative_confidence';
	};
};

// type Unstable_EditorExperimentParams = {};
/**
 * @warning This currently lacks type safety on the param names and return values
 * and has limited associated test tooling.
 *
 * It also only works for experiments where the key matches the productKey used.
 *
 * The typeguard and default value is also expected to move to the experiment config
 */
export function unstable_editorExperimentParam<
	ExperimentName extends keyof Unstable_EditorExperimentParams,
	// @ts-ignore
	ParamKey extends Unstable_EditorExperimentParams[ExperimentName]['params'],
	ParamValue = unknown,
>(
	experimentName: ExperimentName,
	paramName: ParamKey,
	options: {
		defaultValue: ParamValue;
		exposure?: boolean;
		typeGuard: (value: unknown) => value is ParamValue;
	},
): ParamValue {
	if (_paramOverrides[experimentName]?.[paramName] !== undefined) {
		// This will be hit in the case of a test setting an override

		return _paramOverrides[experimentName][paramName];
	}

	// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
	const experimentValue = FeatureGates.getExperimentValue(
		experimentName,
		paramName,
		options.defaultValue,
		{
			typeGuard: options.typeGuard,
			fireExperimentExposure: options.exposure ?? false,
		},
	);

	return experimentValue;
}
