import { closestElement, containsClassName } from '@atlaskit/editor-common/utils';

import { TableCssClassName as ClassName } from '../../types';

export const isCell = (node: HTMLElement | null): boolean => {
	return Boolean(
		node &&
		(['TH', 'TD'].indexOf(node.tagName) > -1 ||
			!!closestElement(node, `.${ClassName.TABLE_HEADER_CELL}`) ||
			!!closestElement(node, `.${ClassName.TABLE_CELL}`)),
	);
};

export const isCornerButton = (node: HTMLElement | null): boolean =>
	containsClassName(node, ClassName.CONTROLS_CORNER_BUTTON);

export const isInsertRowButton = (node: HTMLElement | null) =>
	containsClassName(node, ClassName.CONTROLS_INSERT_ROW) ||
	closestElement(node, `.${ClassName.CONTROLS_INSERT_ROW}`) ||
	(containsClassName(node, ClassName.CONTROLS_BUTTON_OVERLAY) &&
		closestElement(node, `.${ClassName.ROW_CONTROLS}`));

export const getColumnOrRowIndex = (target: HTMLElement): [number, number] => [
	parseInt(target.getAttribute('data-start-index') || '-1', 10),
	parseInt(target.getAttribute('data-end-index') || '-1', 10),
];

export const isColumnControlsDecorations = (node: HTMLElement | null): boolean =>
	containsClassName(node, ClassName.COLUMN_CONTROLS_DECORATIONS);

export const isRowControlsButton = (node: HTMLElement | null): boolean =>
	containsClassName(node, ClassName.ROW_CONTROLS_BUTTON) ||
	containsClassName(node, ClassName.NUMBERED_COLUMN_BUTTON);

export const isResizeHandleDecoration = (node: HTMLElement | null): boolean =>
	containsClassName(node, ClassName.RESIZE_HANDLE_DECORATION);

export const isTableControlsButton = (node: HTMLElement | null): boolean =>
	containsClassName(node, ClassName.CONTROLS_BUTTON) ||
	containsClassName(node, ClassName.ROW_CONTROLS_BUTTON_WRAP);

export const isTableContainerOrWrapper = (node: HTMLElement | null): boolean =>
	containsClassName(node, ClassName.TABLE_CONTAINER) ||
	containsClassName(node, ClassName.TABLE_NODE_WRAPPER);

/** drag-and-drop classes */
export const isDragRowFloatingInsertDot = (node: HTMLElement | null): boolean =>
	containsClassName(node, ClassName.DRAG_ROW_FLOATING_INSERT_DOT_WRAPPER);

export const isDragColumnFloatingInsertDot = (node: HTMLElement | null): boolean =>
	containsClassName(node, ClassName.DRAG_COLUMN_FLOATING_INSERT_DOT_WRAPPER);

export const isDragCornerButton = (node: HTMLElement | null): boolean =>
	containsClassName(node, ClassName.DRAG_CORNER_BUTTON) ||
	containsClassName(node, ClassName.DRAG_CORNER_BUTTON_INNER);

/*
 * This function returns which side of a given element the mouse cursor is,
 * using as a base the half of the width by default, for example:
 *
 * legend
 * ⌖ = mouse pointer
 * ▒ = gap
 *
 * given this box:
 * ┏━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┓
 * ┃                    ┊                     ┃
 * ┃       left         ┊        right        ┃
 * ┃                    ┊                     ┃
 * ┗━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━┛
 *
 * if the mouse is on the left, it will return `left`,
 * if it is on the right it will return `right`.
 *
 * You can extend this behavior using the parameter `gapInPixels`
 * to determinate if the mouse is inside of a gap for each side,
 * for example:
 *
 * given `gapInPixels` is `5`
 * and given this box:
 * ┏━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┓
 * ┃▒▒▒▒▒               ┊                ▒▒▒▒▒┃
 * ┃▒▒▒▒▒   left        ┊        right   ▒▒▒▒▒┃
 * ┃▒▒▒▒▒               ┊                ▒▒▒▒▒┃
 * ┗━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━┛
 *
 * if the mouse cursor is inside of the gap like that:
 *
 * ┏━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┓
 * ┃▒▒▒▒▒               ┊                ▒▒▒▒▒┃
 * ┃▒▒⌖▒▒   left        ┊        right   ▒▒▒▒▒┃
 * ┃▒▒▒▒▒               ┊                ▒▒▒▒▒┃
 * ┗━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━┛
 *
 * the function will return `left` because the mouse is inside of the gap on the left side.
 *
 * if the mouse cursor is outside of the gap like that:
 *
 * ┏━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┓
 * ┃▒▒▒▒▒               ┊                ▒▒▒▒▒┃
 * ┃▒▒▒▒▒   left  ⌖     ┊        right   ▒▒▒▒▒┃
 * ┃▒▒▒▒▒               ┊                ▒▒▒▒▒┃
 * ┗━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━┛
 *
 * the function will return `null` because the mouse is inside of left
 * but is outside of the gap.
 *
 * the same is valid to the right side.
 */
/**
 * This can be used with mouse events to determine the left/right side of the target the pointer is closest too.
 *
 * WARNING: This metod reads properties which can trigger a reflow; use this wisely.
 *
 * @param mouseEvent
 * @param gapInPixels
 * @returns
 */
export const getMousePositionHorizontalRelativeByElement = (
	mouseEvent: MouseEvent,
	offsetX: number,
	gapInPixels?: number,
): 'left' | 'right' | null => {
	const element = mouseEvent.target;

	if (element instanceof HTMLElement) {
		const width = element.clientWidth; // reflow
		const x = !Number.isNaN(offsetX) ? offsetX : mouseEvent.offsetX; // reflow

		if (width <= 0) {
			return null;
		}

		if (!gapInPixels) {
			return x / width > 0.5 ? 'right' : 'left';
		} else {
			if (x <= gapInPixels) {
				return 'left';
			} else if (x >= width - gapInPixels) {
				return 'right';
			}
		}
	}

	return null;
};

export const getMousePositionVerticalRelativeByElement = (
	mouseEvent: MouseEvent,
): 'top' | 'bottom' | null => {
	const element = mouseEvent.target;
	if (element instanceof HTMLElement) {
		const elementRect = element.getBoundingClientRect();
		if (elementRect.height <= 0) {
			return null;
		}

		const y = mouseEvent.clientY - elementRect.top;
		return y / elementRect.height > 0.5 ? 'bottom' : 'top';
	}

	return null;
};

export const hasResizeHandler = ({
	columnEndIndexTarget,
	target,
}: {
	columnEndIndexTarget: number;
	target: HTMLElement;
}): boolean => {
	const tableElement = closestElement(target, 'table');

	if (!tableElement) {
		return false;
	}

	const query = [
		`.${ClassName.RESIZE_HANDLE_DECORATION}`,
		`[data-end-index="${columnEndIndexTarget}"]`,
	];

	const decorationElement = tableElement.querySelectorAll(query.join(''));

	if (!decorationElement || decorationElement.length === 0) {
		return false;
	}

	return true;
};

export type TableDOMElements = {
	table: HTMLTableElement;
	wrapper: HTMLDivElement;
};

export const getTree = (tr: HTMLTableRowElement): TableDOMElements | null => {
	// pm renders into tbody, owned by react
	const tbody = tr.parentElement;
	if (!tbody) {
		return null;
	}

	// rendered by react
	const table = tbody.parentElement;
	if (!table) {
		return null;
	}

	// rendered by react
	const wrapper = table.parentElement;
	if (!wrapper) {
		return null;
	}

	return {
		wrapper: wrapper as HTMLDivElement,
		table: table as HTMLTableElement,
	};
};

export const getTop = (element: HTMLElement | Window | undefined): number => {
	if (!element || element instanceof Window) {
		return 0;
	}

	return element?.getBoundingClientRect?.()?.top ?? 0;
};

export const findNearestCellIndexToPoint = (
	x: number,
	y: number,
): { col: number; row: number } | undefined => {
	const elements = document.elementsFromPoint(x, y);
	const cell = elements.find(
		(el) => el.nodeName.toUpperCase() === 'TD' || el.nodeName.toUpperCase() === 'TH',
	) as HTMLTableCellElement | undefined;
	const row = (cell?.parentElement ?? undefined) as HTMLTableRowElement | undefined;

	if (!Number.isFinite(row?.rowIndex) || !Number.isFinite(cell?.cellIndex)) {
		return undefined;
	}
	return {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		row: row!.rowIndex,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		col: cell!.cellIndex,
	};
};

export const areAllRectsZero = (entry: IntersectionObserverEntry): boolean => {
	const rects = [
		entry.boundingClientRect,
		entry.rootBounds,
		entry.intersectionRect
	];

	return rects.every(
		(rect) =>
			rect &&
			rect.width === 0 &&
			rect.height === 0 &&
			rect.top === 0 &&
			rect.left === 0 &&
			rect.bottom === 0 &&
			rect.right === 0 &&
			rect.x === 0 &&
			rect.y === 0,
	);
}
