import {
	adfMark,
	JSONSchemaTransformerName,
	MarkExcludesNone,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator';

export const unsupportedMark = adfMark('unsupportedMark').define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],
	excludes: MarkExcludesNone,
	allowExcludesEmpty: true,
	attrs: {
		originalValue: { type: 'object' },
	},
});
