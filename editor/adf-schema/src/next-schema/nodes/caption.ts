import { $or } from '@atlaskit/adf-schema-generator/$or';
import { $zeroPlus } from '@atlaskit/adf-schema-generator/$zeroPlus';
import type { ADFNode } from '@atlaskit/adf-schema-generator/adfNode';
import { adfNode } from '@atlaskit/adf-schema-generator/adfNode';
import type { ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator/types/ADFNodeSpec';

import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { date } from './date';
import { emoji } from './emoji';
import { hardBreak } from './hardBreak';
import { inlineCard } from './inlineCard';
import { mention } from './mention';
import { placeholder } from './placeholder';
import { status } from './status';
import { text } from './text';
import { unsupportedInline } from './unsupportedInline';

export const caption: ADFNode<[string], ADFCommonNodeSpec> = adfNode('caption').define({
	isolating: true,
	selectable: false,

	marks: [unsupportedMark, unsupportedNodeAttribute],
	allowAnyChildMark: true,

	attrs: {
		localId: { type: 'string', default: null, optional: true },
	},

	content: [
		$zeroPlus(
			$or(
				hardBreak,
				mention,
				emoji,
				date,
				placeholder,
				inlineCard,
				status,
				text.use('formatted'),
				text.use('code_inline'),
				unsupportedInline,
			),
		),
	],
});
