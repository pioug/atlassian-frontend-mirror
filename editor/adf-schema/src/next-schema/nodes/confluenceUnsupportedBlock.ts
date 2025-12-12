import {
	adfNode,
	ValidatorSpecTransformerName,
	JSONSchemaTransformerName,
} from '@atlaskit/adf-schema-generator';

export const confluenceUnsupportedBlock = adfNode('confluenceUnsupportedBlock').define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	attrs: {
		cxhtml: { type: 'string', default: null },
	},
});
