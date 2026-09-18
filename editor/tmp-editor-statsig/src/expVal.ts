/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/* eslint-disable @atlaskit/editor/no-re-export -- deprecated shims re-exporting the split `expVal`/`expValNoExposure` modules for backwards compatibility (VOLTC-139). */

import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { addFeatureFlagAccessed } from '@atlaskit/react-ufo/feature-flags-accessed';

import { disallowsProductKeys, editorExperimentsConfig } from './experiments-config';
import type { EditorExperimentsConfig } from './experiments-config';
import { _overrides, _paramOverrides, _product } from './setup';

export function expValInternal<
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

	const resolvedExperimentKey =
		!disallowsProductKeys.includes(experimentName) &&
		fg('platform_editor_experiments_use_product_keys')
			? experimentKey
			: experimentName;

	// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
	const experimentValue = FeatureGates.getExperimentValue(
		resolvedExperimentKey,
		experimentParam,
		defaultValue,
		{
			fireExperimentExposure: fireExperimentExposure,
		},
	);

	// Duplicated from /confluence/next/packages/feature-experiments/src/index.ts
	addFeatureFlagAccessed(`${resolvedExperimentKey}:${experimentParam}`, experimentValue as never);

	return experimentValue;
}

/**
 * @deprecated Use `import { expVal } from '@atlaskit/tmp-editor-statsig/expVal'` instead.
 */
export { expVal } from './exp-val';
/**
 * @deprecated Use `import { expValNoExposure } from '@atlaskit/tmp-editor-statsig/expVal'` instead.
 */
export { expValNoExposure } from './exp-val-no-exposure';
