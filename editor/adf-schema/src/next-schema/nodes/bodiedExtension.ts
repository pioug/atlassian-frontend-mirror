import { $onePlus, $or, adfNode } from '@atlaskit/adf-schema-generator';
import { nonNestableBlockContentGroup } from '../groups/nonNestableBlockContentGroup';
import { dataConsumer } from '../marks/dataConsumer';
import { fragment } from '../marks/fragment';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const bodiedExtension = adfNode('bodiedExtension')
	.define({
		defining: true,
		selectable: true,
		isolating: true,
		// Marks don't make it into the PM node spec, as they get overridden by the marks in
		// packages/adf-schema-generator/src/transforms/adfToPm/buildPmSpec.ts
		marks: [unsupportedMark, unsupportedNodeAttribute],
		hasEmptyMarks: true,

		attrs: {
			extensionKey: { minLength: 1, type: 'string', default: '' },
			extensionType: { minLength: 1, type: 'string', default: '' },
			parameters: { type: 'object', optional: true, default: null },
			text: { type: 'string', optional: true, default: null },
			layout: {
				type: 'enum',
				values: ['wide', 'full-width', 'default'],
				optional: true,
				default: 'default',
			},
			localId: { minLength: 1, type: 'string', optional: true, default: null },
		},
		content: [$onePlus($or(nonNestableBlockContentGroup))],
	})
	.variant('with_marks', {
		marks: [dataConsumer, fragment, unsupportedMark, unsupportedNodeAttribute],
		content: [],
		ignore: [],
	});
