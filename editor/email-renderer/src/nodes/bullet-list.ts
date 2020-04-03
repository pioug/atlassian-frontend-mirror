import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { NodeSerializerOpts } from '../interfaces';

export const styles = `
.${createClassName('ul')} {
  margin-top: 12px;
  margin-bottom: 12px;
}
.${createClassName('li')} > .${createClassName('ul')} {
  margin-top: 0px;
  margin-bottom: 0px;
}
.${createClassName('ul')} > .${createClassName('li')} > .${createClassName(
  'ul',
)} > .${createClassName('li')} > .${createClassName('ul')} > .${createClassName(
  'li',
)} > .${createClassName('ul')} {
  list-style-type: disc;
}
.${createClassName('ul')} > .${createClassName('li')} > .${createClassName(
  'ul',
)} > .${createClassName('li')} > .${createClassName('ul')} > .${createClassName(
  'li',
)} > .${createClassName('ul')} > .${createClassName('li')} > .${createClassName(
  'ul',
)} {
  list-style-type: circle;
}
.${createClassName('ul')} > .${createClassName('li')} > .${createClassName(
  'ul',
)} > .${createClassName('li')} > .${createClassName('ul')} > .${createClassName(
  'li',
)} > .${createClassName('ul')} > .${createClassName('li')} > .${createClassName(
  'ul',
)} > .${createClassName('li')} > .${createClassName('ul')} {
  list-style-type: square;
}
`;

export default function bulletList({ text }: NodeSerializerOpts) {
  return createTag('ul', { class: createClassName('ul') }, text);
}
