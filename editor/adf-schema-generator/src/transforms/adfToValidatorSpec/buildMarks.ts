import type { ADFMark } from '../../adfMark';
import type { ADFMarkSpec } from '../../types/ADFMarkSpec';
import { ValidatorSpecTransformerName } from '../transformerNames';
import type { ValidatorSpecNodeMarks } from './ValidatorSpec';

export function buildMarks(
	marks: Array<ADFMark<ADFMarkSpec>>,
	noMarks = false,
	hasEmptyMarks = false,
): ValidatorSpecNodeMarks {
	if (noMarks) {
		return { type: 'array', maxItems: 0, items: [], optional: true };
	}
	if (hasEmptyMarks) {
		return {
			type: 'array',
			items: [],
			optional: true,
		};
	}

	const filteredMarks = filterIgnoredMarks(marks);
	if (!filteredMarks || filteredMarks.length === 0) {
		// @ts-expect-error
		return;
	}

	const returnMarks: ValidatorSpecNodeMarks = {
		type: 'array',
		optional: true,
		items: [],
	};
	if (filteredMarks.length > 1) {
		returnMarks.items = [filteredMarks.map((mark) => mark.getType())];
	} else {
		returnMarks.items = filteredMarks.map((mark) => mark.getType());
	}
	return returnMarks;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterIgnoredMarks(marks: Array<ADFMark<any>>) {
	return (marks ?? []).filter((mark) => !mark.isIgnored(ValidatorSpecTransformerName));
}
