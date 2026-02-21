import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import {
	adfNode,
	JSONSchemaTransformerName,
	ValidatorSpecTransformerName,
} from '@atlaskit/adf-schema-generator';

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
