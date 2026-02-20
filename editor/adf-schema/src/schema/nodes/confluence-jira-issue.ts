import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import { confluenceJiraIssue as confluenceJiraIssueFactory } from '../../next-schema/generated/nodeTypes';

const name = 'confluenceJiraIssue';

export const confluenceJiraIssue: NodeSpec = confluenceJiraIssueFactory({
	parseDOM: [
		{
			tag: `span[data-node-type="${name}"]`,
			getAttrs: (domNode) => {
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const dom = domNode as HTMLElement;
				return {
					issueKey: dom.textContent,
					macroId: dom.dataset && dom.dataset.macroId,
					schemaVersion: dom.dataset && dom.dataset.schemaVersion,
					server: dom.dataset && dom.dataset.server,
					serverId: dom.dataset && dom.dataset.serverId,
				};
			},
		},
	],
	toDOM(node) {
		const attrs = {
			'data-node-type': name,
			'data-macro-id': node.attrs.macroId,
			'data-schema-version': node.attrs.schemaVersion,
			'data-server': node.attrs.server,
			'data-server-id': node.attrs.serverId,
			'data-jira-issue': node.attrs.issueKey,
		};

		return ['span', attrs, node.attrs.issueKey];
	},
});
