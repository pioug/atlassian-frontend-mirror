import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';
import { annotation } from '../marks/annotation';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

const statusAttrs = {
	text: { minLength: 1, type: 'string' as const, default: '' },
	color: {
		type: 'enum' as const,
		values: ['neutral', 'purple', 'blue', 'red', 'yellow', 'green'],
		default: '',
	},
	localId: { type: 'string' as const, optional: true, default: '' },
	style: { type: 'string' as const, optional: true, default: '' },
};

export const status: ADFNode<[string], ADFCommonNodeSpec> = adfNode('status').define({
	inline: true,
	selectable: true,

	marks: [unsupportedNodeAttribute, unsupportedMark],

	attrs: statusAttrs,

	stage0: {
		marks: [unsupportedNodeAttribute, unsupportedMark, annotation],
		attrs: {
			...statusAttrs,
			color: {
				type: 'string',
				pattern: '^(neutral|purple|blue|red|yellow|green|#[0-9a-fA-F]{6})$',
				default: '',
			},
		},
	},
});
