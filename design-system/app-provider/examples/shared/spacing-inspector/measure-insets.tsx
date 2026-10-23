import { type Rectangle } from './measure-gaps';
import { indexSpacingStyles, resolveSpacingToken } from './resolve-spacing-token';

export type InsetBand = Rectangle & { id: string; token: string; size: number; extra: number };

/**
 * Four non-overlapping bands inside the border, leaving the content box clear.
 */
export function insetRectangles(bounds: Rectangle, size: number): Rectangle[] {
	if (size <= 0 || bounds.width < size * 2 || bounds.height < size * 2) {
		return [];
	}
	return [
		{ ...bounds, height: size },
		{ ...bounds, y: bounds.y + bounds.height - size, height: size },
		{ x: bounds.x, y: bounds.y + size, width: size, height: bounds.height - size * 2 },
		{
			x: bounds.x + bounds.width - size,
			y: bounds.y + size,
			width: size,
			height: bounds.height - size * 2,
		},
	].filter((rect) => rect.width > 0 && rect.height > 0);
}

export function measureInsets(root: HTMLElement): InsetBand[] {
	const origin = root.getBoundingClientRect();
	const index = indexSpacingStyles(root.ownerDocument);
	const bands: InsetBand[] = [];
	for (const [containerIndex, node] of Array.from(root.querySelectorAll('*')).entries()) {
		if (!(node instanceof HTMLElement)) {
			continue;
		}
		const style = getComputedStyle(node);
		const rect = node.getBoundingClientRect();
		if (
			!rect.width ||
			!rect.height ||
			style.visibility !== 'visible' ||
			style.writingMode !== 'horizontal-tb' ||
			style.transform !== 'none'
		) {
			continue;
		}
		const properties = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'] as const;
		const sizes = properties.map((property) => {
			const value = style.getPropertyValue(property);
			return value.endsWith('px') ? parseFloat(value) : NaN;
		});
		const size = sizes[0];
		if (
			!(size > 0) ||
			sizes.some((value) => !Number.isFinite(value) || Math.abs(value - size) > 0.01)
		) {
			continue;
		}
		const tokens = properties.map((property) => resolveSpacingToken(node, property, index));
		const token = tokens[0];
		// Equal pixel values alone are not evidence of an inset token.
		if (!token?.startsWith('space.inset.') || tokens.some((value) => value !== token)) {
			continue;
		}
		const bounds = {
			x: rect.left - origin.left + parseFloat(style.borderLeftWidth),
			y: rect.top - origin.top + parseFloat(style.borderTopWidth),
			width: rect.width - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth),
			height: rect.height - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth),
		};
		bands.push(
			...insetRectangles(bounds, size).map((band, i) => ({
				...band,
				id: `${containerIndex}-${i}`,
				token,
				size,
				extra: 0,
			})),
		);
	}
	return bands;
}
