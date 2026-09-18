import type { LabelStack, SegmentLabel } from '../../../interaction-context';
import { type UFOSegmentType } from '../../../segment/segment';
import type { getReactUFOPayloadVersion } from '../../utils/get-react-ufo-payload-version';
import { getLabelStackReference } from './index';
import { sanitizeLabelStackName } from './sanitize-label-stack-name';

export function optimizeLabelStack(
	labelStack: LabelStack,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
):
	| string
	| {
			t?: UFOSegmentType | undefined;
			s?: string | undefined;
			n: string;
	  }[] {
	return reactUFOVersion === '2.0.0'
		? getLabelStackReference(labelStack)
		: labelStack.map((ls) => ({
				n: sanitizeLabelStackName(ls.name),
				...((ls as SegmentLabel).segmentId ? { s: (ls as SegmentLabel).segmentId } : {}),
				...((ls as SegmentLabel).type ? { t: (ls as SegmentLabel).type } : {}),
			}));
}
