import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { NodeSerializerOpts } from '../interfaces';

export const styles = `
.${createClassName('li')} {
  margin-top: 4px;
}
.${createClassName('li')} > p {
  margin-bottom: 0px;
  padding-top: 0px;
}
`;

export default function listItem({ text }: NodeSerializerOpts) {
  return createTag('li', { class: createClassName('li') }, text);
}
