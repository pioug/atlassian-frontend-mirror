import type { ADFNode } from '@atlaskit/adf-schema-generator/adfNode';
import { adfNode } from '@atlaskit/adf-schema-generator/adfNode';
import {
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator/transformerNames';
import type { ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator/types/ADFNodeSpec';

export const unsupportedInline: ADFNode<[string], ADFCommonNodeSpec> = adfNode(
	'unsupportedInline',
).define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	inline: true,
	selectable: true,

	attrs: {
		originalValue: { type: 'object', default: {} },
	},
});
