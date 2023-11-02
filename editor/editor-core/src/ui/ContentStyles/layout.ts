import { css } from '@emotion/react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';
import { N40A, N50A, DN70, DN80 } from '@atlaskit/theme/colors';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { themed } from '@atlaskit/theme/components';
import type { ThemeProps } from '@atlaskit/theme/types';
import {
  columnLayoutSharedStyle,
  LAYOUT_SECTION_MARGIN,
  LAYOUT_COLUMN_PADDING,
} from '@atlaskit/editor-common/styles';
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

import { TableCssClassName } from '@atlaskit/editor-plugin-table/types';
import { tableMarginFullWidthMode } from '@atlaskit/editor-plugin-table/ui/consts';

export { LAYOUT_COLUMN_PADDING, LAYOUT_SECTION_MARGIN };

export const layoutStyles = (props: ThemeProps) => css`
  .ProseMirror {
    ${columnLayoutSharedStyle} [data-layout-section] {
      // TODO: Migrate away from gridSize
      // Recommendation: Replace directly with 7px
      margin: ${gridSize() - 1}px -${akLayoutGutterOffset}px 0;
      transition: border-color 0.3s ${akEditorSwoopCubicBezier};
      cursor: pointer;

      /* Inner cursor located 26px from left */
      [data-layout-column] {
        flex: 1;
        min-width: 0;
        border: ${akEditorSelectedBorderSize}px solid
          ${themed({
            light: token('color.border', N40A),
            dark: token('color.border', DN70),
          })(props)};
        border-radius: 4px;
        padding: ${LAYOUT_COLUMN_PADDING}px;
        box-sizing: border-box;

        > div {
          > :not(style):first-child,
          > style:first-child + * {
            margin-top: 0;
          }

          > .ProseMirror-gapcursor:first-child + *,
          > style:first-child + .ProseMirror-gapcursor + * {
            margin-top: 0;
          }

          > .ProseMirror-gapcursor:first-child + span + *,
          > style:first-child + .ProseMirror-gapcursor:first-child + span + * {
            margin-top: 0;
          }

          > .embedCardView-content-wrap:first-of-type .rich-media-item {
            margin-top: 0;
          }

          > .mediaSingleView-content-wrap:first-of-type .rich-media-item {
            margin-top: 0;
          }

          > .ProseMirror-gapcursor.-right:first-child
            + .mediaSingleView-content-wrap
            .rich-media-item,
          > style:first-child
            + .ProseMirror-gapcursor.-right
            + .mediaSingleView-content-wrap
            .rich-media-item,
          > .ProseMirror-gapcursor.-right:first-of-type
            + .embedCardView-content-wrap
            .rich-media-item {
            margin-top: 0;
          }

          > .ProseMirror-gapcursor:first-child
            + span
            + .mediaSingleView-content-wrap
            .rich-media-item,
          > style:first-child
            + .ProseMirror-gapcursor
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

      // TODO: Remove the border styles below once design tokens have been enabled and fallbacks are no longer triggered.
      // This is because the default state already uses the same token and, as such, the hover style won't change anything.
      // https://product-fabric.atlassian.net/browse/DSP-4441
      /* Shows the border when cursor is inside a layout */
      &.selected [data-layout-column],
      &:hover [data-layout-column] {
        border: ${akEditorSelectedBorderSize}px solid
          ${themed({
            light: token('color.border', N50A),
            dark: token('color.border', DN80),
          })(props)};
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
