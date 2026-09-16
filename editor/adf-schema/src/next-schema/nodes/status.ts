import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';
import { annotation } from '../marks/annotation';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const status: ADFNode<[string], ADFCommonNodeSpec> = adfNode('status').define({
	inline: true,
	selectable: true,

	marks: [unsupportedNodeAttribute, unsupportedMark],

	attrs: {
		text: { minLength: 1, type: 'string', default: '' },
		color: {
			type: 'string',
			pattern: '^(neutral|purple|blue|red|yellow|green|#[0-9a-fA-F]{6})$',
			default: '',
		},
		localId: { type: 'string', optional: true, default: '' },
		style: { type: 'string', optional: true, default: '' },
	},

	stage0: {
		marks: [unsupportedNodeAttribute, unsupportedMark, annotation],
	},
});
