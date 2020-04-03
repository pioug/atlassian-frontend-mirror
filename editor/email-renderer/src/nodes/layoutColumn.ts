import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';

export default function layoutColumn({ text }: NodeSerializerOpts) {
  return createTag('div', {}, text);
}
