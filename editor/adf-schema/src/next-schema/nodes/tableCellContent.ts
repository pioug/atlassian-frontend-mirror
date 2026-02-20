import type { ADFCommonNodeSpec, ADFNode} from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';
import { tableCellContentPseudoGroup } from '../groups/tableCellContentPseudoGroup';

// @DSLCompatibilityException This is only used by JSON schema to group the table cell content into a definition.
// This node should be deleted and the content should be replicated in the JSON schema for table header and table cell node
export const tableCellContent: ADFNode<[string], ADFCommonNodeSpec> = adfNode('tableCellContent').define({
	ignore: ['pm-spec', 'validator-spec'],
	content: [tableCellContentPseudoGroup],
});
