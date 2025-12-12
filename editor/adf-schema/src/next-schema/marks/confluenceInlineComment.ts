import {
	JSONSchemaTransformerName,
	adfMark,
	MarkExcludesNone,
} from '@atlaskit/adf-schema-generator';

export const confluenceInlineComment = adfMark('confluenceInlineComment').define({
	ignore: [JSONSchemaTransformerName],
	inclusive: false,
	excludes: MarkExcludesNone,
	attrs: {
		reference: { type: 'string', default: '' },
	},
});
