import type { ADFNode } from '@atlaskit/adf-schema-generator/adfNode';
import { adfNode } from '@atlaskit/adf-schema-generator/adfNode';
import {
	ValidatorSpecTransformerName,
	JSONSchemaTransformerName,
} from '@atlaskit/adf-schema-generator/transformerNames';
import type { ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator/types/ADFNodeSpec';

export const confluenceUnsupportedBlock: ADFNode<[string], ADFCommonNodeSpec> = adfNode(
	'confluenceUnsupportedBlock',
).define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	attrs: {
		cxhtml: { type: 'string', default: null },
	},
});
