import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { MarkSerializerOpts } from '../interfaces';

export const styles = `
.${createClassName('mark-underline')} {
  text-decoration: underline;
}
`;

export default function strong({ text }: MarkSerializerOpts) {
  return createTag('span', { class: createClassName('mark-underline') }, text);
}
