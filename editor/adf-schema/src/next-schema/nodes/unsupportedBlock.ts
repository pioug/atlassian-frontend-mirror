import type { ADFNode } from '@atlaskit/adf-schema-generator/adfNode';
import { adfNode } from '@atlaskit/adf-schema-generator/adfNode';
import {
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator/transformerNames';
import type { ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator/types/ADFNodeSpec';

export const unsupportedBlock: ADFNode<[string], ADFCommonNodeSpec> = adfNode(
	'unsupportedBlock',
).define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	atom: true,
	selectable: true,

	attrs: {
		originalValue: { type: 'object', default: {} },
	},
});
