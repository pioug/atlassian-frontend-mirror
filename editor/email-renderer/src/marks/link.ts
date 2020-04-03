import { MarkSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';

export const styles = `
.${createClassName('mark-link')} {
  border: none;
  background: transparent;
  color: #0052cc;
  text-decoration: none;
}
`;
export default function link({ mark, text }: MarkSerializerOpts) {
  const { href, title } = mark.attrs;

  return createTag(
    'a',
    {
      href,
      title,
      class: createClassName('mark-link'),
    },
    text,
  );
}
