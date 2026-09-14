import type { LabelStack } from '../../../interaction-context';

import { isSegmentLabel } from './is-segment-label';
import { sanitizeLabelStackName } from './sanitize-label-stack-name';

export function stringifyLabelStackWithoutId(labelStack: LabelStack): string {
	return labelStack
		.map((l) => {
			const name = sanitizeLabelStackName(l.name);
			if (isSegmentLabel(l)) {
				return `${name}:segment`;
			}
			return name;
		})
		.join('/');
}
