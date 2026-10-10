import type { ADFNode } from '@atlaskit/adf-schema-generator/adfNode';
import { adfNode } from '@atlaskit/adf-schema-generator/adfNode';
import {
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator/transformerNames';
import type { ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator/types/ADFNodeSpec';

export const image: ADFNode<[string], ADFCommonNodeSpec> = adfNode('image').define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	inline: true,
	draggable: true,

	attrs: {
		src: { type: 'string', default: '' },
		alt: { type: 'string', default: '', optional: true },
		title: { type: 'string', default: null, optional: true },
	},
});
