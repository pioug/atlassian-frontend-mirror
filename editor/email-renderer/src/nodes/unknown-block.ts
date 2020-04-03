import { applyMarks } from '../apply-marks';
import { NodeSerializerOpts } from '../interfaces';

export default function unknownBlock({ marks, text }: NodeSerializerOpts) {
  return applyMarks(marks, text!);
}
