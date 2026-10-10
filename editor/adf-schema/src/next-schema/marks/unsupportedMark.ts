import type { ADFMark } from '@atlaskit/adf-schema-generator/adfMark';
import { adfMark } from '@atlaskit/adf-schema-generator/adfMark';
import {
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator/transformerNames';
import type { ADFMarkSpec } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';
import { MarkExcludesNone } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';

export const unsupportedMark: ADFMark<ADFMarkSpec> = adfMark('unsupportedMark').define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],
	excludes: MarkExcludesNone,
	allowExcludesEmpty: true,
	attrs: {
		originalValue: { type: 'object' },
	},
});
