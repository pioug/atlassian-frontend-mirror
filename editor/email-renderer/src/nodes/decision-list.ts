import { createTag } from '../create-tag';
import { NodeSerializerOpts } from '../interfaces';
import { createClassName } from '../styles/util';

const className = createClassName('decisionList');

export const styles = `
.${className} {
  margin-top: 12px;
}
`;
export default function decisionList({ text }: NodeSerializerOpts) {
  return createTag('div', { class: className }, text);
}
