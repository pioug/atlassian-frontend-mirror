import {
	adfNode,
	ValidatorSpecTransformerName,
	JSONSchemaTransformerName,
} from '@atlaskit/adf-schema-generator';

export const confluenceUnsupportedInline = adfNode('confluenceUnsupportedInline').define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	atom: true,
	inline: true,

	attrs: {
		cxhtml: { type: 'string', default: null },
	},
});
