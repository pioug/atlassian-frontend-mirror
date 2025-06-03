import { type EditorExperimentsConfig } from './experiments-config';
import { editorExperiment } from './experiments';

/**
 * Check the value if an editor experiment and without exposure.
 *
 * !!! Note: This method never fires exposure. !!!
 *
 * @example Boolean experiment
 * if (expValEqualsNoExposure('example-boolean', true)) {
 *   // Run code for on variant
 * } else {
 *   // Run code for off variant
 * }
 *
 * @example Multivariate experiment
 * if (expValEqualsNoExposure('example-multivariate', 'one')) {
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
export function expValEqualsNoExposure<
	ExperimentName extends keyof EditorExperimentsConfig,
	ExperimentValue extends EditorExperimentsConfig[ExperimentName]['defaultValue'],
>(experimentName: ExperimentName, experimentExpectedValue: ExperimentValue): boolean {
	return editorExperiment(experimentName, experimentExpectedValue, { exposure: false });
}
