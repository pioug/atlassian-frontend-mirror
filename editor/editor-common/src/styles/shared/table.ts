/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */

// TODO: https://product-fabric.atlassian.net/browse/DSP-4118
// TODO: https://product-fabric.atlassian.net/browse/DSP-4153

import { css } from '@emotion/react';

import {
  tableCellContentDomSelector,
  tableCellSelector,
  tableHeaderSelector,
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
import { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

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
  TABLE_HEADER_CELL_WRAPPER: tableHeaderSelector,
  TABLE_ROW_CONTROLS_WRAPPER: `${tablePrefixSelector}-row-controls-wrapper`,
  TABLE_COLUMN_CONTROLS_DECORATIONS: `${tablePrefixSelector}-column-controls-decoration`,
};

const tableSharedStyle = (props: ThemeProps) => css`
  .${TableSharedCssClassName.TABLE_CONTAINER} {
    position: relative;
    margin: 0 auto ${tableMarginBottom}px;
    box-sizing: border-box;

    /**
     * Fix block top alignment inside table cells.
     */
    .decisionItemView-content-wrap:first-of-type > div {
      margin-top: 0;
    }
  }
  .${TableSharedCssClassName.TABLE_CONTAINER}[data-number-column='true'] {
    padding-left: ${akEditorTableNumberColumnWidth - 1}px;
    clear: both;
  }
  .${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table {
    margin: ${tableMarginTop}px 0 0 0;
  }

  .${TableSharedCssClassName.TABLE_CONTAINER} > table,
  .${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table {
    margin: ${tableMarginTop}px ${tableMarginSides}px 0 0;
  }

  /* avoid applying styles to nested tables (possible via extensions) */
  .${TableSharedCssClassName.TABLE_CONTAINER} > table,
  .${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table,
  .${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table {
    border-collapse: collapse;
    border: ${tableCellBorderWidth}px solid
      ${themed({
        light: token('color.border', akEditorTableBorder),
        dark: token('color.border', akEditorTableBorderDark),
      })(props)};
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
        background-color: ${token('color.background.neutral.subtle', 'white')};
      }
      th,
      td {
        min-width: ${tableCellMinWidth}px;
        font-weight: normal;
        vertical-align: top;
        border: 1px solid
          ${themed({
            light: token('color.border', akEditorTableBorder),
            dark: token('color.border', akEditorTableBorderDark),
          })(props)};
        border-right-width: 0;
        border-bottom-width: 0;
        padding: ${tableCellPadding}px;
        /* https://stackoverflow.com/questions/7517127/borders-not-shown-in-firefox-with-border-collapse-on-table-position-relative-o */
        ${browser.gecko || browser.ie || (browser.mac && browser.chrome)
          ? 'background-clip: padding-box;'
          : ''}

        ${themed({ dark: getTableCellBackgroundDarkModeColors })(props)};

        > :first-child:not(style),
        > style:first-child + * {
          margin-top: 0;
        }

        > .ProseMirror-gapcursor.-right:first-of-type + * {
          margin-top: 0;
        }

        > .ProseMirror-gapcursor:first-of-type + span + * {
          margin-top: 0;
        }

        th p:not(:first-of-type),
        td p:not(:first-of-type) {
          margin-top: 12px;
        }
      }
      th {
        background-color: ${themed({
          light: token('color.background.neutral', akEditorTableToolbar),
          dark: token('color.background.neutral', akEditorTableToolbarDark),
        })(props)};
        text-align: left;

        /* only apply this styling to codeblocks in default background headercells */
        /* TODO this needs to be overhauled as it relies on unsafe selectors */
        &:not([style]) {
          .code-block {
            background-image: ${overflowShadow({
              background: themed({
                light: 'rgb(235, 237, 240)',
                dark: 'rgb(36, 47, 66)',
              })(props),
              width: `${gridSize()}px`,
            })};
            background-attachment: local, scroll, scroll;
            background-position: 100% 0, 100% 0, 0 0;
            background-color: ${themed({
              light: token('color.background.neutral', 'rgb(235, 237, 240)'),
              dark: token('color.background.neutral', 'rgb(36, 47, 66)'),
            })(props)};

            .line-number-gutter {
              background-color: ${themed({
                light: token('color.background.neutral', 'rgb(226, 229, 233)'),
                dark: token('color.background.neutral', DN20),
              })(props)};
            }

            /* this is only relevant to the element taken care of by renderer */
            > [data-ds--code--code-block] {
              background-image: ${overflowShadow({
                background: themed({
                  light: 'rgb(235, 237, 240)',
                  dark: 'rgb(36, 47, 66)',
                })(props),
                width: `${gridSize()}px`,
              })}!important;

              background-color: ${themed({
                light: token('color.background.neutral', 'rgb(235, 237, 240)'),
                dark: token('color.background.neutral', 'rgb(36, 47, 66)'),
              })(props)}!important;

              // selector lives inside @atlaskit/code
              --ds--code--line-number-bg-color: ${themed({
                light: token('color.background.neutral', 'rgb(226, 229, 233)'),
                dark: token('color.background.neutral', DN20),
              })(props)};
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
