import type { ApdexType } from '../../common';
import type { UFOSegmentType } from '../../segment/segment';
import { optimizeLabelStack } from '../common/utils';

import type { getReactUFOPayloadVersion } from './get-react-ufo-payload-version';

export function optimizeApdex(
	apdex: ApdexType[],
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
): {
	labelStack?:
		| string
		| {
				t?: UFOSegmentType | undefined;
				s?: string | undefined;
				n: string;
		  }[]
		| undefined;
	stopTime: number;
	key: string;
	startTime?: number;
}[] {
	return apdex.map(({ stopTime, labelStack, ...others }) => ({
		...others,
		stopTime: Math.round(stopTime),
		...(labelStack ? { labelStack: optimizeLabelStack(labelStack, reactUFOVersion) } : {}),
	}));
}
