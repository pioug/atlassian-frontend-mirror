import { $onePlus } from '@atlaskit/adf-schema-generator/$onePlus';
import { $or } from '@atlaskit/adf-schema-generator/$or';
import type { ADFNode } from '@atlaskit/adf-schema-generator/adfNode';
import { adfNode } from '@atlaskit/adf-schema-generator/adfNode';
import type { ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator/types/ADFNodeSpec';

import { nonNestableBlockContentGroup } from '../groups/nonNestableBlockContentGroup';
import { breakout } from '../marks/breakout';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { extension } from './extension';
import { nestedExpand } from './nestedExpand';

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
				$or(
					nonNestableBlockContentGroup,
					extension.use('with_annotation'),
					nestedExpand.use('with_no_marks'),
				),
			),
		],
	})
	.variant('root_only', {
		marks: [breakout, unsupportedMark, unsupportedNodeAttribute],
		noMarks: false,
		noExtend: true,
	});
