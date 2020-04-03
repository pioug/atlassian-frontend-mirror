import { css } from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';
import {
  columnLayoutSharedStyle,
  gridMediumMaxWidth,
  akEditorDeleteBackground,
  akEditorDeleteBorder,
  akEditorSelectedBorderSize,
  akLayoutGutterOffset,
  akEditorSwoopCubicBezier,
} from '@atlaskit/editor-common';
import { TableCssClassName } from '../table/types';
import { tableMarginFullWidthMode } from '../table/ui/styles';

export const LAYOUT_SECTION_MARGIN = gridSize() - 2;
export const LAYOUT_COLUMN_PADDING = gridSize() * 1.5;

export const layoutStyles = css`
  .ProseMirror {
    ${columnLayoutSharedStyle} [data-layout-section] {
      position: relative;
      margin: ${gridSize() - 1}px -${akLayoutGutterOffset}px 0;
      transition: border-color 0.3s ${akEditorSwoopCubicBezier};

      /* Inner cursor located 26px from left */
      & > * {
        flex: 1;
        min-width: 0;
        border: 1px solid ${colors.N40A};
        border-radius: 4px;

        > div {
          padding: ${LAYOUT_COLUMN_PADDING}px;

          > *:first-child {
            margin-top: 0;
          }

          > .ProseMirror-gapcursor.-right:first-child + * {
            margin-top: 0;
          }

          > .ProseMirror-gapcursor:first-child + span + * {
            margin-top: 0;
          }

          > .mediaSingleView-content-wrap:first-child .media-single {
            margin-top: 0;
          }

          > .ProseMirror-gapcursor.-right:first-child
            + .mediaSingleView-content-wrap
            .media-single {
            margin-top: 0;
          }

          > .ProseMirror-gapcursor:first-child
            + span
            + .mediaSingleView-content-wrap
            .media-single {
            margin-top: 0;
          }
        }
      }

      & > * + * {
        margin-left: ${LAYOUT_SECTION_MARGIN}px;
      }

      @media screen and (max-width: ${gridMediumMaxWidth}px) {
        & > * + * {
          margin-left: 0;
        }
      }

      /**
        * Border to show when node is selected
        * Helps visualise when 'selectNodeBackwards' selects the node for deletion
        */
      &.ProseMirror-selectednode > * {
        border-color: ${colors.B200};
      }
      /* Shows the border when cursor is inside a layout */
      &.selected > *,
      &:hover > * {
        border-color: ${colors.N50A};
      }

      &.selected.danger > [data-layout-column] {
        background-color: ${akEditorDeleteBackground};
        border: ${akEditorSelectedBorderSize}px solid ${akEditorDeleteBorder};
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
