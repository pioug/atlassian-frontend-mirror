import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const embedCard: ADFNode<[string], ADFCommonNodeSpec> = adfNode('embedCard').define({
	selectable: true,

	marks: [unsupportedMark, unsupportedNodeAttribute],

	attrs: {
		url: { type: 'string', default: '', validatorFn: 'safeUrl' },
		layout: {
			type: 'enum',
			values: [
				'wide',
				'full-width',
				'center',
				'wrap-right',
				'wrap-left',
				'align-end',
				'align-start',
			],
			default: 'center',
		},
		width: {
			type: 'number',
			maximum: 100,
			minimum: 0,
			default: 100,
			optional: true,
		},
		originalHeight: { type: 'number', default: null, optional: true },
		originalWidth: { type: 'number', default: null, optional: true },
		localId: { type: 'string', default: null, optional: true },
	},
});
