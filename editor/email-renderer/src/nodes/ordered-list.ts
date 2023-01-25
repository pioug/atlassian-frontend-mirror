import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { NodeSerializerOpts } from '../interfaces';

export const styles = `
.${createClassName('ol')} {
  margin-top: 12px;
  margin-bottom: 12px;
}
.${createClassName('li')} > .${createClassName('ol')} {
  margin-top: 0px;
  margin-bottom: 0px;
}
.${createClassName('ol')} > .${createClassName('li')} > .${createClassName(
  'ol',
)} {
  list-style-type: lower-alpha;
}
.${createClassName('ol')} > .${createClassName('li')} > .${createClassName(
  'ol',
)} > .${createClassName('li')} > .${createClassName('ol')} {
  list-style-type: lower-roman;
}
.${createClassName('ol')} > .${createClassName('li')} > .${createClassName(
  'ol',
)} > .${createClassName('li')} > .${createClassName('ol')} > .${createClassName(
  'li',
)} > .${createClassName('ol')} {
  list-style-type: decimal;
}
.${createClassName('ol')} > .${createClassName('li')} > .${createClassName(
  'ol',
)} > .${createClassName('li')} > .${createClassName('ol')} > .${createClassName(
  'li',
)} > .${createClassName('ol')} > .${createClassName('li')} > .${createClassName(
  'ol',
)} {
  list-style-type: lower-alpha
}
.${createClassName('ol')} > .${createClassName('li')} > .${createClassName(
  'ol',
)} > .${createClassName('li')} > .${createClassName('ol')} > .${createClassName(
  'li',
)} > .${createClassName('ol')} > .${createClassName('li')} > .${createClassName(
  'ol',
)} > .${createClassName('li')} > .${createClassName('ol')} {
  list-style-type: lower-roman;
}
`;

export default function orderedList({ text, attrs }: NodeSerializerOpts) {
  const tagAttrs: { class: string; start?: number } = {
    class: createClassName('ol'),
  };

  //check if order exist and if it is a positive integer
  if (Number.isInteger(attrs?.order) && attrs?.order >= 0) {
    tagAttrs.start = attrs.order;
  }
  return createTag('ol', tagAttrs, text);
}
