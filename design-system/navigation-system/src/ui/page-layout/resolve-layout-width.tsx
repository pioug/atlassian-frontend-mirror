import type { LayoutWidthBound } from './layout-area-sizing-context';

export function resolveLayoutWidth(bound: LayoutWidthBound, viewportWidth: number): number {
	if (typeof bound === 'number') {
		return bound;
	}

	const value = Number.parseFloat(bound);
	return bound.endsWith('vw') ? (viewportWidth * value) / 100 : value;
}
