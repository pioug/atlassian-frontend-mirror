import { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import {
  colors,
  gridSize,
  fontFamily,
  fontSize,
  borderRadius,
  themed,
  typography,
} from '@atlaskit/theme';
import {
  tableSharedStyle,
  columnLayoutSharedStyle,
  editorFontSize,
  blockquoteSharedStyles,
  headingsSharedStyles,
  panelSharedStyles,
  ruleSharedStyles,
  whitespaceSharedStyles,
  paragraphSharedStyles,
  listsSharedStyles,
  indentationSharedStyles,
  blockMarksSharedStyles,
  mediaSingleSharedStyle,
  blockNodesVerticalMargin,
  akEditorTableToolbar,
  akEditorTableBorder,
  akEditorTableNumberColumnWidth,
  TableSharedCssClassName,
  tableMarginTop,
  gridMediumMaxWidth,
  codeMarkSharedStyles,
  shadowSharedStyle,
  shadowClassNames,
  dateSharedStyle,
  akEditorFullWidthLayoutWidth,
  mediaSingleClassName,
  tasksAndDecisionsStyles,
} from '@atlaskit/editor-common';
import { RendererCssClassName } from '../../consts';
import { RendererAppearance } from './types';
import { HeadingAnchorWrapperClassName } from '../../react/nodes/heading-anchor';

export const FullPagePadding = 32;

export type RendererWrapperProps = {
  appearance?: RendererAppearance;
  theme?: any;
};

type HeadingSizes = keyof typeof typography.headingSizes;

const getLineHeight = <T extends HeadingSizes>(fontCode: T): number =>
  typography.headingSizes[fontCode].lineHeight /
  typography.headingSizes[fontCode].size;

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
    & .${HeadingAnchorWrapperClassName} {
      position: absolute;
      width: 0;
      height: ${headingSizes[headingTag].lineHeight}em;

      & button {
        opacity: 0;
        transform: translate(8px, 0px);
        transition: opacity 0.2s ease 0s, transform 0.2s ease 0s;
      }
    }

    &:hover {
      & .${HeadingAnchorWrapperClassName} button {
        opacity: 1;
        transform: none;
        width: unset;
      }
    }
  `;

const tableSortableColumnStyle = `
  .${RendererCssClassName.SORTABLE_COLUMN} {
    cursor: pointer;

    &.${RendererCssClassName.SORTABLE_COLUMN_NOT_ALLOWED} {
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

const tableStyles = ({ appearance }: RendererWrapperProps) => {
  if (appearance === 'mobile') {
    return 'table-layout: auto';
  }

  return '';
};

const fullPageStyles = ({ theme, appearance }: RendererWrapperProps) => {
  if (appearance !== 'full-page' && appearance !== 'mobile') {
    return '';
  }

  return `
    max-width: ${
      theme && theme.layoutMaxWidth ? `${theme.layoutMaxWidth}px` : 'none'
    };
    margin: 0 auto;
    padding: 0 ${appearance === 'full-page' ? FullPagePadding : 0}px;
  `;
};

const fullWidthStyles = ({ appearance }: RendererWrapperProps) => {
  if (appearance !== 'full-width') {
    return '';
  }

  return `
  max-width: ${akEditorFullWidthLayoutWidth}px;
  margin: 0 auto;

  .fabric-editor-breakout-mark,
  .pm-table-container,
  .ak-renderer-extension {
    width: 100% !important;
  }
  `;
};

// prettier-ignore
export const Wrapper = styled.div<RendererWrapperProps & HTMLAttributes<{}>>`
  font-size: ${editorFontSize}px;
  line-height: 24px;
  color: ${themed({ light: colors.N800, dark: '#B8C7E0' })};

  ${fullPageStyles}
  ${fullWidthStyles}

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
    color: ${colors.B400};
    text-decoration: none;

    &:hover {
      color: ${colors.B300};
      text-decoration: underline;
    }
  }

  & span.akActionMark {
    cursor: pointer;
  }

  ${whitespaceSharedStyles};
  ${blockquoteSharedStyles};
  ${headingsSharedStyles};
  ${panelSharedStyles};
  ${ruleSharedStyles};
  ${paragraphSharedStyles};
  ${listsSharedStyles};
  ${indentationSharedStyles};
  ${blockMarksSharedStyles};
  ${codeMarkSharedStyles};
  ${shadowSharedStyle};
  ${dateSharedStyle};
  ${tasksAndDecisionsStyles};

  & .UnknownBlock {
    font-family: ${fontFamily()};
    font-size: ${fontSize()};
    font-weight: 400;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  & span.date-node {
    background: ${colors.N30A};
    border-radius: ${borderRadius()}px;
    color: ${colors.N800};
    padding: 2px 4px;
    margin: 0 1px;
    transition: background 0.3s;
    white-space: nowrap;
  }

  & span.date-node-highlighted {
    background: ${colors.R50};
    color: ${colors.R500};
  }

  & .renderer-image {
    max-width: 100%;
    display: block;
    margin: ${gridSize() * 3}px 0;
  }

  .${mediaSingleClassName}.media-wrapped + .${mediaSingleClassName}:not(.media-wrapped) {
    clear: both;
  }

  & .code-block,
  & blockquote,
  & hr,
  & > div > div:not(.media-wrapped),
  .${mediaSingleClassName}.media-wrapped + .media-wrapped + *:not(.media-wrapped),
  .${mediaSingleClassName}.media-wrapped + div:not(.media-wrapped) {
    clear: both;
  }

  & .media-wrapped {
    & + h1,
    & + h2,
    & + h3,
    & + h4,
    & + h5,
    & + h6 {
      margin-top: 8px;
    }
  }

  & .fabric-editor-block-mark[data-align='end'],
  & .fabric-editor-block-mark[data-align='center'],
  & .fabric-editor-block-mark[data-align='right'] {
    & > h1,
    & > h2,
    & > h3,
    & > h4,
    & > h5,
    & > h6 {
      display: inline-block;
    }
  }

  ${mediaSingleSharedStyle} &
  div[class^='image-wrap-'] + div[class^='image-wrap-'] {
    margin-left: 0;
    margin-right: 0;
  }

  /* Breakout for tables and extensions */
  .${RendererCssClassName.DOCUMENT} > {
    .${TableSharedCssClassName.TABLE_CONTAINER}[data-layout='full-width'],
    .${TableSharedCssClassName.TABLE_CONTAINER}[data-layout='wide'],
    .${RendererCssClassName.EXTENSION}[data-layout='wide'],
    .${RendererCssClassName.EXTENSION}[data-layout='full-width']   {
      margin-left: 50%;
      transform: translateX(-50%);
    }
    * .${TableSharedCssClassName.TABLE_CONTAINER},
    * .${RendererCssClassName.EXTENSION} {
      width: 100% !important;
    }

    * .${RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER} {
      overflow-x: auto;
    }
  }

    .${TableSharedCssClassName.TABLE_NODE_WRAPPER} {
      overflow-x: auto;
    }

  ${tableSharedStyle}

  .${TableSharedCssClassName.TABLE_CONTAINER} {
    z-index: 0;
    transition: all 0.1s linear;

    /** Shadow overrides */
    &.${shadowClassNames.RIGHT_SHADOW}::after, &.${shadowClassNames.LEFT_SHADOW}::before {
      top: ${tableMarginTop - 1}px;
      height: calc(100% - ${tableMarginTop}px);
    }

    table {
      ${tableStyles};
      ${tableSortableColumnStyle};
      margin-left: 0;
      margin-right: 0;
    }

    table tr:first-child td,
    table tr:first-child th {
      position: relative;
    }

    table[data-number-column='true'] {
      .${RendererCssClassName.NUMBER_COLUMN} {
        background-color: ${akEditorTableToolbar};
        border-right: 1px solid ${akEditorTableBorder};
        width: ${akEditorTableNumberColumnWidth}px;
        text-align: center;
        color: ${colors.N200};
        font-size: ${fontSize()}px;
      }
    }
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
