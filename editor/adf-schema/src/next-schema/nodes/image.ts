import {
	adfNode,
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator';

export const image = adfNode('image').define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	inline: true,
	draggable: true,

	attrs: {
		src: { type: 'string', default: '' },
		alt: { type: 'string', default: '', optional: true },
		title: { type: 'string', default: null, optional: true },
	},
});
