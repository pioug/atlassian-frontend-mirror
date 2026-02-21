import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import {
	adfNode,
	ValidatorSpecTransformerName,
	JSONSchemaTransformerName,
} from '@atlaskit/adf-schema-generator';

export const confluenceUnsupportedBlock: ADFNode<[string], ADFCommonNodeSpec> = adfNode(
	'confluenceUnsupportedBlock',
).define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	attrs: {
		cxhtml: { type: 'string', default: null },
	},
});
