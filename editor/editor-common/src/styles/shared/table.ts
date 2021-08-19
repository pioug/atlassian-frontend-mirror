import { css } from 'styled-components';

import {
  tableCellContentDomSelector,
  tableCellSelector,
  TableLayout,
  tablePrefixSelector,
} from '@atlaskit/adf-schema';
import {
  akEditorBreakoutPadding,
  akEditorFullWidthLayoutWidth,
  akEditorTableBorder,
  akEditorTableBorderDark,
  akEditorTableNumberColumnWidth,
  akEditorTableToolbar,
  akEditorTableToolbarDark,
  akEditorWideLayoutWidth,
  getTableCellBackgroundDarkModeColors,
  overflowShadow,
} from '@atlaskit/editor-shared-styles';
import { DN20 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';

import browser from '../../utils/browser';

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
  TABLE_STICKY_SHADOW: `${tablePrefixSelector}-sticky-shadow`,
  TABLE_STICKY_WRAPPER: `${tablePrefixSelector}-sticky-wrapper`,
  TABLE_STICKY_SENTINEL_TOP: `${tablePrefixSelector}-sticky-sentinel-top`,
  TABLE_STICKY_SENTINEL_BOTTOM: `${tablePrefixSelector}-sticky-sentinel-bottom`,
  TABLE_CELL_NODEVIEW_CONTENT_DOM: tableCellContentDomSelector,
  TABLE_CELL_WRAPPER: tableCellSelector,
};

const tableSharedStyle = css`
  .${TableSharedCssClassName.TABLE_CONTAINER} {
    position: relative;
    margin: 0 auto ${tableMarginBottom}px;
    box-sizing: border-box;

    /**
     * Fix block top alignment inside table cells.
     */
    .decisionItemView-content-wrap:first-child > div {
      margin-top: 0;
    }
  }
  .${TableSharedCssClassName.TABLE_CONTAINER}[data-number-column='true'] {
    padding-left: ${akEditorTableNumberColumnWidth - 1}px;
  }
  /* avoid applying styles to nested tables (possible via extensions) */
  .${TableSharedCssClassName.TABLE_CONTAINER} > table,
  .${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table,
  .${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table {
    border-collapse: collapse;
    margin: ${tableMarginTop}px ${tableMarginSides}px 0 0;
    border: ${tableCellBorderWidth}px solid
      ${themed({
        light: akEditorTableBorder,
        dark: akEditorTableBorderDark,
      })};
    table-layout: fixed;
    font-size: 1em;
    width: 100%;

    &[data-autosize='true'] {
      table-layout: auto;
    }

    & {
      * {
        box-sizing: border-box;
      }
      hr {
        box-sizing: content-box;
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
        border: 1px solid
          ${themed({
            light: akEditorTableBorder,
            dark: akEditorTableBorderDark,
          })};
        border-right-width: 0;
        border-bottom-width: 0;
        padding: ${tableCellPadding}px;
        /* https://stackoverflow.com/questions/7517127/borders-not-shown-in-firefox-with-border-collapse-on-table-position-relative-o */
        ${browser.gecko || browser.ie ? 'background-clip: padding-box;' : ''}

        ${themed({ dark: getTableCellBackgroundDarkModeColors })};

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

        /* only apply this styling to codeblocks in default background headercells */
        /* TODO this needs to be overhauled as it relies on unsafe selectors */
        &:not([style]) {
          .code-block {
            background-image: ${overflowShadow({
              background: themed({
                light: 'rgb(235, 237, 240)',
                dark: 'rgb(36, 47, 66)',
              }),
              width: `${gridSize()}px`,
            })};
            background-attachment: local, scroll, scroll;
            background-position: 100% 0, 100% 0, 0 0;
            background-color: ${themed({
              light: 'rgb(235, 237, 240)',
              dark: 'rgb(36, 47, 66)',
            })};

            .line-number-gutter {
              background-color: ${themed({
                light: 'rgb(226, 229, 233)',
                dark: DN20,
              })};
            }

            /* this is only relevant to the element taken care of by renderer */
            > [data-ds--code--code-block] {
              background-image: ${overflowShadow({
                background: themed({
                  light: 'rgb(235, 237, 240)',
                  dark: 'rgb(36, 47, 66)',
                }),
                width: `${gridSize()}px`,
              })}!important;

              background-color: ${themed({
                light: 'rgb(235, 237, 240)',
                dark: 'rgb(36, 47, 66)',
              })}!important;

              // selector lives inside @atlaskit/code
              --ds--code--line-number-bg-color: ${themed({
                light: 'rgb(226, 229, 233)',
                dark: DN20,
              })};
            }
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
