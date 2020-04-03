import { NodeSpec } from 'prosemirror-model';

const name = 'confluenceJiraIssue';

export const confluenceJiraIssue = {
  group: 'inline',
  inline: true,
  atom: true,
  attrs: {
    issueKey: { default: '' },
    macroId: { default: null },
    schemaVersion: { default: null },
    server: { default: null },
    serverId: { default: null },
  },
  parseDOM: [
    {
      tag: `span[data-node-type="${name}"]`,
      getAttrs: domNode => {
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
} as NodeSpec;
