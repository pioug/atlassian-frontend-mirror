import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';
import { annotation } from '../marks/annotation';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const inlineCard: ADFNode<
	[string, 'with_annotation'],
	ADFCommonNodeSpec & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		marks: any[];
	}
> = adfNode('inlineCard')
	.define({
		inline: true,
		selectable: true,
		draggable: true,

		marks: [unsupportedMark, unsupportedNodeAttribute],

		attrs: {
			anyOf: [
				{
					url: { type: 'string', default: null, validatorFn: 'safeUrl' },
					localId: { type: 'string', default: null, optional: true },
				},
				{
					data: { type: 'object', default: null },
					localId: { type: 'string', default: null, optional: true },
				},
			],
		},

		stage0: {
			marks: [annotation, unsupportedNodeAttribute, unsupportedMark],
		},
	})
	.variant('with_annotation', {
		marks: [annotation, unsupportedMark, unsupportedNodeAttribute],
	});
