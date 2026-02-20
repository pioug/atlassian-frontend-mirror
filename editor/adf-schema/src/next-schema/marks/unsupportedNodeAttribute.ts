import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import {
	adfMark,
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator';

export const unsupportedNodeAttribute: ADFMark<ADFMarkSpec> = adfMark(
	'unsupportedNodeAttribute',
).define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	attrs: {
		unsupported: { type: 'object' },
		type: { type: 'string' },
	},
});
