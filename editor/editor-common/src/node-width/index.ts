import { Node as PMNode } from 'prosemirror-model';
import { EditorState, PluginKey } from 'prosemirror-state';
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';

import { TableLayout } from '@atlaskit/adf-schema';
import {
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  akEditorWideLayoutWidth,
  akLayoutGutterOffset,
  gridMediumMaxWidth,
} from '@atlaskit/editor-shared-styles';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';

import { BODIED_EXT_PADDING } from '../styles/shared/extension';
import {
  LAYOUT_COLUMN_PADDING,
  LAYOUT_SECTION_MARGIN,
} from '../styles/shared/layout';
import type { EditorContainerWidth } from '../types/editor-container-width';
import { absoluteBreakoutWidth } from '../utils/breakout';

export const layoutToWidth = {
  default: akEditorDefaultLayoutWidth,
  wide: akEditorWideLayoutWidth,
  'full-width': akEditorFullWidthLayoutWidth,
};

/**
 * Calculates width of parent node of a nested node (inside layouts, extension)
 * If current node selection is not nested will return undefined
 */
export const getParentNodeWidth = (
  pos: number | undefined,
  state: EditorState,
  containerWidth: EditorContainerWidth,
  isFullWidthModeEnabled?: boolean,
) => {
  if (!pos) {
    return;
  }

  const node = getNestedParentNode(pos, state);
  if (!node) {
    return;
  }

  let layout = node.attrs.layout || 'default';
  const { schema } = state;
  const breakoutMark =
    schema.marks.breakout && schema.marks.breakout.isInSet(node.marks);
  if (breakoutMark && breakoutMark.attrs.mode) {
    layout = breakoutMark.attrs.mode;
  }
  let parentWidth = calcBreakoutNodeWidth(
    layout,
    containerWidth,
    isFullWidthModeEnabled,
  );

  // TODO: ED-15663
  // Please, do not copy or use this kind of code below
  // @ts-ignore
  const contextPanelPluginKey = {
    key: 'contextPanelPluginKey$',
    getState: (state: EditorState) => {
      return (state as any)['contextPanelPluginKey$'];
    },
  } as PluginKey;

  if (node.type === schema.nodes.layoutSection) {
    parentWidth += akLayoutGutterOffset * 2; // extra width that gets added to layout

    // Calculate width of parent layout column when
    // Parallel layout with viewport greater than 1024px
    // OR side panel of an extension is open and change the node width to smaller than containerWidth
    if (
      containerWidth.width > gridMediumMaxWidth ||
      (contextPanelPluginKey.getState(state)?.contents.length > 0 &&
        contextPanelPluginKey.getState(state)?.contents[0] !== undefined)
    ) {
      parentWidth -= (LAYOUT_SECTION_MARGIN + 2) * (node.childCount - 1); // margin between sections
      const $pos = state.doc.resolve(pos);
      const column = findParentNodeOfTypeClosestToPos($pos, [
        state.schema.nodes.layoutColumn,
      ]);
      if (column && column.node && !isNaN(column.node.attrs.width)) {
        // get exact width of parent layout column using node attrs
        parentWidth = Math.round(parentWidth * column.node.attrs.width * 0.01);
      }
    }
  }

  // account for the padding of the parent node
  switch (node.type) {
    case schema.nodes.layoutSection:
      parentWidth -= LAYOUT_COLUMN_PADDING * 2;
      break;

    case schema.nodes.bodiedExtension:
      parentWidth -= BODIED_EXT_PADDING * 2;
      break;

    // TODO: Migrate away from gridSize
    // Recommendation: Replace gridSize with 8
    case schema.nodes.expand:
      // padding
      parentWidth -= gridSize() * 2;
      // gutter offset
      parentWidth += gridSize() * 1.5 * 2;
      // padding right
      parentWidth -= gridSize();
      // padding left
      parentWidth -= gridSize() * 4 - gridSize() / 2;
      break;
  }

  parentWidth -= 2; // border

  return parentWidth;
};

const getNestedParentNode = (
  tablePos: number,
  state: EditorState,
): PMNode | null => {
  if (tablePos === undefined) {
    return null;
  }

  const $pos = state.doc.resolve(tablePos);
  const parent = findParentNodeOfTypeClosestToPos($pos, [
    state.schema.nodes.bodiedExtension,
    state.schema.nodes.layoutSection,
    state.schema.nodes.expand,
  ]);

  return parent ? parent.node : null;
};

const calcBreakoutNodeWidth = (
  layout: 'full-width' | 'wide' | string,
  containerWidth: EditorContainerWidth,
  isFullWidthModeEnabled?: boolean,
) => {
  return isFullWidthModeEnabled
    ? Math.min(
        containerWidth.lineLength as number,
        akEditorFullWidthLayoutWidth,
      )
    : absoluteBreakoutWidth(layout, containerWidth.width);
};

export const getTableContainerWidth = (node: PMNode): number => {
  if (node.attrs.width) {
    return node.attrs.width;
  }

  return layoutToWidth[node.attrs.layout as TableLayout];
};
