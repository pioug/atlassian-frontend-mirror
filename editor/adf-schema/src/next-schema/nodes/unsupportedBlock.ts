import {
	adfNode,
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator';

export const unsupportedBlock = adfNode('unsupportedBlock').define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	atom: true,
	selectable: true,

	attrs: {
		originalValue: { type: 'object', default: {} },
	},
});
