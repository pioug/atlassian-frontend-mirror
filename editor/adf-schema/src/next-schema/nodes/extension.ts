import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';

import { annotation } from '../marks/annotation';
import { breakout } from '../marks/breakout';
import { dataConsumer } from '../marks/dataConsumer';
import { fragment } from '../marks/fragment';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const extension: ADFNode<
	[string, 'with_marks', 'with_annotation', 'root_only', 'root_only_with_annotation'],
	ADFCommonNodeSpec & {
		ignore: never[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		marks: any[];
	}
> = adfNode('extension')
	.define({
		atom: true,
		selectable: true,

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
	})
	.variant('with_marks', {
		marks: [dataConsumer, fragment, unsupportedMark, unsupportedNodeAttribute],
		ignore: [],
	})
	.variant('with_annotation', {
		stage0: true,
		marks: [annotation, dataConsumer, fragment, unsupportedMark, unsupportedNodeAttribute],
		ignore: [],
	})
	// this variant is used to support breakout resizing for extension nodes at the document root
	.variant('root_only', {
		stage0: true,
		marks: [breakout, dataConsumer, fragment, unsupportedMark, unsupportedNodeAttribute],
	})
	.variant('root_only_with_annotation', {
		stage0: true,
		marks: [
			annotation,
			breakout,
			dataConsumer,
			fragment,
			unsupportedMark,
			unsupportedNodeAttribute,
		],
	});
