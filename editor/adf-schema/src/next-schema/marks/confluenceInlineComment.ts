import type { ADFMark } from '@atlaskit/adf-schema-generator/adfMark';
import { adfMark } from '@atlaskit/adf-schema-generator/adfMark';
import { JSONSchemaTransformerName } from '@atlaskit/adf-schema-generator/transformerNames';
import type { ADFMarkSpec } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';
import { MarkExcludesNone } from '@atlaskit/adf-schema-generator/types/ADFMarkSpec';

export const confluenceInlineComment: ADFMark<ADFMarkSpec> = adfMark(
	'confluenceInlineComment',
).define({
	ignore: [JSONSchemaTransformerName],
	inclusive: false,
	excludes: MarkExcludesNone,
	attrs: {
		reference: { type: 'string', default: '' },
	},
});
