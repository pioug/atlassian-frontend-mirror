import { indexSpacingStyles, resolveSpacingToken } from './resolve-spacing-token';

export type Rectangle = { x: number; y: number; width: number; height: number };
export type GapBand = Rectangle & { id: string; token: string | null; size: number; extra: number };

type Axis = 'x' | 'y';
type MeasuredBand = Rectangle & { axis: Axis; size: number; extra: number };
const start = (rect: Rectangle, axis: Axis) => rect[axis];
const length = (rect: Rectangle, axis: Axis) => (axis === 'x' ? rect.width : rect.height);
const end = (rect: Rectangle, axis: Axis) => start(rect, axis) + length(rect, axis);

/**
 * A spanning grid item covers its internal gutters. Never paint a gap over that content.
 */
export function uncoveredRectangles(band: Rectangle, occupied: Rectangle[]): Rectangle[] {
	return occupied.reduce<Rectangle[]>(
		(parts, item) =>
			parts.flatMap((part) => {
				const left = Math.max(part.x, item.x);
				const top = Math.max(part.y, item.y);
				const right = Math.min(part.x + part.width, item.x + item.width);
				const bottom = Math.min(part.y + part.height, item.y + item.height);
				if (right <= left || bottom <= top) {
					return [part];
				}
				return [
					{ x: part.x, y: part.y, width: part.width, height: top - part.y },
					{ x: part.x, y: bottom, width: part.width, height: part.y + part.height - bottom },
					{ x: part.x, y: top, width: left - part.x, height: bottom - top },
					{ x: right, y: top, width: part.x + part.width - right, height: bottom - top },
				].filter((rect) => rect.width > 0 && rect.height > 0);
			}),
		[band],
	);
}

/**
 * Group wrapped flex items by overlap on the cross axis, including items with different heights.
 */
export function flexGapRectangles(
	children: Rectangle[],
	axis: Axis,
	mainGap: number,
	crossGap: number,
): MeasuredBand[] {
	const cross: Axis = axis === 'x' ? 'y' : 'x';
	const lines: { low: number; high: number; children: Rectangle[] }[] = [];
	for (const child of [...children].sort((a, b) => start(a, cross) - start(b, cross))) {
		const line = lines.find(
			(line) => start(child, cross) < line.high - 0.5 && end(child, cross) > line.low + 0.5,
		);
		if (line) {
			line.low = Math.min(line.low, start(child, cross));
			line.high = Math.max(line.high, end(child, cross));
			line.children.push(child);
		} else {
			lines.push({ low: start(child, cross), high: end(child, cross), children: [child] });
		}
	}
	const bands: MeasuredBand[] = [];
	const append = (
		axis: Axis,
		low: number,
		high: number,
		crossLow: number,
		crossHigh: number,
		size: number,
	) => {
		if (size <= 0 || high - low < size - 0.75 || crossHigh <= crossLow) {
			return;
		}
		const extra = Math.max(0, high - low - size);
		const position = low + extra / 2;
		bands.push({
			x: axis === 'x' ? position : crossLow,
			y: axis === 'y' ? position : crossLow,
			width: axis === 'x' ? size : crossHigh - crossLow,
			height: axis === 'y' ? size : crossHigh - crossLow,
			axis,
			size,
			extra,
		});
	};
	for (const line of lines) {
		const items = line.children.sort((a, b) => start(a, axis) - start(b, axis));
		for (let i = 1; i < items.length; i++) {
			append(axis, end(items[i - 1], axis), start(items[i], axis), line.low, line.high, mainGap);
		}
	}
	for (let i = 1; i < lines.length; i++) {
		append(
			cross,
			lines[i - 1].high,
			lines[i].low,
			Math.min(...children.map((child) => start(child, axis))),
			Math.max(...children.map((child) => end(child, axis))),
			crossGap,
		);
	}
	return bands;
}

function tracks(value: string): number[] | null {
	const parts = value
		.replace(/\[[^\]]*\]/g, '')
		.trim()
		.split(/\s+/);
	return parts.every((part) => /^\d+(?:\.\d+)?px$/.test(part))
		? parts.map(parseFloat).filter((size) => size > 0.5)
		: null;
}

/**
 * Use resolved grid tracks so short items and items spanning tracks do not create false gutters.
 */
export function gridGapRectangles(
	bounds: Rectangle,
	columns: number[],
	rows: number[],
	columnGap: number,
	rowGap: number,
): MeasuredBand[] {
	const bands: MeasuredBand[] = [];
	let x = bounds.x;
	for (const width of columns.slice(0, -1)) {
		x += width;
		if (columnGap > 0) {
			bands.push({
				x,
				y: bounds.y,
				width: columnGap,
				height: bounds.height,
				axis: 'x',
				size: columnGap,
				extra: 0,
			});
		}
		x += columnGap;
	}
	let y = bounds.y;
	for (const height of rows.slice(0, -1)) {
		y += height;
		if (rowGap > 0) {
			bands.push({
				x: bounds.x,
				y,
				width: bounds.width,
				height: rowGap,
				axis: 'y',
				size: rowGap,
				extra: 0,
			});
		}
		y += rowGap;
	}
	return bands;
}

export function measureGaps(root: HTMLElement): {
	width: number;
	height: number;
	bands: GapBand[];
} {
	const origin = root.getBoundingClientRect();
	const index = indexSpacingStyles(root.ownerDocument);
	const bands: GapBand[] = [];
	for (const [containerIndex, node] of Array.from(
		root.querySelectorAll<HTMLElement>('*'),
	).entries()) {
		if (!(node instanceof HTMLElement)) {
			continue;
		}
		const style = getComputedStyle(node);
		if (
			!['flex', 'inline-flex', 'grid', 'inline-grid'].includes(style.display) ||
			style.visibility !== 'visible' ||
			style.writingMode !== 'horizontal-tb' ||
			style.transform !== 'none'
		) {
			continue;
		}
		// Percentages can remain unresolved in computed styles. They are not pixel measurements.
		const pixels = (value: string) =>
			value === 'normal' ? 0 : value.endsWith('px') ? parseFloat(value) : NaN;
		const rowGap = pixels(style.rowGap);
		const columnGap = pixels(style.columnGap);
		if (!Number.isFinite(rowGap) || !Number.isFinite(columnGap)) {
			continue;
		}
		if (!rowGap && !columnGap) {
			continue;
		}
		const rowToken = resolveSpacingToken(node, 'row-gap', index);
		const columnToken = resolveSpacingToken(node, 'column-gap', index);
		let rectangles: ReturnType<typeof flexGapRectangles> = [];
		if (style.display.includes('grid')) {
			const columns = tracks(style.gridTemplateColumns);
			const rows = tracks(style.gridTemplateRows);
			if (
				!columns ||
				!rows ||
				!['normal', 'start', 'stretch'].includes(style.justifyContent) ||
				!['normal', 'start', 'stretch'].includes(style.alignContent)
			) {
				continue;
			}
			const rect = node.getBoundingClientRect();
			const content: Rectangle = {
				x:
					rect.left -
					origin.left +
					parseFloat(style.borderLeftWidth) +
					parseFloat(style.paddingLeft),
				y: rect.top - origin.top + parseFloat(style.borderTopWidth) + parseFloat(style.paddingTop),
				width: columns.reduce((sum, width) => sum + width, 0) + columnGap * (columns.length - 1),
				height: rows.reduce((sum, height) => sum + height, 0) + rowGap * (rows.length - 1),
			};
			rectangles = gridGapRectangles(content, columns, rows, columnGap, rowGap);
			if (style.direction === 'rtl') {
				rectangles = rectangles.map((rect) => ({
					...rect,
					x: content.x + content.width - (rect.x - content.x) - rect.width,
				}));
			}
			const occupied = Array.from(node.children)
				.filter((child) => getComputedStyle(child).display !== 'none')
				.map((child) => {
					const rect = child.getBoundingClientRect();
					return {
						x: rect.left - origin.left,
						y: rect.top - origin.top,
						width: rect.width,
						height: rect.height,
					};
				});
			rectangles = rectangles.flatMap((band) =>
				uncoveredRectangles(band, occupied).map((rect) => ({ ...band, ...rect })),
			);
		} else {
			const children: Rectangle[] = [];
			const collect = (parent: Element) => {
				for (const child of Array.from(parent.children)) {
					const childStyle = getComputedStyle(child);
					if (childStyle.display === 'contents') {
						collect(child);
						continue;
					}
					const rect = child.getBoundingClientRect();
					if (
						childStyle.display === 'none' ||
						['absolute', 'fixed'].includes(childStyle.position) ||
						!rect.width ||
						!rect.height
					) {
						continue;
					}
					children.push({
						x: rect.left - origin.left - parseFloat(childStyle.marginLeft),
						y: rect.top - origin.top - parseFloat(childStyle.marginTop),
						width:
							rect.width + parseFloat(childStyle.marginLeft) + parseFloat(childStyle.marginRight),
						height:
							rect.height + parseFloat(childStyle.marginTop) + parseFloat(childStyle.marginBottom),
					});
				}
			};
			collect(node);
			const axis = style.flexDirection.startsWith('column') ? 'y' : 'x';
			rectangles = flexGapRectangles(
				children,
				axis,
				axis === 'x' ? columnGap : rowGap,
				axis === 'x' ? rowGap : columnGap,
			);
		}
		bands.push(
			...rectangles.map((rect, i) => ({
				...rect,
				token: rect.axis === 'y' ? rowToken : columnToken,
				id: `${containerIndex}-${i}`,
			})),
		);
	}
	return { width: origin.width, height: origin.height, bands };
}
