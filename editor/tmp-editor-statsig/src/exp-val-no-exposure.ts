import type { EditorExperimentsConfig } from './experiments-config';
import { expValInternal } from './expVal';

export function expValNoExposure<
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
		fireExperimentExposure: false,
	});
}
