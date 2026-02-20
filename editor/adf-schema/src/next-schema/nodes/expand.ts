import type {
	ADFCommonNodeSpec,
	ADFNode,
} from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';

import { breakout } from '../marks/breakout';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { nestedExpand } from './nestedExpand';
import { nonNestableBlockContentGroup } from '../groups/nonNestableBlockContentGroup';

export const expand: ADFNode<
	[string, 'root_only'],
	ADFCommonNodeSpec & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		marks: any[];
		noExtend: true;
		noMarks: false;
	}
> = adfNode('expand')
	.define({
		isolating: true,
		selectable: true,
		noMarks: true,

		attrs: {
			title: { type: 'string', default: '', optional: true },
			__expanded: { type: 'boolean', default: true, optional: true },
			localId: { type: 'string', default: null, optional: true },
		},
		content: [
			$onePlus(
				$or(nonNestableBlockContentGroup, nestedExpand.use('with_no_marks')),
			),
		],
	})
	.variant('root_only', {
		marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
		noMarks: false,
		noExtend: true,
	});
