import type { ADFMark } from '@atlaskit/adf-schema-generator/adfMark';
import { adfMark } from '@atlaskit/adf-schema-generator/adfMark';
import {
	ValidatorSpecTransformerName,
	JSONSchemaTransformerName,
} from '@atlaskit/adf-schema-generator/transformerNames';
import type { ADFMarkSpec } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';

export const typeAheadQuery: ADFMark<ADFMarkSpec> = adfMark('typeAheadQuery').define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],
	inclusive: true,
	attrs: {
		trigger: { type: 'string', default: '' },
	},
});
