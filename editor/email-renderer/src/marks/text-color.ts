import { createTag } from '../create-tag';
import { serializeStyle } from '../serialize-style';
import { MarkSerializerOpts } from '../interfaces';

export default function textColor({ mark, text }: MarkSerializerOpts) {
  const css = serializeStyle({ color: mark.attrs.color });

  return createTag('span', { style: css }, text);
}
