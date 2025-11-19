import type { InteractionMetrics, MarkType } from '../../common';
import type { UFOSegmentType } from '../../segment/segment';
import { optimizeLabelStack } from '../common/utils';

import type { getReactUFOPayloadVersion } from './get-react-ufo-payload-version';

export function optimizeMarks(
	marks: InteractionMetrics['marks'],
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
): {
	labelStack:
		| string
		| {
				t?: UFOSegmentType | undefined;
				s?: string | undefined;
				n: string;
		  }[]
		| null;
	time: number;
	type: MarkType;
	name: string;
}[] {
	return marks.map(({ labelStack, time, ...others }) => ({
		...others,
		labelStack: labelStack && optimizeLabelStack(labelStack, reactUFOVersion),
		time: Math.round(time),
	}));
}
