import { css, Theme } from '@emotion/react';
import { themed } from '@atlaskit/theme/components';
import {
  gridSize,
  fontFamily,
  fontSize,
  borderRadius,
} from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { headingSizes as headingSizesImport } from '@atlaskit/theme/typography';
import { ThemeProps } from '@atlaskit/theme/types';

import { token } from '@atlaskit/tokens';

import {
  tableSharedStyle,
  columnLayoutSharedStyle,
  blockquoteSharedStyles,
  headingsSharedStyles,
  ruleSharedStyles,
  whitespaceSharedStyles,
  paragraphSharedStyles,
  listsSharedStyles,
  indentationSharedStyles,
  blockMarksSharedStyles,
  mediaSingleSharedStyle,
  TableSharedCssClassName,
  tableMarginTop,
  codeMarkSharedStyles,
  shadowSharedStyle,
  dateSharedStyle,
  richMediaClassName,
  tasksAndDecisionsStyles,
  smartCardSharedStyles,
  tableCellPadding,
  textColorStyles,
} from '@atlaskit/editor-common/styles';

import { shadowClassNames } from '@atlaskit/editor-common/ui';
import {
  editorFontSize,
  blockNodesVerticalMargin,
  akEditorTableToolbar,
  akEditorTableToolbarDark,
  akEditorTableBorder,
  akEditorTableBorderDark,
  akEditorTableNumberColumnWidth,
  gridMediumMaxWidth,
  akEditorFullWidthLayoutWidth,
  akEditorStickyHeaderZIndex,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';
import { RendererCssClassName } from '../../consts';
import { RendererAppearance } from './types';
import { HeadingAnchorWrapperClassName } from '../../react/nodes/heading-anchor';

export const FullPagePadding = 32;

export type RendererWrapperProps = {
  appearance?: RendererAppearance;
  allowNestedHeaderLinks: boolean;
  allowColumnSorting: boolean;
};

type HeadingSizes = keyof typeof headingSizesImport;

const getLineHeight = <T extends HeadingSizes>(fontCode: T): number =>
  headingSizesImport[fontCode].lineHeight / headingSizesImport[fontCode].size;

export const headingSizes: { [key: string]: { [key: string]: number } } = {
  h1: {
    lineHeight: getLineHeight('h700'),
  },
  h2: {
    lineHeight: getLineHeight('h600'),
  },
  h3: {
    lineHeight: getLineHeight('h500'),
  },
  h4: {
    lineHeight: getLineHeight('h400'),
  },
  h5: {
    lineHeight: getLineHeight('h300'),
  },
  h6: {
    lineHeight: getLineHeight('h100'),
  },
};

const headingAnchorStyle = (headingTag: string) =>
  css`
    /**
     * The copy link button doesn't reserve space in the DOM so that
     * the text alignment isn't impacted by the button/icon's space.
     */
    .${HeadingAnchorWrapperClassName} {
      position: absolute;
      height: ${headingSizes[headingTag].lineHeight}em;

      margin-left: 6px;

      button {
        padding-left: 0;
        padding-right: 0;
      }
    }

    /**
     * Applies hover effects to the heading anchor link button
     * to fade in when the user rolls over the heading.
     *
     * The link is persistent on mobile, so we use feature detection
     * to enable hover effects for systems that support it (desktop).
     *
     * @see https://caniuse.com/mdn-css_at-rules_media_hover
     */
    @media (hover: hover) and (pointer: fine) {
      .${HeadingAnchorWrapperClassName} {
        > button {
          opacity: 0;
          transform: translate(-8px, 0px);
          transition: opacity 0.2s ease 0s, transform 0.2s ease 0s;
        }
      }

      &:hover {
        .${HeadingAnchorWrapperClassName} > button {
          opacity: 1;
          transform: none !important;
        }
      }
    }
  `;

const alignedHeadingAnchorStyle = ({
  allowNestedHeaderLinks,
}: RendererWrapperProps) => {
  if (!allowNestedHeaderLinks) {
    return '';
  }
  return css`
    .fabric-editor-block-mark[data-align] > {
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        position: relative;
      }
    }

    /**
     * For right-alignment we flip the link to be before the heading
     * text so that the text is flush up against the edge of the editor's
     * container edge.
     */
    .fabric-editor-block-mark:not([data-align='center'])[data-align] {
      > {
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          // Using right to left text to achieve the inverse effect
          // of where the copy link button icon sits for left/center
          // alignment.
          // Although this is unorthodox it's the only approach which
          // allows the button to sit flush against the left edge of
          // bottom line of text.
          direction: rtl;

          // By default RTL will negatively impact the layout of special
          // characters within the heading text, and potentially other
          // nested inline nodes. To prevent this we insert pseudo elements
          // containing HTML entities to retain LTR for all heading content
          // except for the copy link button.
          > *:not(.${HeadingAnchorWrapperClassName}):not(br) {
            ::before {
              // Open LTR: https://www.fileformat.info/info/unicode/char/202a/index.htm
              content: '\u202A';
            }
            ::after {
              // Close LTR: https://www.fileformat.info/info/unicode/char/202c/index.htm
              content: '\u202C';
            }
          }
        }
      }
      .${HeadingAnchorWrapperClassName} {
        margin: 0 6px 0 0;
      }

      @media (hover: hover) and (pointer: fine) {
        .${HeadingAnchorWrapperClassName} > button {
          transform: translate(8px, 0px);
        }
      }
    }
  `;
};

const tableSortableColumnStyle = ({
  allowColumnSorting,
  allowNestedHeaderLinks,
}: RendererWrapperProps) => {
  if (!allowColumnSorting) {
    return '';
  }
  let headingsCss = '';
  if (allowNestedHeaderLinks) {
    headingsCss = `
      /**
       * When the sort button is enabled we want the heading's copy link button
       * to reserve space so that it can prematurely wrap to avoid the button
       * being displayed underneath the sort button (hidden or obscured).
       *
       * The two buttons fight each other since the sort button is displayed
       * on hover of the <th /> and the copy link button is displayed on hover
       * of the heading.
       *
       * Note that this can break the WYSIWYG experience in the case where
       * a heading fills the width of the table cell and the only thing which
       * wraps is the copy link button. This is hopefully a rare fringe case.
       */
      .${HeadingAnchorWrapperClassName} {
        position: unset;
      }
      > {
        h1, h2, h3, h4, h5, h6 {
          margin-right: 30px;
        }
      }
    `;
  }
  return css`
    .${RendererCssClassName.SORTABLE_COLUMN} {
      padding: 0;

      .${RendererCssClassName.SORTABLE_COLUMN_BUTTON} {
        width: 100%;
        height: 100%;
        cursor: pointer;
        padding: ${tableCellPadding}px;
        border-width: 1.5px;
        border-style: solid;
        border-color: transparent;

        > *:first-child {
          margin-top: 0;
        }

        > .ProseMirror-gapcursor.-right:first-child + * {
          margin-top: 0;
        }

        > .ProseMirror-gapcursor:first-child + span + * {
          margin-top: 0;
        }

        @supports selector(:focus-visible) {
          &:focus {
            outline: unset;
          }
          &:focus-visible {
            border-color: ${token('color.border.focused', colors.B300)};
          }
        }

        ${headingsCss}
      }

      &.${RendererCssClassName.SORTABLE_COLUMN_NOT_ALLOWED}
        .${RendererCssClassName.SORTABLE_COLUMN_BUTTON} {
        cursor: default;
      }

      .${RendererCssClassName.SORTABLE_COLUMN_ICON} {
        margin: 0;
        opacity: 1;
        transition: opacity 0.2s ease-in-out;
      }

      .${RendererCssClassName.SORTABLE_COLUMN_NO_ORDER} {
        opacity: 0;
      }

      &:hover {
        .${RendererCssClassName.SORTABLE_COLUMN_NO_ORDER} {
          opacity: 1;
        }
      }
    }
  `;
};

const fullPageStyles = (
  { appearance }: RendererWrapperProps,
  { theme }: ThemeProps,
) => {
  if (appearance !== 'full-page' && appearance !== 'mobile') {
    return '';
  }

  return css`
    max-width: ${theme && theme.layoutMaxWidth
      ? `${theme.layoutMaxWidth}px`
      : 'none'};
    margin: 0 auto;
    padding: 0 ${appearance === 'full-page' ? FullPagePadding : 0}px;
  `;
};

const fullWidthStyles = ({ appearance }: RendererWrapperProps) => {
  if (appearance !== 'full-width') {
    return '';
  }

  return css`
    max-width: ${akEditorFullWidthLayoutWidth}px;
    margin: 0 auto;

    .fabric-editor-breakout-mark,
    .pm-table-container,
    .ak-renderer-extension {
      width: 100% !important;
    }
  `;
};

export const rendererStyles = (wrapperProps: RendererWrapperProps) => (
  theme: Theme,
) => {
  // This is required to be compatible with styled-components prop structure.
  const themeProps = { theme };

  return css`
    font-size: ${editorFontSize(themeProps)}px;
    line-height: 1.5rem;
    color: ${themed({
      light: token('color.text', colors.N800),
      dark: token('color.text', '#B8C7E0'),
    })(themeProps)};

    .${RendererCssClassName.DOCUMENT}::after {
      // we add a clearfix after ak-renderer-document in order to
      // contain internal floats (such as media images that are "wrap-left")
      // to just the renderer (and not spill outside of it)
      content: '';
      visibility: hidden;
      display: block;
      height: 0;
      clear: both;
    }

    ${fullPageStyles(wrapperProps, themeProps)}
    ${fullWidthStyles(wrapperProps)}

    & h1 {
      ${headingAnchorStyle('h1')}
    }

    & h2 {
      ${headingAnchorStyle('h2')}
    }

    & h3 {
      ${headingAnchorStyle('h3')}
    }

    & h4 {
      ${headingAnchorStyle('h4')}
    }

    & h5 {
      ${headingAnchorStyle('h5')}
    }

    & h6 {
      ${headingAnchorStyle('h6')}
    }

    & span.akActionMark {
      color: ${token('color.link', colors.B400)};
      text-decoration: none;

      &:hover {
        color: ${token('color.link', colors.B300)};
        text-decoration: underline;
      }

      &:active {
        color: ${token('color.link.pressed', colors.B500)};
      }
    }

    & span.akActionMark {
      cursor: pointer;
    }

    & span[data-placeholder] {
      color: ${colors.placeholderText(themeProps)};
    }

    ${whitespaceSharedStyles};
    ${blockquoteSharedStyles};
    ${headingsSharedStyles(themeProps)};
    ${ruleSharedStyles(themeProps)};
    ${paragraphSharedStyles};
    ${listsSharedStyles};
    ${indentationSharedStyles};
    ${blockMarksSharedStyles};
    ${codeMarkSharedStyles(themeProps)};
    ${shadowSharedStyle};
    ${dateSharedStyle};
    ${textColorStyles};
    ${tasksAndDecisionsStyles};
    ${smartCardSharedStyles}

    & .UnknownBlock {
      font-family: ${fontFamily()};
      font-size: ${relativeFontSizeToBase16(fontSize())};
      font-weight: 400;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    & span.date-node {
      background: ${themed({
        light: token('color.background.neutral', colors.N30A),
        dark: token('color.background.neutral', colors.DN70),
      })(themeProps)};
      border-radius: ${borderRadius()}px;
      color: ${themed({
        light: token('color.text', colors.N800),
        dark: token('color.text', colors.DN600),
      })(themeProps)};
      padding: 2px 4px;
      margin: 0 1px;
      transition: background 0.3s;
    }

    & span.date-node-highlighted {
      background: ${token('color.background.danger', colors.R50)};
      color: ${token('color.text.danger', colors.R500)};
    }

    & .renderer-image {
      max-width: 100%;
      display: block;
      margin: ${gridSize() * 3}px 0;
    }

    .${richMediaClassName}.rich-media-wrapped
      + .${richMediaClassName}:not(.rich-media-wrapped) {
      clear: both;
    }

    & .code-block,
    & blockquote,
    & hr,
    & > div > div:not(.rich-media-wrapped),
    .${richMediaClassName}.rich-media-wrapped
      + .rich-media-wrapped
      + *:not(.rich-media-wrapped),
    .${richMediaClassName}.rich-media-wrapped + div:not(.rich-media-wrapped),
    .${richMediaClassName}.image-align-start,
      .${richMediaClassName}.image-center,
      .${richMediaClassName}.image-align-end {
      clear: both;
    }

    & .rich-media-wrapped {
      & + h1,
      & + h2,
      & + h3,
      & + h4,
      & + h5,
      & + h6 {
        margin-top: 8px;
      }
    }

    ${alignedHeadingAnchorStyle(wrapperProps)}
    /* plugin styles */
    ${mediaSingleSharedStyle} &
    div[class^='image-wrap-'] + div[class^='image-wrap-'] {
      margin-left: 0;
      margin-right: 0;
    }

    /* Breakout for tables and extensions */
    .${RendererCssClassName.DOCUMENT} > {
      * .${TableSharedCssClassName.TABLE_CONTAINER} {
        width: 100% !important;
        left: 0 !important;
      }

      * .${RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER} {
        overflow-x: auto;
      }

      & .${RendererCssClassName.EXTENSION}:first-child {
        margin-top: 0;
      }
    }

    .${RendererCssClassName.DOCUMENT} {
      .${RendererCssClassName.EXTENSION} {
        margin-top: ${blockNodesVerticalMargin};
      }

      .${RendererCssClassName.EXTENSION_CENTER_ALIGN} {
        margin-left: 50%;
        transform: translateX(-50%);
      }

      .${TableSharedCssClassName.TABLE_NODE_WRAPPER} {
        overflow-x: auto;
      }
    }

    ${tableSharedStyle(themeProps)}

    .${RendererCssClassName.DOCUMENT} .${TableSharedCssClassName.TABLE_CONTAINER} {
      z-index: 0;
      transition: all 0.1s linear;
      display: flex; /* needed to avoid position: fixed jumpiness in Chrome */

      /** Shadow overrides */
      &.${shadowClassNames.RIGHT_SHADOW}::after,
        &.${shadowClassNames.LEFT_SHADOW}::before {
        top: ${tableMarginTop - 1}px;
        height: calc(100% - ${tableMarginTop}px);
        z-index: ${akEditorStickyHeaderZIndex};
      }

      /**
     * A hack for making all the <th /> heights equal in case some have shorter
     * content than others.
     *
     * This is done to make sort buttons fill entire <th />.
     */
      table {
        height: 1px; /* will be ignored */
        ${tableSortableColumnStyle(wrapperProps)};
        margin-left: 0;
        margin-right: 0;
      }

      table tr:first-child {
        height: 100%;

        td,
        th {
          position: relative;
        }
      }

      table[data-number-column='true'] {
        .${RendererCssClassName.NUMBER_COLUMN} {
          background-color: ${themed({
            light: token('color.background.neutral', akEditorTableToolbar),
            dark: token('color.background.neutral', akEditorTableToolbarDark),
          })(themeProps)};
          border-right: 1px solid
            ${themed({
              light: token('color.border', akEditorTableBorder),
              dark: token('color.border', akEditorTableBorderDark),
            })(themeProps)};
          width: ${akEditorTableNumberColumnWidth}px;
          text-align: center;
          color: ${themed({
            light: token('color.text.subtlest', colors.N200),
            dark: token('color.text.subtlest', colors.DN400),
          })(themeProps)};
          font-size: ${relativeFontSizeToBase16(fontSize())};
        }

        .fixed .${RendererCssClassName.NUMBER_COLUMN} {
          border-right: 0px none;
        }
      }
    }

    tr[data-header-row].fixed {
      position: fixed !important;
      display: flex;
      overflow: hidden;
      z-index: ${akEditorStickyHeaderZIndex};

      border-right: 1px solid
        ${themed({
          light: token('color.border', akEditorTableBorder),
          dark: token('color.border', akEditorTableBorderDark),
        })(themeProps)};
      border-bottom: 1px solid
        ${themed({
          light: token('color.border', akEditorTableBorder),
          dark: token('color.border', akEditorTableBorderDark),
        })(themeProps)};

      /* this is to compensate for the table border */
      transform: translateX(-1px);
    }

    .sticky > th {
      z-index: ${akEditorStickyHeaderZIndex};
      position: sticky !important;
      top: 0;
    }

    /* Make the number column header sticky */
    .sticky > td {
      position: sticky !important;
      top: 0;
    }

    /* add border for position: sticky
     and work around background-clip: padding-box
     bug for FF causing box-shadow bug in Chrome */
    .sticky th,
    .sticky td {
      box-shadow: 0px 1px
          ${themed({
            light: token('color.border', akEditorTableBorder),
            dark: token('color.border', akEditorTableBorderDark),
          })(themeProps)},
        0px -0.5px ${themed({
            light: token('color.border', akEditorTableBorder),
            dark: token('color.border', akEditorTableBorderDark),
          })(themeProps)},
        inset -1px 0px ${themed({
            light: token('color.border', akEditorTableToolbar),
            dark: token('color.border', akEditorTableToolbarDark),
          })(themeProps)},
        0px -1px ${themed({
            light: token('color.border', akEditorTableToolbar),
            dark: token('color.border', akEditorTableToolbarDark),
          })(themeProps)};
    }

    /* this will remove jumpiness caused in Chrome for sticky headers */
    .fixed + tr {
      min-height: 0px;
    }

    /*
   * We wrap CodeBlock in a grid to prevent it from overflowing the container of the renderer.
   * See ED-4159.
   */
    & .code-block {
      max-width: 100%;
      /* -ms- properties are necessary until MS supports the latest version of the grid spec */
      /* stylelint-disable value-no-vendor-prefix, declaration-block-no-duplicate-properties */
      display: -ms-grid;
      display: grid;
      -ms-grid-columns: auto 1fr;
      /* stylelint-enable */

      grid-template-columns: minmax(0, 1fr);
      position: relative;
      border-radius: ${borderRadius()}px;

      /*
     * The overall renderer has word-wrap: break; which causes issues with
     * code block line numbers in Safari / iOS.
     */
      word-wrap: normal;

      & > span {
        /* stylelint-disable value-no-vendor-prefix */
        -ms-grid-row: 1;
        -ms-grid-column: 2;
        /* stylelint-enable */
        grid-column: 1;
      }
    }

    & .MediaGroup,
    & .code-block {
      margin-top: ${blockNodesVerticalMargin};

      &:first-child {
        margin-top: 0;
      }

      &:hover button.copy-to-clipboard,
      .copy-to-clipboard:focus {
        opacity: 1;
        position: absolute;
        height: 32px;
        width: 32px;
        right: 6px;
        top: 4px;
        padding: 2px;
      }
    }

    ${columnLayoutSharedStyle};
    & [data-layout-section] {
      margin-top: ${gridSize() * 2.5}px;
      & > div + div {
        margin-left: ${gridSize() * 4}px;
      }

      @media screen and (max-width: ${gridMediumMaxWidth}px) {
        & > div + div {
          margin-left: 0;
        }
      }
    }
  `;
};
