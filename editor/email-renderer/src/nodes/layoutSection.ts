import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';

export default function layoutSection({ text }: NodeSerializerOpts) {
  return createTag('div', {}, text);
}
