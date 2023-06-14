import { NodeSpec, ResolvedPos } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { CellAttributes, TableLayout } from '@atlaskit/adf-schema';
import { calcTableWidth } from '@atlaskit/editor-common/styles';
import {
  getBreakpoint,
  mapBreakpointToLayoutMaxWidth,
} from '@atlaskit/editor-common/ui';
import {
  akEditorFullWidthLayoutWidth,
  akEditorGutterPadding,
  akEditorTableNumberColumnWidth,
} from '@atlaskit/editor-shared-styles';

import { containsClassName } from '@atlaskit/editor-common/utils';
import { TableOptions } from '../../../nodeviews/types';
import { Node as PMNode } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import {
  getParentNodeWidth,
  layoutToWidth,
} from '@atlaskit/editor-common/node-width';

// Translates named layouts in number values.
export function getLayoutSize(
  tableLayout: TableLayout,
  containerWidth: number = 0,
  options: TableOptions,
): number {
  const { isFullWidthModeEnabled } = options;

  if (isFullWidthModeEnabled) {
    return containerWidth
      ? Math.min(
          containerWidth - akEditorGutterPadding * 2,
          akEditorFullWidthLayoutWidth,
        )
      : akEditorFullWidthLayoutWidth;
  }

  const calculatedTableWidth = calcTableWidth(
    tableLayout,
    containerWidth,
    true,
  );
  if (calculatedTableWidth !== 'inherit') {
    return calculatedTableWidth;
  }

  return layoutToWidth[tableLayout] || containerWidth;
}

export function getDefaultLayoutMaxWidth(containerWidth?: number): number {
  return mapBreakpointToLayoutMaxWidth(getBreakpoint(containerWidth));
}

// Does the current position point at a cell.
export function pointsAtCell($pos: ResolvedPos<any>) {
  return (
    ($pos.parent.type.spec as NodeSpec & { tableRole: string }).tableRole ===
      'row' && $pos.nodeAfter
  );
}

// Get the current col width, handles colspan.
export function currentColWidth(
  view: EditorView,
  cellPos: number,
  { colspan, colwidth }: CellAttributes,
): number {
  let width = colwidth && colwidth[colwidth.length - 1];
  if (width) {
    return width;
  }
  // Not fixed, read current width from DOM
  let domWidth = (view.domAtPos(cellPos + 1).node as HTMLElement).offsetWidth;
  let parts = colspan || 0;
  if (colwidth) {
    for (let i = 0; i < (colspan || 0); i++) {
      if (colwidth[i]) {
        domWidth -= colwidth[i];
        parts--;
      }
    }
  }

  return domWidth / parts;
}

// Attempts to find a parent TD/TH depending on target element.
export function domCellAround(target: HTMLElement | null): HTMLElement | null {
  while (target && target.nodeName !== 'TD' && target.nodeName !== 'TH') {
    target = containsClassName(target, 'ProseMirror')
      ? null
      : (target.parentNode as HTMLElement | null);
  }
  return target;
}

interface getTableMaxWidthProps {
  table: PMNode;
  tableStart: number;
  state: EditorState;
  layout: TableLayout;
  getEditorContainerWidth: GetEditorContainerWidth;
}

export const getTableMaxWidth = ({
  table,
  tableStart,
  state,
  layout,
  getEditorContainerWidth,
}: getTableMaxWidthProps) => {
  const containerWidth = getEditorContainerWidth();
  const parentWidth = getParentNodeWidth(tableStart, state, containerWidth);

  let maxWidth = parentWidth || getLayoutSize(layout, containerWidth.width, {});

  if (table.attrs.isNumberColumnEnabled) {
    maxWidth -= akEditorTableNumberColumnWidth;
  }

  return maxWidth;
};
