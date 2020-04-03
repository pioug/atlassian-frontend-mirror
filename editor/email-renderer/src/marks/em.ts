import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { MarkSerializerOpts } from '../interfaces';

export const styles = `
.${createClassName('mark-em')} {
  font-style: italic;
}
`;

export default function em({ text }: MarkSerializerOpts) {
  return createTag('span', { class: createClassName('mark-em') }, text);
}
