import {
	adfMark,
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator';

export const unsupportedNodeAttribute = adfMark('unsupportedNodeAttribute').define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	attrs: {
		unsupported: { type: 'object' },
		type: { type: 'string' },
	},
});
