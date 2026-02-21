import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import {
	adfNode,
	ValidatorSpecTransformerName,
	JSONSchemaTransformerName,
} from '@atlaskit/adf-schema-generator';

export const confluenceUnsupportedInline: ADFNode<[string], ADFCommonNodeSpec> = adfNode(
	'confluenceUnsupportedInline',
).define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	atom: true,
	inline: true,

	attrs: {
		cxhtml: { type: 'string', default: null },
	},
});
