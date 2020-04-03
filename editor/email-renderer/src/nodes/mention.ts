import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { NodeSerializerOpts } from '../interfaces';
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
`;

const resolveMention = (node: NodeSerializerOpts) => {
  if (['all', 'here'].includes(node.attrs.id)) {
    return '@' + node.attrs.id;
  }
  return node.text || '@unknown';
};

export default function mention(node: NodeSerializerOpts) {
  return createTag(
    'span',
    { class: createClassName('mention'), 'data-user-id': node.attrs.id },
    resolveMention(node),
  );
}
