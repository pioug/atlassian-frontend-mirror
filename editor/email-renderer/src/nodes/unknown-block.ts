import { applyMarks } from '../apply-marks';
import type { NodeSerializerOpts } from '../interfaces';

export default function unknownBlock({
  marks,
  text,
  context,
}: NodeSerializerOpts) {
  return applyMarks(marks, text!, context);
}
