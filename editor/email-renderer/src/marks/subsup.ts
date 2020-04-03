import { createTag } from '../create-tag';
import { MarkSerializerOpts } from '../interfaces';

export default function subsup({ mark, text }: MarkSerializerOpts) {
  return createTag(mark.attrs.type, {}, text);
}
