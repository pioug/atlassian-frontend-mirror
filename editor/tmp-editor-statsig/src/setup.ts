/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { editorExperimentsConfig } from './experiments-config';
import {
	testBooleanOverrides,
	testMultivariateOverrides,
	type EditorExperimentOverridesBoolean,
	type EditorExperimentOverridesMultivariate,
} from './exp-test-overrides';

export type EditorExperimentOverrides = Partial<{
	[ExperimentName in keyof typeof editorExperimentsConfig]: (typeof editorExperimentsConfig)[ExperimentName]['defaultValue'];
}>;
export type EditorExperimentParamOverrides = {
	// Once the param setup moves to config -- this type can be more specific
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[experimentName: string]: { [paramName: string]: any };
};

export let _overrides = {} as EditorExperimentOverrides;
export let _paramOverrides = {} as EditorExperimentParamOverrides;
export let _product: 'confluence' | 'jira' | 'test' | undefined;

/**
 * This function is used to set up the editor experiments for testing purposes.
 * It should be called before running code that depends on editor experiments.
 *
 * @example
 * ```ts
 * setupEditorExperiments('confluence', {
 *  'experiment-name': 'value',
 * });
 * ```
 */
export function setupEditorExperiments(
	product: 'confluence' | 'jira' | 'test',
	/**
	 * Overrides are used to set the group of an experiment for testing purposes.
	 * This is useful when you want to test a specific experiment group.
	 */
	groupOverrides?: EditorExperimentOverrides,
	/**
	 * Param overrides are used to set the experiment parameters for testing purposes.
	 * This is useful when you want to tweak the experiment parameters for testing.
	 */
	paramOverrides?: EditorExperimentParamOverrides,
	options?: {
		/**
		 * By default, boolean experiments are enabled when using `product === test`
		 * This option allows you to disable this behaviour (ie. for examples)
		 */
		disableTestOverrides?: boolean;
	},
) {
	if (groupOverrides) {
		// When setting up overrides, we want to ensure that experiments don't end up with invalid
		// values.
		// For production usage -- this is done via the feature flag client which takes the type
		// and performs equivalent logic.
		// @ts-ignore
		groupOverrides = Object.entries(groupOverrides).reduce((acc, [key, value]) => {
			const config = editorExperimentsConfig[key as keyof typeof editorExperimentsConfig];

			if (config) {
				acc = { ...acc, [key]: config.typeGuard(value) ? value : config.defaultValue };
			}
			return acc;
		}, {});

		_overrides = groupOverrides;
	}

	if (product === 'test' && !options?.disableTestOverrides) {
		// Enforce expectation - file overrides, then global overrides, then default to true for boolean
		// experiments, then last result use the default value
		const testOverrides: EditorExperimentOverrides = Object.fromEntries(
			Object.entries(editorExperimentsConfig).map(([key, value]) => {
				const defaultValue = typeof value.defaultValue === 'boolean' ? true : value.defaultValue;
				return [
					key,
					groupOverrides?.[key as keyof EditorExperimentOverrides] ??
						testMultivariateOverrides[key as keyof EditorExperimentOverridesMultivariate] ??
						testBooleanOverrides[key as keyof EditorExperimentOverridesBoolean] ??
						defaultValue,
				];
			}),
		);

		_overrides = testOverrides;
	}
	_product = product;

	_paramOverrides = paramOverrides || {};
}
