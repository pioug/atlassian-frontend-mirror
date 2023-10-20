import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import type { NodeSerializerOpts } from '../interfaces';
import { N500 } from '@atlaskit/adf-schema';

export const styles = `
.${createClassName('mention')} {
  background: #EFEFF2;
  border: 1px solid transparent;
  border-radius: 20px;
  color: ${N500};
  padding: 0 4px 2px 3px;
  white-space: nowrap;
}

.${createClassName('mention-highlighted')} {
  background: #0052CC;
  border: 1px solid transparent;
  border-radius: 20px;
  color: #F4F5F7;
  padding: 0 4px 2px 3px;
  white-space: nowrap;
}
`;

const ishighlightedMentionNode = (node: NodeSerializerOpts) => {
  const highlightedMentionNodeID = node.context?.highlightedMentionNodeID;
  return highlightedMentionNodeID && highlightedMentionNodeID === node.attrs.id;
};

const resolveMention = (node: NodeSerializerOpts) => {
  if (['all', 'here'].includes(node.attrs.id)) {
    return '@' + node.attrs.id;
  }
  return node.text || '@unknown';
};

export default function mention(node: NodeSerializerOpts) {
  const className = ishighlightedMentionNode(node)
    ? createClassName('mention-highlighted')
    : createClassName('mention');

  return createTag(
    'span',
    { class: className, 'data-user-id': node.attrs.id },
    resolveMention(node),
  );
}
