import { editorExperimentsConfig } from './experiments-config';

export type EditorExperimentOverrides = Partial<{
	[ExperimentName in keyof typeof editorExperimentsConfig]: (typeof editorExperimentsConfig)[ExperimentName]['defaultValue'];
}>;

export let _overrides = {} as EditorExperimentOverrides;
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
	 * Overrides are used to set the value of an experiment for testing purposes.
	 * This is useful when you want to test a specific value of an experiment.
	 */
	overrides?: EditorExperimentOverrides,
) {
	if (overrides) {
		// When setting up overrides, we want to ensure that experiments don't end up with invalid
		// values.
		// For production usage -- this is done via the feature flag client which takes the type
		// and performs equivalent logic.
		// @ts-ignore
		overrides = Object.entries(overrides).reduce((acc, [key, value]) => {
			const config = editorExperimentsConfig[key as keyof typeof editorExperimentsConfig];

			if (config) {
				acc = { ...acc, [key]: config.typeGuard(value) ? value : config.defaultValue };
			}
			return acc;
		}, {});

		_overrides = overrides;
	}
	_product = product;
}
