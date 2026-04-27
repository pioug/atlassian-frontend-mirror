/* eslint-disable @atlaskit/platform/no-direct-document-usage -- draft selection uses document range APIs */
import type { Position } from '../types';

export const dataAttributes = ({ from, to }: Position): {
    "data-annotation-draft-mark": boolean;
    "data-draft-end-at": number;
    "data-draft-start-at": number;
} => {
	return {
		['data-annotation-draft-mark']: true,
		['data-draft-start-at']: from,
		['data-draft-end-at']: to,
	};
};

const buildDataAttributesQuery = (pos: Position) => {
	const a = dataAttributes(pos);

	return Object.entries(a)
		.map(([k, v]) => `[${k}="${v}"]`)
		.join('');
};

export const updateWindowSelectionAroundDraft = (pos: Position): boolean => {
	const sel = window.getSelection();

	if (!sel) {
		return false;
	}

	const draftNodes = document.querySelectorAll(buildDataAttributesQuery(pos));
	if (!draftNodes || draftNodes.length === 0) {
		return false;
	}

	sel.removeAllRanges();

	const range = document.createRange();
	range.setStart(draftNodes[0], 0);
	range.setEndAfter(draftNodes[draftNodes.length - 1]);
	sel.addRange(range);
	return true;
};
