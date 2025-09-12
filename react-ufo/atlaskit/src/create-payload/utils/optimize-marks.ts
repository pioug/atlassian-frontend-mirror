import type { InteractionMetrics } from '../../common';
import { optimizeLabelStack } from '../common/utils';

import type { getReactUFOPayloadVersion } from './get-react-ufo-payload-version';

export function optimizeMarks(
	marks: InteractionMetrics['marks'],
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
) {
	return marks.map(({ labelStack, time, ...others }) => ({
		...others,
		labelStack: labelStack && optimizeLabelStack(labelStack, reactUFOVersion),
		time: Math.round(time),
	}));
}
