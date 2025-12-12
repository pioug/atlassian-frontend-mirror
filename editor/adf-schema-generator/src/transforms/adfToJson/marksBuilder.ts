import type { ADFMark } from '../../adfMark';
import type { ADFAttributes } from '../../types/ADFAttribute';
import type { ADFMarkSpec } from '../../types/ADFMarkSpec';
import { JSONSchemaTransformerName } from '../transformerNames';
import { buildAttrs } from './attrBuilder';
import { buildRequired } from './requiredBuilder';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildMarks(marks: ADFMark<ADFMarkSpec>[]): Record<string, any> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const res: Record<string, any> = {};
	marks.forEach((mark) => {
		if (mark.isIgnored(JSONSchemaTransformerName)) {
			return;
		}

		const attrs = buildAttrs(mark.getSpec().attrs);
		const required = buildRequired(mark.getSpec().attrs as ADFAttributes, false, '');

		res[`${mark.getType()}_mark`] = {
			json: {
				type: 'object',
				properties: {
					type: {
						enum: [mark.getType()],
					},
					...attrs,
				},
				required,
				additionalProperties: false,
			},
		};
	});
	return res;
}
