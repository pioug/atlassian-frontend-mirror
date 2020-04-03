import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { N30, N50, N800 } from '@atlaskit/adf-schema';
import { createClassName } from '../styles/util';

const className = createClassName('bodiedExtension');

export const styles = `
.${className}-inner {
  background-color: ${N30};
  border: 10px solid ${N30};
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  color: ${N800},
}
.${className}-outer {
  border: 1px solid ${N50};
  margin-top: 10px;
  border-radius: 3px;
  border-style: dashed;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
}
`;

export default function bodiedExtension({ attrs }: NodeSerializerOpts) {
  const inner = createTag(
    'div',
    { class: className + '-inner' },
    `&nbsp;${attrs.extensionKey}&nbsp;`,
  );
  return createTag('div', { class: className + '-outer' }, inner);
}
