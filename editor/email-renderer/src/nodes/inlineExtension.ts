import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { N30, N50, N800 } from '@atlaskit/adf-schema';
import { createClassName } from '../styles/util';

const className = createClassName('inlineExtension');

export const styles = `
.${className}-inner {
  background-color: ${N30};
  border: 3px solid ${N30};
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  color: ${N800},
}
.${className}-outer {
  border: 1px solid ${N50};
  border-style: dashed;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  display: inline-block;
}
`;

export default function inlineExtension({ attrs }: NodeSerializerOpts) {
  const inner = createTag(
    'span',
    { class: className + '-inner' },
    `&nbsp;${attrs.extensionKey}&nbsp;`,
  );
  return createTag('span', { class: className + '-outer' }, inner);
}
