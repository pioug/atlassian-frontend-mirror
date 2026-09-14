import type { CellAttributes } from '../types';

export function removeColSpan(attrs: CellAttributes, pos: number, n = 1): CellAttributes {
	if (!attrs.colspan) {
		throw new Error('removeColSpan(): attrs.colspan not defined');
	}

	const result = { ...attrs, colspan: attrs.colspan - n };

	if (result.colwidth) {
		result.colwidth = result.colwidth.slice();
		result.colwidth.splice(pos, n);
		if (!result.colwidth.some((w: number) => w > 0)) {
			result.colwidth = undefined;
		}
	}

	return result;
}
