import { type EditorExperimentsConfig } from './experiments-config';
import { editorExperiment } from './experiments';

/**
 * Check the value if an editor experiment and fire exposure.
 *
 * !!! Note: This method always fires exposure. !!!
 *
 * @example Boolean experiment
 * if (expValEquals('example-boolean', true)) {
 *   // Run code for on variant
 * } else {
 *   // Run code for off variant
 * }
 *
 * @example Multivariate experiment
 * if (expValEquals('example-multivariate', 'one')) {
 *   // Run code for 'one' variant
 * } else {
 *   // Run code for control
 * }
 *
 * @param experimentName - experiment key
 * @param experimentExpectedValue - expected value to compare with
 *
 * @returns boolean
 */
export function expValEquals<
	ExperimentName extends keyof EditorExperimentsConfig,
	ExperimentValue extends EditorExperimentsConfig[ExperimentName]['defaultValue'],
>(experimentName: ExperimentName, experimentExpectedValue: ExperimentValue): boolean {
	return editorExperiment(experimentName, experimentExpectedValue, { exposure: true });
}
