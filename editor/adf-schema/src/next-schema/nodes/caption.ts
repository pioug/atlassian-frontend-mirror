import { $or, $zeroPlus, adfNode } from '@atlaskit/adf-schema-generator';
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

export const caption = adfNode('caption').define({
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
