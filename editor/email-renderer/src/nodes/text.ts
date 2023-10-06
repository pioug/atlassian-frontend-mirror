import { applyMarks } from '../apply-marks';
import type { NodeSerializerOpts } from '../interfaces';

export default function text({ marks, text, context }: NodeSerializerOpts) {
  return applyMarks(marks, text!, context);
}
