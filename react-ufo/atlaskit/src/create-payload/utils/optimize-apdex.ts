import type { ApdexType } from '../../common';
import type { OptimizedLabelStack } from '../common/types';
import type { LabelStackRegistry } from '../common/utils/label-stack-registry';
import { optimizeLabelStackWithRegistry } from '../common/utils/optimize-label-stack-with-registry';
import type { getReactUFOPayloadVersion } from './get-react-ufo-payload-version';

export function optimizeApdex(
	apdex: ApdexType[],
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
	registry?: LabelStackRegistry,
): {
	labelStack?: OptimizedLabelStack | undefined;
	stopTime: number;
	key: string;
	startTime?: number;
}[] {
	return apdex.map(({ stopTime, labelStack, ...others }) => ({
		...others,
		stopTime: Math.round(stopTime),
		...(labelStack
			? { labelStack: optimizeLabelStackWithRegistry(labelStack, reactUFOVersion, registry) }
			: {}),
	}));
}
