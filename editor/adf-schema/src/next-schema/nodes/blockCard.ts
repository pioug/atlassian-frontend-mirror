import { adfNode } from '@atlaskit/adf-schema-generator';
import { unsupportedMark } from '../marks/unsupportedMark';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';

export const blockCard = adfNode('blockCard').define({
	draggable: true,
	selectable: true,
	marks: [unsupportedMark, unsupportedNodeAttribute],
	attrs: {
		anyOf: [
			{
				localId: { type: 'string', default: null, optional: true },
				url: {
					type: 'string',
					optional: true,
					default: null,
					validatorFn: 'safeUrl',
				},
				datasource: {
					type: 'object',
					default: null,
					additionalProperties: false,
					properties: {
						id: { type: 'string' },
						// Empty parameters object carried over from original JSON Schema.
						parameters: { type: 'object' },
						views: {
							items: {
								additionalProperties: false,
								properties: {
									// Empty properties object carried over from original JSON Schema
									properties: { optional: true, type: 'object' },
									type: {
										type: 'string',
									},
								},
								required: ['type'],
								type: 'object',
							},
							minItems: 1,
							type: 'array',
						},
					},
					required: ['id', 'parameters', 'views'],
				},
				width: { type: 'number', optional: true, default: null },
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
					optional: true,
					default: null,
				},
			},
			{
				url: { type: 'string', validatorFn: 'safeUrl' },
				localId: { type: 'string', default: null, optional: true },
			},
			{
				data: { type: 'object', default: null },
				localId: { type: 'string', default: null, optional: true },
			},
		],
	},
});
