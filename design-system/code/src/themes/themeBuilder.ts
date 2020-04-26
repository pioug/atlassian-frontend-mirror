import {
  borderRadius,
  codeFontFamily,
  fontSize,
  gridSize,
} from '@atlaskit/theme/constants';
import { ThemeProps } from '@atlaskit/theme/types';

import { defaultColors } from './defaultTheme';

export type Theme = {
  lineNumberColor?: string | number;
  lineNumberBgColor?: string | number;
  backgroundColor?: string | number;
  textColor?: string | number;
  substringColor?: string | number;
  keywordColor?: string | number;
  attributeColor?: string | number;
  selectorTagColor?: string | number;
  docTagColor?: string | number;
  nameColor?: string | number;
  builtInColor?: string | number;
  literalColor?: string | number;
  bulletColor?: string | number;
  codeColor?: string | number;
  additionColor?: string | number;
  regexpColor?: string | number;
  symbolColor?: string | number;
  variableColor?: string | number;
  templateVariableColor?: string | number;
  linkColor?: string | number;
  selectorAttributeColor?: string | number;
  selectorPseudoColor?: string | number;
  typeColor?: string | number;
  stringColor?: string | number;
  selectorIdColor?: string | number;
  selectorClassColor?: string | number;
  quoteColor?: string | number;
  templateTagColor?: string | number;
  deletionColor?: string | number;
  titleColor?: string | number;
  sectionColor?: string | number;
  commentColor?: string | number;
  metaKeywordColor?: string | number;
  metaColor?: string | number;
  functionColor?: string | number;
  numberColor?: string | number;
};

const codeContainerStyle = {
  fontFamily: codeFontFamily,
  fontSize: '12px',
  lineHeight: 20 / 12,
  padding: gridSize(),
};

const lineNumberContainerStyle = (theme: Theme) => ({
  fontSize: `${fontSize()}px`,
  lineHeight: 20 / 14,
  color: theme.lineNumberColor,
  backgroundColor: theme.lineNumberBgColor,
  flexShrink: 0,
  padding: gridSize(),
  textAlign: 'right',
  userSelect: 'none',
});

const sharedCodeStyle = (theme: Theme) => ({
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
    fontFamily: `SFMono-MediumItalic, ${codeFontFamily()}`,
    fontStyle: 'italic',
  },
  'block-comment': {
    color: theme.commentColor,
    fontFamily: `SFMono-MediumItalic, ${codeFontFamily()}`,
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
  addition: {
    color: theme.additionColor,
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
  deletion: {
    color: theme.deletionColor,
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
});

const codeStyle = (theme: Theme) => ({
  fontFamily: codeFontFamily,
  fontSize: '12px',
  background: theme.backgroundColor,
  color: theme.textColor,
  borderRadius: borderRadius(),
  display: 'flex',
  lineHeight: 20 / 12,
  overflowX: 'auto',
  whiteSpace: 'pre',
});

const codeBlockStyle = (theme: Theme) => ({
  'pre[class*="language-"]': codeStyle(theme),
  ...sharedCodeStyle(theme),
});

const inlineCodeStyle = (theme: Theme) => ({
  'pre[class*="language-"]': {
    ...codeStyle(theme),
    padding: '2px 4px',
    display: 'inline',
    whiteSpace: 'pre-wrap',
  },
  ...sharedCodeStyle(theme),
});

export function applyTheme(theme: ThemeProps | Theme = {}) {
  const newTheme = { ...defaultColors(theme), ...theme };
  return {
    lineNumberContainerStyle: lineNumberContainerStyle(newTheme),
    codeBlockStyle: codeBlockStyle(newTheme),
    inlineCodeStyle: inlineCodeStyle(newTheme),
    codeContainerStyle,
  };
}
