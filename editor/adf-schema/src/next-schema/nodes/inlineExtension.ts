import { adfNode } from '@atlaskit/adf-schema-generator';
import { dataConsumer } from '../marks/dataConsumer';
import { fragment } from '../marks/fragment';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const inlineExtension = adfNode('inlineExtension')
	.define({
		inline: true,
		selectable: true,

		marks: [unsupportedMark, unsupportedNodeAttribute],
		hasEmptyMarks: true,

		attrs: {
			extensionKey: { minLength: 1, type: 'string', default: '' },
			extensionType: { minLength: 1, type: 'string', default: '' },
			parameters: { type: 'object', optional: true, default: null },
			text: { type: 'string', optional: true, default: null },
			localId: { minLength: 1, type: 'string', optional: true, default: null },
		},
	})
	.variant('with_marks', {
		marks: [dataConsumer, fragment, unsupportedMark, unsupportedNodeAttribute],
	});
