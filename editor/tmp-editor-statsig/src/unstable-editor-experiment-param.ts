/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';

import { _paramOverrides } from './setup';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Unstable_EditorExperimentParams = {};

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
