import type { ADFNode } from '@atlaskit/adf-schema-generator/adfNode';
import { adfNode } from '@atlaskit/adf-schema-generator/adfNode';
import {
	ValidatorSpecTransformerName,
	JSONSchemaTransformerName,
} from '@atlaskit/adf-schema-generator/transformerNames';
import type { ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator/types/ADFNodeSpec';

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
