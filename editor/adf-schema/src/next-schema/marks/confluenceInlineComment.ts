import type { ADFMark, ADFMarkSpec } from '@atlaskit/adf-schema-generator';
import {
	JSONSchemaTransformerName,
	adfMark,
	MarkExcludesNone,
} from '@atlaskit/adf-schema-generator';

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
