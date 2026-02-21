import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import {
	ValidatorSpecTransformerName,
	JSONSchemaTransformerName,
	adfMark,
} from '@atlaskit/adf-schema-generator';

export const typeAheadQuery: ADFMark<ADFMarkSpec> = adfMark('typeAheadQuery').define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],
	inclusive: true,
	attrs: {
		trigger: { type: 'string', default: '' },
	},
});
