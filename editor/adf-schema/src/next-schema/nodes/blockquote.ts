import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { bulletList, orderedList } from './list';
import { paragraph } from './paragraph';
import { unsupportedBlock } from './unsupportedBlock';
import { codeBlock } from './codeBlock';
import { mediaGroup } from './mediaGroup';
import { mediaSingle } from './mediaSingle';
import { extension } from './extension';

const blockQuoteContent = [
	paragraph.use('with_no_marks'),
	orderedList,
	bulletList,
	unsupportedBlock,
	codeBlock,
	mediaSingle.use('caption'),
	mediaSingle.use('full'),
	mediaGroup,
	extension.use('with_marks'),
];

export const blockquote = adfNode('blockquote')
	.define({
		defining: true,
		selectable: true,
		marks: [unsupportedMark, unsupportedNodeAttribute],
		content: [$onePlus($or(...blockQuoteContent))],
		attrs: {
			localId: { type: 'string', default: null, optional: true },
		},
	})
	.variant('legacy', {
		ignore: ['json-schema', 'validator-spec'],
		content: [$onePlus($or(paragraph, unsupportedBlock))],
		attrs: {
			localId: { type: 'string', default: null, optional: true },
		},
	});
