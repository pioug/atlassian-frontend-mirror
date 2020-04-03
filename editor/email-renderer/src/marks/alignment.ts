import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { MarkSerializerOpts } from '../interfaces';

export const styles = `
.${createClassName('mark-alignment')}-right,
.${createClassName('mark-alignment')}-end {
  width: 100%;
  text-align: right
}
.${createClassName('mark-alignment')}-center {
  width: 100%;
  text-align: center
}
`;

export default function alignment({ mark, text }: MarkSerializerOpts) {
  return createTag(
    'div',
    { class: createClassName(`mark-alignment-${mark.attrs.align}`) },
    text,
  );
}
