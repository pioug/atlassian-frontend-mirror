import type { ADFNode } from '@atlaskit/adf-schema-generator/adfNode';
import { adfNode } from '@atlaskit/adf-schema-generator/adfNode';
import {
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator/transformerNames';
import type { ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator/types/ADFNodeSpec';

export const confluenceJiraIssue: ADFNode<[string], ADFCommonNodeSpec> = adfNode(
	'confluenceJiraIssue',
).define({
	ignore: [JSONSchemaTransformerName, ValidatorSpecTransformerName],

	atom: true,
	inline: true,

	attrs: {
		issueKey: { type: 'string', default: '' },
		macroId: { type: 'string', default: null, optional: true },
		schemaVersion: { type: 'string', default: null, optional: true },
		server: { type: 'string', default: null, optional: true },
		serverId: { type: 'string', default: null, optional: true },
	},
});
