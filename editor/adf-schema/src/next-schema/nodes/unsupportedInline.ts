import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import {
	adfNode,
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator';

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
