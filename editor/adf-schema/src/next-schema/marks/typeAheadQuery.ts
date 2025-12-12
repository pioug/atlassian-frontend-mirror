import {
	ValidatorSpecTransformerName,
	JSONSchemaTransformerName,
	adfMark,
} from '@atlaskit/adf-schema-generator';

export const typeAheadQuery = adfMark('typeAheadQuery').define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],
	inclusive: true,
	attrs: {
		trigger: { type: 'string', default: '' },
	},
});
