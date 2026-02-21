import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';
import { annotation } from '../marks/annotation';
import { border } from '../marks/border';
import { link } from '../marks/link';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const mediaInline: ADFNode<[string], ADFCommonNodeSpec> = adfNode('mediaInline').define({
	selectable: true,
	// atom: false,
	inline: true,

	marks: [link, annotation, border, unsupportedMark, unsupportedNodeAttribute],

	attrs: {
		type: {
			type: 'enum',
			values: ['link', 'file', 'image'],
			optional: true,
			default: 'file',
		},
		localId: { type: 'string', default: null, optional: true },
		url: { type: 'string', default: null, optional: true },

		id: { minLength: 1, type: 'string', default: '' },
		alt: { type: 'string', default: '', optional: true },
		collection: { type: 'string', default: '' },
		occurrenceKey: {
			minLength: 1,
			type: 'string',
			optional: true,
			default: null,
		},
		width: { type: 'number', default: null, optional: true },
		height: { type: 'number', default: null, optional: true },

		__fileName: { type: 'string', optional: true, default: null },
		__fileSize: { type: 'number', optional: true, default: null },
		__fileMimeType: { type: 'string', optional: true, default: null },
		__displayType: {
			type: 'enum',
			values: ['file', 'thumbnail'],
			optional: true,
			default: null,
		},
		__contextId: { type: 'string', optional: true, default: null },
		__mediaTraceId: { type: 'string', optional: true, default: null },
		__external: { type: 'boolean', optional: true, default: false },
		data: {
			type: 'object',
			optional: true,
		},
	},
});
