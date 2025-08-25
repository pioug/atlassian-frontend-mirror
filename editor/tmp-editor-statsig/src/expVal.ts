import FeatureGates from '@atlaskit/feature-gate-js-client';

import { type EditorExperimentsConfig, editorExperimentsConfig } from './experiments-config';
import { _overrides, _paramOverrides, _product } from './setup';

function expValInternal<
	ExperimentName extends keyof EditorExperimentsConfig,
	DefaultValue extends string | number | boolean,
>({
	experimentName,
	experimentParam,
	defaultValue,
	fireExperimentExposure,
}: {
	defaultValue: DefaultValue;
	experimentName: ExperimentName;
	experimentParam: string;
	fireExperimentExposure: boolean;
}): DefaultValue {
	const experimentConfig = editorExperimentsConfig[experimentName];

	if (experimentConfig === undefined) {
		// Warning! If a product is improperly configured (ie. their editor packages are misaligned)
		// it can cause the editor to crash here or if the experiment does not exist.
		// We will definitely crash via any code path later in this function - this just makes the error explicit and clear.
		throw new Error(
			`Editor experiment configuration is not defined ${experimentName}. Likely the experiment does not exist or editor package versions are misaligned`,
		);
	}

	// @ts-ignore need to loosen the type here to allow for any experiment name
	if (_overrides[experimentName] !== undefined) {
		// This will be hit in the case of a test setting an override
		// @ts-ignore need to loosen the type here to allow for any experiment name
		return _overrides[experimentName] as DefaultValue;
	}

	// Check for parameter overrides
	const paramOverride = _paramOverrides[experimentName as string]?.[experimentParam];
	if (paramOverride !== undefined) {
		return paramOverride as DefaultValue;
	}

	// If client is not initialized, we return the default value
	if (!FeatureGates.initializeCompleted()) {
		return defaultValue;
	}

	if (!_product) {
		// This will be hit in the case of a product not having setup the editor experiment tooling
		return defaultValue;
	}

	// Typescript is complaining here about accessing the productKeys property
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const experimentKey = (experimentConfig?.productKeys as { [key: string]: string })?.[_product!];

	if (!experimentKey) {
		// This will be hit in the case of an experiment not being set up for the product
		return defaultValue;
	}

	// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
	const experimentValue = FeatureGates.getExperimentValue(
		experimentName,
		experimentParam,
		defaultValue,
		{
			fireExperimentExposure: fireExperimentExposure,
		},
	);
	return experimentValue;
}

/**
 * Use to check a any param value for an experiment
 *
 * **Note**: this will return the default value when the experiment;
 * - is not being served to the client (ie. pre start)
 * - or is not configured in experiments-config
 *
 * If you need to check a param value without an exposure check see {@link expParamEqualsNoExposure}
 *
 * @example
 * ```ts
 * const delay = expParamEquals('experiment-name', 'param-name', defaultValue)
 * await new Promise(res => setTimeout(res, delay)
 * ```
 */
export function expVal<
	ExperimentName extends keyof EditorExperimentsConfig,
	DefaultValue extends string | number | boolean,
>(
	experimentName: ExperimentName,
	experimentParam: string,
	defaultValue: DefaultValue,
): DefaultValue {
	return expValInternal({
		experimentName,
		experimentParam,
		defaultValue,
		fireExperimentExposure: true,
	});
}

/**
 * Use to check a any param value for an experiment without firing an exposure event
 *
 * **Note**: this will return the default value when the experiment;
 * - is not being served to the client (ie. pre start)
 * - or is not configured in experiments-config
 *
 * @example
 * ```ts
 * const delay = expParamEqualsNoExposure('experiment-name', 'param-name', defaultValue)
 * await new Promise(res => setTimeout(res, delay)
 * ```
 */
export function expValNoExposure<
	ExperimentName extends keyof EditorExperimentsConfig,
	DefaultValue extends string | number | boolean,
>(
	experimentName: ExperimentName,
	experimentParam: string,
	defaultValue: DefaultValue,
): DefaultValue {
	return expValInternal({
		experimentName,
		experimentParam,
		defaultValue,
		fireExperimentExposure: false,
	});
}
