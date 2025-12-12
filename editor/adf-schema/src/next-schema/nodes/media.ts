import { adfNode } from '@atlaskit/adf-schema-generator';
import { annotation } from '../marks/annotation';
import { border } from '../marks/border';
import { link } from '../marks/link';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const media = adfNode('media').define({
	selectable: true,

	marks: [link, annotation, border, unsupportedMark, unsupportedNodeAttribute],

	attrs: {
		anyOf: [
			{
				type: {
					type: 'enum',
					values: ['link', 'file'],
					default: 'file',
				},
				localId: { type: 'string', default: null, optional: true },

				id: { minLength: 1, type: 'string', default: '' },
				alt: { type: 'string', default: '', optional: true },
				collection: { type: 'string', default: '' },

				height: { type: 'number', default: null, optional: true },
				occurrenceKey: {
					minLength: 1,
					type: 'string',
					default: null,
					optional: true,
				},

				width: { type: 'number', default: null, optional: true },

				__contextId: { type: 'string', default: null, optional: true },
				__displayType: {
					type: 'enum',
					values: ['file', 'thumbnail'],
					default: null,
					optional: true,
				},
				__external: { type: 'boolean', default: false, optional: true },
				__fileMimeType: { type: 'string', default: null, optional: true },
				__fileName: { type: 'number', default: null, optional: true },
				__fileSize: { type: 'string', default: null, optional: true },
				__mediaTraceId: { type: 'string', default: null, optional: true },
			},
			{
				type: {
					type: 'enum',
					values: ['external'],
					default: 'file',
				},
				localId: { type: 'string', default: null, optional: true },
				alt: { type: 'string', default: '', optional: true },
				height: { type: 'number', default: null, optional: true },
				width: { type: 'number', default: null, optional: true },
				url: { type: 'string', default: null },
				__external: { type: 'boolean', default: false, optional: true },
			},
		],
	},
});
