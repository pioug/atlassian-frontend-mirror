import { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
  akEditorBreakoutPadding,
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  breakoutWideScaleRatio,
} from '@atlaskit/editor-shared-styles';

import { GuidelineConfig } from './types';

/**
 * This function calculates the Editor's x axis of the center point
 * in relation to the viewport
 * @param editorView
 * @returns x axis in number
 */
export const getEditorCenterX = (editorView: EditorView): number => {
  const editorRect = (editorView.dom as HTMLElement).getBoundingClientRect();
  return Math.round(editorRect.width / 2 + editorRect.x);
};

const defaultGrids = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];

export const innerGuidelines = (
  editorContainerWidth: number,
  editorWidth: number = akEditorDefaultLayoutWidth,
): GuidelineConfig[] => {
  const wideSpacing = (editorWidth * breakoutWideScaleRatio) / 2;

  const fullWidthPadding =
    (akEditorBreakoutPadding + editorWidth - akEditorDefaultLayoutWidth) / 2;

  const containerWidth =
    Math.min(editorContainerWidth, akEditorFullWidthLayoutWidth) / 2 -
    fullWidthPadding;

  const fullWidthGuidelines = [
    {
      key: `full_width_left`,
      position: {
        x: -containerWidth,
      },
    },
    {
      key: `full_width_right`,
      position: {
        x: containerWidth,
      },
    },
  ];

  const wideGuidelines = [
    {
      key: `wide_left`,
      position: {
        x: -wideSpacing,
      },
    },
    {
      key: `wide_right`,
      position: {
        x: wideSpacing,
      },
    },
  ];

  const gridGuidelines = defaultGrids.map((val, index) => ({
    key: `grid_${index}`,
    position: {
      x: (val / 12) * editorWidth,
    },
  }));

  return [...gridGuidelines, ...wideGuidelines, ...fullWidthGuidelines];
};
