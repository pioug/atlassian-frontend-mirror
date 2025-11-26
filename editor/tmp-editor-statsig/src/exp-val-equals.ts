import { expValEqualsInternal } from './exp-val-equals-internal';

import {
	type EditorExperimentsConfig,
	type ExperimentDefaultValue,
	type ExperimentExpectedValue,
} from './experiments-config';

/**
 * Check the value if an editor experiment and fire exposure.
 *
 * !!! Note: This method always fires exposure. !!!
 *
 * IMPORTANT: If experiment is not defined default value will be null, unless provided otherwise.
 *
 * @example Boolean experiment
 * if (expValEquals('example-boolean', 'isEnabled', true)) {
 *   // Run code for on variant
 * } else {
 *   // Run code for off variant
 * }
 *
 * @example Multivariate experiment
 * if (expValEquals('example-multivariate', 'cohort', 'one')) {
 *   // Run code for 'one' variant
 * } else {
 *   // Run code for control
 * }
 *
 * @param experimentName - experiment key
 * @param experimentParam - the name of the parameter to fetch from the experiment config
 * @param experimentExpectedValue - expected value to compare with. Can't use false for boolean experiments or invalid values for multivariate experiments.
 * @param experimentDefaultValue - default value to use if the experiment is not defined. Can't use true for boolean experiments or invalid values for multivariate experiments.
 *
 * @returns boolean
 */
export function expValEquals<ExperimentName extends keyof EditorExperimentsConfig>(
	experimentName: ExperimentName,
	experimentParam: EditorExperimentsConfig[ExperimentName]['param'],
	experimentExpectedValue: ExperimentExpectedValue<ExperimentName>,
	experimentDefaultValue: ExperimentDefaultValue<ExperimentName> | null = null,
): boolean {
	return expValEqualsInternal(
		experimentName,
		experimentParam,
		experimentExpectedValue as EditorExperimentsConfig[ExperimentName]['defaultValue'],
		experimentDefaultValue as EditorExperimentsConfig[ExperimentName]['defaultValue'] | null,
		true,
	);
}
