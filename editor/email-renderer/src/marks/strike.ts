import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { MarkSerializerOpts } from '../interfaces';

export const styles = `
.${createClassName('mark-strike')} {
  text-decoration: line-through;
}
`;
export default function strike({ text }: MarkSerializerOpts) {
  return createTag('span', { class: createClassName('mark-strike') }, text);
}
