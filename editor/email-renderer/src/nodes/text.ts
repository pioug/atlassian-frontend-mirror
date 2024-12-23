import { applyMarks } from '../apply-marks';
import type { NodeSerializerOpts } from '../interfaces';

export default function text({ marks, text, context }: NodeSerializerOpts) {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return applyMarks(marks, text!, context);
}
