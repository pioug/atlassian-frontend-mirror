import { css } from 'styled-components';
import {
  TableLayout,
  tableCellContentDomSelector,
  tablePrefixSelector,
} from '@atlaskit/adf-schema';
import { fontSize, themed, colors } from '@atlaskit/theme';
import {
  akEditorTableBorder,
  akEditorTableBorderDark,
  akEditorTableToolbar,
  akEditorTableToolbarDark,
  akEditorWideLayoutWidth,
  akEditorTableNumberColumnWidth,
  akEditorFullWidthLayoutWidth,
  akEditorBreakoutPadding,
} from '../consts';

export const tableMarginTop = 24;
export const tableMarginBottom = 16;
export const tableMarginSides = 8;
export const tableCellMinWidth = 48;
export const tableNewColumnMinWidth = 140;
export const tableCellBorderWidth = 1;
export const tableCellPadding = 8;
export const tableResizeHandleWidth = 6;

export const TableSharedCssClassName = {
  TABLE_CONTAINER: `${tablePrefixSelector}-container`,
  TABLE_NODE_WRAPPER: `${tablePrefixSelector}-wrapper`,
  TABLE_LEFT_SHADOW: `${tablePrefixSelector}-with-left-shadow`,
  TABLE_RIGHT_SHADOW: `${tablePrefixSelector}-with-right-shadow`,
  TABLE_CELL_NODEVIEW_CONTENT_DOM: tableCellContentDomSelector,
};

const tableSharedStyle = css`
  .${TableSharedCssClassName.TABLE_CONTAINER} {
    position: relative;
    margin: 0 auto ${tableMarginBottom}px;
    box-sizing: border-box;

    /**
     * Fix block top alignment inside table cells.
     */
    .taskItemView-content-wrap > div,
    .decisionItemView-content-wrap > div {
      margin-top: 0;
    }
  }
  .${TableSharedCssClassName.TABLE_CONTAINER}[data-number-column='true'] {
    padding-left: ${akEditorTableNumberColumnWidth - 1}px;
  }
  /* avoid applying styles to nested tables (possible via extensions) */
  .${TableSharedCssClassName.TABLE_CONTAINER} > table,
  .${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table {
    border-collapse: collapse;
    margin: ${tableMarginTop}px ${tableMarginSides}px 0 0;
    border: ${tableCellBorderWidth}px solid ${themed({
  light: akEditorTableBorder,
  dark: akEditorTableBorderDark,
})};
    table-layout: fixed;
    font-size: ${fontSize()}px;
    width: 100%;

    &[data-autosize='true'] {
      table-layout: auto;
    }

    & {
      * {
        box-sizing: border-box;
      }

      tbody {
        border-bottom: none;
      }
      th td {
        background-color: white;
      }
      th,
      td {
        min-width: ${tableCellMinWidth}px;
        font-weight: normal;
        vertical-align: top;
        border: 1px solid ${themed({
          light: akEditorTableBorder,
          dark: akEditorTableBorderDark,
        })};
        border-right-width: 0;
        border-bottom-width: 0;
        padding: ${tableCellPadding}px;
        /* https://stackoverflow.com/questions/7517127/borders-not-shown-in-firefox-with-border-collapse-on-table-position-relative-o */
        background-clip: padding-box;

        > *:first-child {
          margin-top: 0;
        }

        > .ProseMirror-gapcursor.-right:first-child + * {
          margin-top: 0;
        }

        > .ProseMirror-gapcursor:first-child + span + * {
          margin-top: 0;
        }

        th p:not(:first-of-type),
        td p:not(:first-of-type) {
          margin-top: 12px;
        }
      }
      th {
        background-color: ${themed({
          light: akEditorTableToolbar,
          dark: akEditorTableToolbarDark,
        })};
        text-align: left;

        .code-block {
          /*
            Add a background color tint to code blocks inside a table heading since they both
            share the same background colour. This prevents them visually blending together.
          */
          background: ${themed({ light: colors.N20A, dark: colors.DN700A })};

          > span {
            /*
              The codeblock inside @atlaskit/code uses inline styles so we disable the default
              background color because editor/renderer provides it's own background colours.
            */
            background: transparent !important;
          }
        }
      }
    }
  }
`;

export const calcTableWidth = (
  layout: TableLayout,
  containerWidth?: number,
  addControllerPadding: boolean = true,
): string => {
  switch (layout) {
    case 'full-width':
      return containerWidth
        ? `${Math.min(
            containerWidth -
              (addControllerPadding ? akEditorBreakoutPadding : 0),
            akEditorFullWidthLayoutWidth,
          )}px`
        : `${akEditorFullWidthLayoutWidth}px`;
    case 'wide':
      if (containerWidth) {
        return `${Math.min(
          containerWidth - (addControllerPadding ? akEditorBreakoutPadding : 0),
          akEditorWideLayoutWidth,
        )}px`;
      }

      return `${akEditorWideLayoutWidth}px`;
    default:
      return 'inherit';
  }
};

export { tableSharedStyle };
