import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { serializeStyle } from '../serialize-style';

export default function mediaGroup({ text }: NodeSerializerOpts) {
  const style = serializeStyle({
    width: '100%',
  });

  return createTag('div', { style }, text);
}
