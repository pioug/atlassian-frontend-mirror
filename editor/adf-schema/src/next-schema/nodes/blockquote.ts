import type {
	ADFCommonNodeSpec,
	ADFNode,
	ADFNodeContentOneOrMoreSpec,
} from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';

import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { codeBlock } from './codeBlock';
import { extension } from './extension';
import { bulletList, orderedList } from './list';
import { mediaGroup } from './mediaGroup';
import { mediaSingle } from './mediaSingle';
import { paragraph } from './paragraph';
import { unsupportedBlock } from './unsupportedBlock';

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
	extension.use('with_annotation'),
];

export const blockquote: ADFNode<
	[string, 'legacy'],
	ADFCommonNodeSpec & {
		attrs: {
			localId: {
				default: null;
				optional: true;
				type: 'string';
			};
		};
		content: ADFNodeContentOneOrMoreSpec[];
		ignore: ('json-schema' | 'validator-spec')[];
	}
> = adfNode('blockquote')
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
