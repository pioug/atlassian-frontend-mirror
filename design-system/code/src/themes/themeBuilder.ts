import type { CSSObject } from '@emotion/core';

import {
  borderRadius,
  codeFontFamily,
  gridSize,
} from '@atlaskit/theme/constants';
import type { ThemeProps } from '@atlaskit/theme/types';

import {
  CODE_FONT_SIZE,
  CODE_LINE_HEIGHT,
  VAR_CODE_FONT_FAMILY,
  VAR_CODE_FONT_FAMILY_ITALIC,
  VAR_CODE_LINE_NUMBER_BG_COLOR,
} from './constants';
import { defaultColors } from './defaultTheme';
import type { CodeBlockTheme, CodeTheme } from './types';

export const getLineNumWidth = (numLines: number) => {
  if (!numLines) {
    return '1ch';
  }

  return `${numLines.toFixed(0).length}ch`;
};

// applied to the main parent of the react-syntax-highlighter
const codeContainerStyle = (hasLineNumbers?: boolean) => ({
  padding: hasLineNumbers ? `${gridSize()}px 0` : gridSize(),
});

const lineNumberStyle = (theme: CodeBlockTheme): CSSObject => ({
  // need this for margins
  fontFamily: `var(${VAR_CODE_FONT_FAMILY}) !important`,
  // width of the line number gutter
  minWidth: `calc(${theme.lineNumberWidth} + ${gridSize() * 2}px)`,
  // this needs to be important or it gets overwritten by inline styles
  fontStyle: 'normal !important',
  // this needs to be important or it gets overwritten by inline styles
  color: `${theme.lineNumberColor} !important`,
  flexShrink: 0,
  // needed to replicate existing design spec
  boxSizing: 'border-box',
  paddingRight: gridSize(),
  paddingLeft: gridSize(),
  marginRight: gridSize(),
  textAlign: 'right',
  userSelect: 'none',
  // this is to fix SSR spacing issue
  display: 'block',
});

const sharedCodeStyle = (theme: CodeTheme) => ({
  key: {
    color: theme.keywordColor,
    fontWeight: 'bolder',
  },
  keyword: {
    color: theme.keywordColor,
    fontWeight: 'bolder',
  },
  'attr-name': {
    color: theme.attributeColor,
  },
  selector: {
    color: theme.selectorTagColor,
  },
  comment: {
    color: theme.commentColor,
    fontFamily: `var(${VAR_CODE_FONT_FAMILY_ITALIC})`,
    fontStyle: 'italic',
  },
  'block-comment': {
    color: theme.commentColor,
    fontFamily: `var(${VAR_CODE_FONT_FAMILY_ITALIC})`,
    fontStyle: 'italic',
  },
  'function-name': {
    color: theme.sectionColor,
  },
  'class-name': {
    color: theme.sectionColor,
  },
  doctype: {
    color: theme.docTagColor,
  },
  substr: {
    color: theme.substringColor,
  },
  namespace: {
    color: theme.nameColor,
  },
  builtin: {
    color: theme.builtInColor,
  },
  entity: {
    color: theme.literalColor,
  },
  bullet: {
    color: theme.bulletColor,
  },
  code: {
    color: theme.codeColor,
  },
  regex: {
    color: theme.regexpColor,
  },
  symbol: {
    color: theme.symbolColor,
  },
  variable: {
    color: theme.variableColor,
  },
  url: {
    color: theme.linkColor,
  },
  'selector-attr': {
    color: theme.selectorAttributeColor,
  },
  'selector-pseudo': {
    color: theme.selectorPseudoColor,
  },
  type: {
    color: theme.typeColor,
  },
  string: {
    color: theme.stringColor,
  },
  quote: {
    color: theme.quoteColor,
  },
  tag: {
    color: theme.templateTagColor,
  },
  title: {
    color: theme.titleColor,
  },
  section: {
    color: theme.sectionColor,
  },
  'meta-keyword': {
    color: theme.metaKeywordColor,
  },
  meta: {
    color: theme.metaColor,
  },
  italic: {
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: 'bolder',
  },
  function: {
    color: theme.functionColor,
  },
  number: {
    color: theme.numberColor,
  },
  'attr-value': {
    color: theme.attributeColor,
  },
  prolog: {
    color: theme.prologColor,
  },
  cdata: {
    color: theme.cdataColor,
  },
  punctuation: {
    color: theme.punctuationColor,
  },
  property: {
    color: theme.propertyColor,
  },
  constant: {
    color: theme.constantColor,
  },
  deleted: {
    color: theme.deletedColor,
  },
  boolean: {
    color: theme.booleanColor,
  },
  char: {
    color: theme.charColor,
  },
  inserted: {
    color: theme.insertedColor,
  },
  operator: {
    color: theme.operatorColor,
  },
  atrule: {
    color: theme.atruleColor,
  },
  important: {
    color: theme.importantColor,
    fontWeight: 'bold',
  },
});

// NB. applied on the 'pre' tag or equivalent
const codeStyle = (theme: CodeTheme): CSSObject => ({
  fontSize: theme.codeFontSize || CODE_FONT_SIZE,
  lineHeight: theme.codeLineHeight || CODE_LINE_HEIGHT,
  [VAR_CODE_FONT_FAMILY]: codeFontFamily(),
  [VAR_CODE_FONT_FAMILY_ITALIC]: `SFMono-MediumItalic, var(${VAR_CODE_FONT_FAMILY})`,
  fontFamily: `var(${VAR_CODE_FONT_FAMILY})`,
  backgroundColor: theme.backgroundColor,
  color: theme.textColor,
  borderRadius: borderRadius(),
  display: 'flex',
  overflowX: 'auto',
  whiteSpace: 'pre',
});

const codeBlockStyle = (theme: CodeBlockTheme) => ({
  'pre[class*="language-"]': codeStyle(theme),
  ...sharedCodeStyle(theme),
});

const inlineCodeStyle = (theme: CodeTheme) => ({
  'pre[class*="language-"]': {
    ...codeStyle(theme),
    padding: '2px 4px',
    display: 'inline',
    whiteSpace: 'pre-wrap',
  },
  ...sharedCodeStyle(theme),
});

/**
 * Allows us to inject external selectors into the component.
 * Used outside the normal <pre /> tag.
 */
const codeLayoutContainer = (theme: CodeBlockTheme) => (
  highlightedStartText: string,
  highlightedEndText: string,
  hasLineNumbers?: boolean,
) => {
  const lineNumberThemeStyle = lineNumberStyle(theme);
  return {
    [VAR_CODE_LINE_NUMBER_BG_COLOR]: theme.lineNumberBgColor,
    // this is to account for SSR spacing issue once loaded in browser
    '& .linenumber': {
      ...lineNumberThemeStyle,
      display: 'inline-block !important',
    },
    // these styles are for line highlighting
    '& [data-ds--code--row]': {
      display: 'block',
      paddingRight: `${gridSize()}px !important`,
      marginRight: `-${gridSize()}px`,
    },
    '& [data-ds--code--row--highlight]': {
      background: `${theme.highlightedLineBgColor}`,

      '&::before, &::after': {
        clipPath: 'inset(100%)',
        clip: 'rect(1px, 1px, 1px, 1px)',
        height: '1px',
        overflow: 'hidden',
        position: 'absolute',
        whiteSpace: 'nowrap',
        width: '1px',
      },
      '&::before': {
        content: `", ${highlightedStartText}, "`,
      },
      '&::after': {
        content: `", ${highlightedEndText}, "`,
      },
    },
    '& [data-ds--code--row--highlight] .linenumber': {
      borderLeft: `4px solid ${theme.highlightedLineBorderColor}`,
      paddingLeft: `${gridSize() / 2}px !important`,
      position: 'relative',
    },
    // fill in space caused by parent border top
    '& [data-ds--code--row--highlight] .linenumber::before': {
      content: '""',
      position: 'absolute',
      width: '4px',
      top: '-1px',
      left: '-4px',
      borderTop: `1px solid ${theme.highlightedLineBorderColor}`,
    },
    '[data-ds--code--row--highlight] + [data-ds--code--row]:not([data-ds--code--row--highlight]), [data-ds--code--row]:not([data-ds--code--row--highlight]) + [data-ds--code--row--highlight]': {
      borderTop: '1px dashed transparent',
    },
    '[data-ds--code--row--highlight]:last-child': {
      borderBottom: '1px dashed transparent',
    },
    '& code:first-of-type': {
      paddingRight: `0px !important`,
      backgroundImage: hasLineNumbers
        ? `linear-gradient(to right, var(${VAR_CODE_LINE_NUMBER_BG_COLOR}), var(${VAR_CODE_LINE_NUMBER_BG_COLOR})
        calc(${theme.lineNumberWidth} + ${
            2 * gridSize()
          }px), transparent calc(${theme.lineNumberWidth} + ${
            2 * gridSize()
          }px), transparent)`
        : undefined,
    },
    // we need to use last-of-type because when Code is SSR'd
    // 2 <code> elements are created and we don't want this style
    // applied to the first one
    '& code:last-of-type': {
      paddingRight: `${gridSize()}px !important`,
      flex: '1 0 auto',
    },
  };
};

export function applyTheme(
  theme: ThemeProps | CodeTheme | CodeBlockTheme = {},
  maxLines?: number,
) {
  const newTheme = {
    ...defaultColors(theme),
    lineNumberWidth: maxLines ? getLineNumWidth(maxLines) : undefined,
    ...theme,
  };
  return {
    lineNumberStyle: lineNumberStyle(newTheme),
    codeBlockStyle: codeBlockStyle(newTheme),
    inlineCodeStyle: inlineCodeStyle(newTheme),
    codeLayoutContainer: codeLayoutContainer(newTheme),
    codeContainerStyle,
  };
}
