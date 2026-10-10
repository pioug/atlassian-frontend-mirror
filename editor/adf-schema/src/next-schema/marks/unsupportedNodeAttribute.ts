import type { ADFMark } from '@atlaskit/adf-schema-generator/adfMark';
import { adfMark } from '@atlaskit/adf-schema-generator/adfMark';
import {
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator/transformerNames';
import type { ADFMarkSpec } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';

export const unsupportedNodeAttribute: ADFMark<ADFMarkSpec> = adfMark(
	'unsupportedNodeAttribute',
).define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	attrs: {
		unsupported: { type: 'object' },
		type: { type: 'string' },
	},
});
