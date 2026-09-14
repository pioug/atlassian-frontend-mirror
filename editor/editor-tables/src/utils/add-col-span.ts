import type { CellAttributesWithColSpan } from '../types';
import { assertColspan } from './assert-colspan';

// TODO: ED-26961 - replace "addColSpan" from table plugin with this function
export function addColSpan<T extends CellAttributesWithColSpan>(attrs: T, pos: number, n = 1): T {
	assertColspan(attrs);

	const result = { ...attrs, colspan: attrs.colspan + n };
	if (result.colwidth) {
		result.colwidth = result.colwidth.slice();
		for (let i = 0; i < n; i++) {
			result.colwidth.splice(pos, 0, 0);
		}
	}

	return result;
}
