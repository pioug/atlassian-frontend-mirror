import { createTag } from '../create-tag';
import { NodeSerializerOpts } from '../interfaces';
import { N40, N300 } from '@atlaskit/adf-schema';
import { createClassName } from '../styles/util';

const className = createClassName('blockquote');
export const styles = `
.${className} {
  border-left: 2px solid ${N40};
  color: ${N300};
  margin: 12px 0 0 0;
  padding-left: 16px;
}
`;

export default function blockquote({ text }: NodeSerializerOpts) {
  return createTag('blockquote', { class: className }, text);
}
