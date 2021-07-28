import { containsClassName } from '../../../utils';
import { closestElement } from '../../../utils/dom';
import { TableCssClassName as ClassName, ElementContentRects } from '../types';
import { tableToolbarSize } from '../ui/consts';

const SELECTOR_TABLE_LEAFS = `.${ClassName.TABLE_CELL}, .${ClassName.TABLE_HEADER_CELL}`;

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

export const isColumnControlsDecorations = (
  node: HTMLElement | null,
): boolean => containsClassName(node, ClassName.COLUMN_CONTROLS_DECORATIONS);

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

export const getMousePositionHorizontalRelativeByElement = (
  mouseEvent: MouseEvent,
  mouseMoveOptimization?: boolean,
  elementContentRects?: ElementContentRects,
  gapInPixels?: number,
): 'left' | 'right' | null => {
  const element = mouseEvent.target;

  if (element instanceof HTMLElement) {
    let width, x;
    const closestCell = element.closest(SELECTOR_TABLE_LEAFS);

    if (mouseMoveOptimization) {
      const id = closestCell?.id ?? '';
      width = elementContentRects?.[id]?.width ?? 0;
      x = mouseEvent.offsetX;
    } else {
      const elementRect = element.getBoundingClientRect();
      width = elementRect.width;
      const left = elementRect.left;
      x = mouseEvent.clientX - left;
    }

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

export const updateResizeHandles = (tableRef?: HTMLElement) => {
  if (!tableRef) {
    return;
  }
  const height = tableRef.offsetHeight + tableToolbarSize;
  // see ED-7600
  const nodes = Array.from(
    tableRef.querySelectorAll(`.${ClassName.RESIZE_HANDLE}`) as NodeListOf<
      HTMLElement
    >,
  );
  if (!nodes || !nodes.length) {
    return;
  }

  nodes.forEach((node) => {
    node.style.height = `${height}px`;
  });
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
