import { SnapPointsProps } from './../plugins/media/ui/ResizableMediaSingle/types';
import { RichMediaAttributes, RichMediaLayout } from '@atlaskit/adf-schema';
import {
  wrappedLayouts,
  shouldAddDefaultWrappedWidth,
  calcPxFromColumns,
} from '@atlaskit/editor-common';

import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { akEditorBreakoutPadding } from '@atlaskit/editor-shared-styles';

export const nonWrappedLayouts: RichMediaLayout[] = [
  'center',
  'wide',
  'full-width',
];

export const floatingLayouts = ['wrap-left', 'wrap-right'];

export const isRichMediaInsideOfBlockNode = (
  view: EditorView,
  pos: number | boolean,
) => {
  if (typeof pos !== 'number' || isNaN(pos) || !view) {
    return false;
  }

  const $pos = view.state.doc.resolve(pos);

  const { expand, nestedExpand, layoutColumn } = view.state.schema.nodes;
  return !!findParentNodeOfTypeClosestToPos($pos, [
    expand,
    nestedExpand,
    layoutColumn,
  ]);
};

export const alignAttributes = (
  layout: RichMediaLayout,
  oldAttrs: RichMediaAttributes,
  gridSize: number = 12,
  originalWidth: number,
  lineLength?: number,
): RichMediaAttributes => {
  let width = oldAttrs.width;
  const oldLayout: RichMediaLayout = oldAttrs.layout;
  const oldLayoutIsNonWrapped = nonWrappedLayouts.indexOf(oldLayout) > -1;
  const newLayoutIsNonWrapped = nonWrappedLayouts.indexOf(layout) > -1;
  const newLayoutIsWrapped = wrappedLayouts.indexOf(layout) > -1;
  const oldLayoutIsWrapped = wrappedLayouts.indexOf(oldLayout) > -1;
  if (
    oldLayoutIsNonWrapped &&
    shouldAddDefaultWrappedWidth(layout, originalWidth, lineLength)
  ) {
    // 'full-width' or 'wide' or 'center' -> 'wrap-left' or 'wrap-right' or 'align-end' or 'align-start'
    if (
      !width ||
      width >= 100 ||
      oldLayout !== 'center' // == 'full-width' or 'wide'
    ) {
      width = 50;
    }
  } else if (
    layout !== oldLayout &&
    ['full-width', 'wide'].indexOf(oldLayout) > -1
  ) {
    // 'full-width' -> 'center' or 'wide'
    // 'wide' -> 'center' or 'full-width'
    // unset width
    width = undefined;
  } else if (width) {
    const cols = Math.round((width / 100) * gridSize);
    let targetCols = cols;

    if (oldLayoutIsWrapped && newLayoutIsNonWrapped) {
      // wrap -> center needs to align to even grid
      targetCols = Math.floor(targetCols / 2) * 2;
      width = undefined;
    } else if (oldLayoutIsNonWrapped && newLayoutIsWrapped) {
      // Can be here only if
      // 'full-width' or 'wide' or 'center' -> 'wrap-left' or 'wrap-right' or 'align-end' or 'align-start'
      // AND
      // !originalWidth || !lineLength || small image
      // AND
      // width defined!

      // cannot resize to full column width, and cannot resize to 1 column
      if (cols <= 1) {
        targetCols = 2;
      } else if (cols >= gridSize) {
        targetCols = 10;
      }
    }

    if (targetCols !== cols) {
      width = (targetCols / gridSize) * 100;
    }
  }

  return {
    ...oldAttrs,
    layout,
    width,
  };
};

export function calculateSnapPoints({
  $pos,
  akEditorWideLayoutWidth,
  allowBreakoutSnapPoints,
  containerWidth,
  gridSize,
  gridWidth,
  insideInlineLike,
  insideLayout,
  isVideoFile,
  lineLength,
  offsetLeft,
  wrappedLayout,
}: SnapPointsProps) {
  const snapTargets: number[] = [];

  for (let i = 0; i < gridWidth; i++) {
    const pxFromColumns = calcPxFromColumns(i, lineLength, gridWidth);

    snapTargets.push(insideLayout ? pxFromColumns : pxFromColumns - offsetLeft);
  }
  // full width
  snapTargets.push(lineLength - offsetLeft);
  const columns = wrappedLayout || insideInlineLike ? 1 : 2;
  const minimumWidth = calcPxFromColumns(columns, lineLength, gridSize);

  let snapPoints = snapTargets.filter((width) => width >= minimumWidth);
  if (!$pos) {
    return snapPoints;
  }

  snapPoints = isVideoFile
    ? snapPoints.filter((width) => width > 320)
    : snapPoints;

  const isTopLevel = $pos.parent.type.name === 'doc';
  if (isTopLevel && allowBreakoutSnapPoints) {
    snapPoints.push(akEditorWideLayoutWidth);
    const fullWidthPoint = containerWidth - akEditorBreakoutPadding;
    if (fullWidthPoint > akEditorWideLayoutWidth) {
      snapPoints.push(fullWidthPoint);
    }
  }

  // EDM-1107: Ensure new snapPoints are sorted with existing points
  snapPoints = snapPoints.sort((a, b) => a - b);

  return snapPoints;
}
