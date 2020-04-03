import { NodeSerializerOpts } from '../interfaces';

export default function emoji({ attrs }: NodeSerializerOpts) {
  return attrs.text || attrs.shortName;
}
