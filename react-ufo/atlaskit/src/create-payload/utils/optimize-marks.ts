import type { InteractionMetrics, MarkType } from '../../common';
import type { OptimizedLabelStack } from '../common/types';
import { optimizeLabelStackWithRegistry } from '../common/utils';
import type { LabelStackRegistry } from '../common/utils/label-stack-registry';

import type { getReactUFOPayloadVersion } from './get-react-ufo-payload-version';

export function optimizeMarks(
	marks: InteractionMetrics['marks'],
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
	registry?: LabelStackRegistry,
): {
	labelStack: OptimizedLabelStack | null;
	time: number;
	type: MarkType;
	name: string;
}[] {
	return marks.map(({ labelStack, time, ...others }) => ({
		...others,
		labelStack: labelStack && optimizeLabelStackWithRegistry(labelStack, reactUFOVersion, registry),
		time: Math.round(time),
	}));
}
