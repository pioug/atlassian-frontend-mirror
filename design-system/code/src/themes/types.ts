export type CodeTheme = {
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

export interface CodeBlockTheme extends CodeTheme {
  lineNumberColor?: string | number;
  lineNumberBgColor?: string | number;
}
