import type { ApdexType } from '../../common';
import { optimizeLabelStack } from '../common/utils';

import type { getReactUFOPayloadVersion } from './get-react-ufo-payload-version';

export function optimizeApdex(
	apdex: ApdexType[],
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
) {
	return apdex.map(({ stopTime, labelStack, ...others }) => ({
		...others,
		stopTime: Math.round(stopTime),
		...(labelStack ? { labelStack: optimizeLabelStack(labelStack, reactUFOVersion) } : {}),
	}));
}
