import type { EditorExperimentsConfig } from './experiments-config';
import { expValInternal } from './expVal';

/**
 * Use to check a any param value for an experiment
 *
 * **Note**: this will return the default value when the experiment;
 * - is not being served to the client (ie. pre start)
 * - or is not configured in experiments-config
 *
 * If you need to check a param value without an exposure check see
 * {@link import('./exp-val-no-exposure').expValNoExposure}
 *
 * @example
 * ```ts
 * const delay = expVal('experiment-name', 'param-name', defaultValue)
 * await new Promise(res => setTimeout(res, delay)
 * ```
 */
export function expVal<
	ExperimentName extends keyof EditorExperimentsConfig,
	DefaultValue extends string | number | boolean,
>(
	experimentName: ExperimentName,
	experimentParam: string,
	defaultValue: DefaultValue extends boolean ? false : DefaultValue,
): DefaultValue {
	return expValInternal({
		experimentName,
		experimentParam,
		defaultValue: defaultValue as DefaultValue,
		fireExperimentExposure: true,
	});
}
