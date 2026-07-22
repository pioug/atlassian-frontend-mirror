import FeatureGates from '@atlaskit/feature-gate-js-client';
import { addFeatureFlagAccessed } from '@atlaskit/react-ufo/feature-flags-accessed';

import { editorExperimentsConfig, type EditorExperimentsConfig } from './experiments-config';

import { _overrides, _product } from './setup';

// This internal representation doesn't currently support productKeys
// the way expVal(...) does, this adds temporary support for some keys while
// we determine our preferred approach forward
const allowsProductKeys = [
	'cc-maui-experiment',
	'cc_maui_create_keyword',
	'platform_use_unicode_emojis',
];

/**
 * Check the value if an editor experiment.
 * Internal method that is shared between expValEquals and expValEqualsNoExposure.
 *
 * @example
 * exportValEqualsInternal('example-boolean', 'paramName', true, null, true);
 *
 * @param experimentName - experiment key
 * @param experimentParam - the name of the parameter to fetch from the experiment config
 * @param experimentExpectedValue - expected value to compare with
 * @param experimentDefaultValue - default value to use if the experiment is not set
 * @param experimentExposure - whether to fire an exposure event or not
 *
 * @returns boolean
 */
export function expValEqualsInternal<ExperimentName extends keyof EditorExperimentsConfig>(
	experimentName: ExperimentName,
	experimentParam: EditorExperimentsConfig[ExperimentName]['param'],
	experimentExpectedValue: EditorExperimentsConfig[ExperimentName]['defaultValue'],
	experimentDefaultValue: boolean | string | null,
	experimentExposure: boolean,
): boolean {
	// @ts-ignore need to loosen the type here to allow for any experiment name
	if (_overrides[experimentName] !== undefined) {
		// This will be hit in the case of a test setting an override
		// @ts-ignore need to loosen the type here to allow for any experiment name
		return _overrides[experimentName] === experimentExpectedValue;
	}

	// If client is not initialized, we compare with the default value
	if (!FeatureGates.initializeCompleted()) {
		return experimentDefaultValue === experimentExpectedValue;
	}

	// Typescript is complaining here about accessing the productKeys property
	const experimentKeyName = allowsProductKeys.includes(experimentName)
		? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			(editorExperimentsConfig[experimentName]?.productKeys?.[_product!] ?? experimentName)
		: experimentName;

	// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
	const experimentValue = FeatureGates.getExperimentValue(
		experimentKeyName,
		experimentParam,
		experimentDefaultValue,
		{ fireExperimentExposure: experimentExposure },
	);

	if (
		// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
		FeatureGates.getExperimentValue('cc_editor_experiments_ufo_gate_reporting', 'isEnabled', false)
	) {
		// Duplicated from /confluence/next/packages/feature-experiments/src/index.ts
		addFeatureFlagAccessed(`${experimentKeyName}:${experimentParam}`, experimentValue as never);
	}

	return experimentValue === experimentExpectedValue;
}
