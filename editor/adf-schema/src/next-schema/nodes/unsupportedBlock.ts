import type {
    ADFCommonNodeSpec,
    ADFNode} from '@atlaskit/adf-schema-generator';
import {
	adfNode,
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator';

export const unsupportedBlock: ADFNode<[string], ADFCommonNodeSpec> = adfNode('unsupportedBlock').define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	atom: true,
	selectable: true,

	attrs: {
		originalValue: { type: 'object', default: {} },
	},
});
