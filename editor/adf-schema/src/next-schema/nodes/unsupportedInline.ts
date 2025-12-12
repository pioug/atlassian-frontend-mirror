import {
	adfNode,
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator';

export const unsupportedInline = adfNode('unsupportedInline').define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	inline: true,
	selectable: true,

	attrs: {
		originalValue: { type: 'object', default: {} },
	},
});
