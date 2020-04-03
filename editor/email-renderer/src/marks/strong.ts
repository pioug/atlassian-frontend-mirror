import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { MarkSerializerOpts } from '../interfaces';

export const styles = `
.${createClassName('mark-strong')} {
  font-weight: bold;
}
`;

export default function strong({ text }: MarkSerializerOpts) {
  return createTag('span', { class: createClassName('mark-strong') }, text);
}
