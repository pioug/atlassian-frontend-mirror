import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { codeBlock } from './codeBlock';
import { extension } from './extension';
import { mediaSingle } from './mediaSingle';
import { paragraph } from './paragraph';
import { taskList } from './task';
import { unsupportedBlock } from './unsupportedBlock';

export const orderedList: ADFNode<[string], ADFCommonNodeSpec> = adfNode('orderedList');
export const bulletList: ADFNode<[string], ADFCommonNodeSpec> = adfNode('bulletList');

const listItem = adfNode('listItem').define({
	defining: true,
	selectable: false,
	attrs: {
		localId: { type: 'string', default: null, optional: true },
	},

	marks: [unsupportedMark, unsupportedNodeAttribute],

	contentMinItems: 1,
	content: [
		$onePlus(
			$or(
				paragraph.use('with_font_size'),
				paragraph.use('with_no_marks'),
				bulletList,
				orderedList,
				taskList,
				mediaSingle.use('caption'),
				mediaSingle.use('full'),
				codeBlock,
				unsupportedBlock,
				extension.use('with_marks'),
			),
		),
	],
});

orderedList.define({
	selectable: false,

	marks: [unsupportedMark, unsupportedNodeAttribute],

	attrs: {
		order: {
			type: 'number',
			minimum: 0,
			default: 1,
			optional: true,
		},
		localId: { type: 'string', default: null, optional: true },
	},
	content: [$onePlus($or(listItem))],
});

bulletList.define({
	selectable: false,

	marks: [unsupportedMark, unsupportedNodeAttribute],

	content: [$onePlus($or(listItem))],
	attrs: {
		localId: { type: 'string', default: null, optional: true },
	},
});
