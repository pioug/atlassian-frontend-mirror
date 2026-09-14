import type { CellAttributes } from '../types';

export function assertColspan(attrs: CellAttributes): void {
	if (typeof attrs.colspan === 'undefined') {
		throw new Error('addColSpan: attrs.colspan is not defined');
	}

	if (typeof attrs.colspan !== 'number' || Number.isNaN(attrs.colspan) || attrs.colspan < 1) {
		throw new Error(`addColSpan: attrs.colspan must be number >= 1, received: ${attrs.colspan}`);
	}
}
