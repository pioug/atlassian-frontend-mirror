import { css } from '@emotion/react';

import { gridSize } from '@atlaskit/theme/constants';
import { N40A, N50A } from '@atlaskit/theme/colors';
import { columnLayoutSharedStyle } from '@atlaskit/editor-common/styles';
import {
  gridMediumMaxWidth,
  akEditorDeleteBackground,
  akEditorDeleteBorder,
  akEditorSelectedBorderSize,
  akLayoutGutterOffset,
  akEditorSwoopCubicBezier,
  SelectionStyle,
  getSelectionStyles,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

import { TableCssClassName } from '../table/types';
import { tableMarginFullWidthMode } from '../table/ui/consts';

export const LAYOUT_SECTION_MARGIN = gridSize();
export const LAYOUT_COLUMN_PADDING = gridSize() * 1.5;

export const layoutStyles = css`
  .ProseMirror {
    ${columnLayoutSharedStyle} [data-layout-section] {
      margin: ${gridSize() - 1}px -${akLayoutGutterOffset}px 0;
      transition: border-color 0.3s ${akEditorSwoopCubicBezier};
      cursor: pointer;

      /* Inner cursor located 26px from left */
      [data-layout-column] {
        flex: 1;
        min-width: 0;
        // TODO: https://product-fabric.atlassian.net/browse/DSP-4353
        border: ${akEditorSelectedBorderSize}px solid
          ${token('color.border', N40A)};
        border-radius: 4px;
        padding: ${LAYOUT_COLUMN_PADDING}px;
        box-sizing: border-box;

        > div {
          > *:first-child {
            margin-top: 0;
          }

          > .ProseMirror-gapcursor.-right:first-of-type + * {
            margin-top: 0;
          }

          > .ProseMirror-gapcursord:first-of-type + span + * {
            margin-top: 0;
          }

          .rich-media-item {
            margin-top: 0;
          }

          > .mediaSingleView-content-wrap:first-of-type .rich-media-item {
            margin-top: 0;
          }

          > .ProseMirror-gapcursor.-right:first-of-type
            + .mediaSingleView-content-wrap
            .rich-media-item {
            margin-top: 0;
          }

          > .ProseMirror-gapcursor:first-of-type
            + span
            + .mediaSingleView-content-wrap
            .rich-media-item {
            margin-top: 0;
          }

          /* Prevent first DecisionWrapper's margin-top: 8px from shifting decisions down
             and shrinking layout's node selectable area (leniency margin) */
          > [data-node-type='decisionList'] {
            li:first-of-type [data-decision-wrapper] {
              margin-top: 0;
            }
          }
        }

        /* Make the 'content' fill the entire height of the layout column to allow click
           handler of layout section nodeview to target only data-layout-column */
        [data-layout-content] {
          height: 100%;
          cursor: text;
        }
      }

      [data-layout-column] + [data-layout-column] {
        margin-left: ${LAYOUT_SECTION_MARGIN}px;
      }

      @media screen and (max-width: ${gridMediumMaxWidth}px) {
        [data-layout-column] + [data-layout-column] {
          margin-left: 0;
        }
      }

      // TODO: https://product-fabric.atlassian.net/browse/DSP-4441
      /* Shows the border when cursor is inside a layout */
      &.selected [data-layout-column],
      &:hover [data-layout-column] {
        border-color: ${token('color.border', N50A)};
      }

      &.selected.danger > [data-layout-column] {
        background-color: ${token(
          'color.background.danger',
          akEditorDeleteBackground,
        )};
        border-color: ${token('color.border.danger', akEditorDeleteBorder)};
      }

      &.${akEditorSelectedNodeClassName}:not(.danger) {
        [data-layout-column] {
          ${getSelectionStyles([SelectionStyle.Border, SelectionStyle.Blanket])}
        }
      }
    }
  }

  .fabric-editor--full-width-mode .ProseMirror {
    [data-layout-section] {
      .${TableCssClassName.TABLE_CONTAINER} {
        margin: 0 ${tableMarginFullWidthMode}px;
      }
    }
  }
`;
