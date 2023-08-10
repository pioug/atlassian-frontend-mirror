import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findChildren } from '@atlaskit/editor-prosemirror/utils';

import { getMediaSinglePixelWidth, roundToNearest } from '../media-single';

import { MEDIA_DYNAMIC_GUIDELINE_PREFIX } from './constants';
import type { GuidelineConfig } from './types';

export const generateDynamicGuidelines = (
  state: EditorState,
  editorWidth: number,
  styles: Omit<GuidelineConfig, 'key' | 'position'> = {},
) => {
  const selectedNode =
    state.selection instanceof NodeSelection &&
    (state.selection as NodeSelection).node;

  const mediaSingleNode = findChildren(
    state.tr.doc,
    (node: PMNode) => {
      return node.type === state.schema.nodes.mediaSingle;
    },
    false, // only top level
  );

  const offset = editorWidth / 2;

  return mediaSingleNode
    .map(({ node }, index) => {
      if (selectedNode === node) {
        return [];
      }

      const { layout, width, widthType } = node.attrs;

      const pixelWidth = getMediaSinglePixelWidth(
        width,
        editorWidth,
        widthType,
      );

      const key = `${MEDIA_DYNAMIC_GUIDELINE_PREFIX}${index}`;

      switch (layout) {
        case 'align-start':
        case 'wrap-left':
          return {
            position: { x: roundToNearest(pixelWidth - offset) },
            key,
            ...styles,
          };
        case 'align-end':
        case 'wrap-right':
          return {
            position: { x: roundToNearest(offset - pixelWidth) },
            key,
            ...styles,
          };
        case 'center':
          return [
            {
              position: { x: roundToNearest(pixelWidth / 2) },
              key: `${key}_right`,
              ...styles,
            },
            {
              position: { x: -roundToNearest(pixelWidth / 2) },
              key: `${key}_left`,
              ...styles,
            },
          ];
        // we ignore full-width and wide
        default:
          return [];
      }
    })
    .flat();
};
