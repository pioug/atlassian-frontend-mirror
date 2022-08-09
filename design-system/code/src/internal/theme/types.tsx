export interface CodeTheme {
  backgroundColor?: string;
  textColor?: string;
  fontFamilyItalic?: string;
  fontFamily?: string;
  lineNumberColor?: string;
  lineNumberBgColor?: string;
}

export interface CodeBlockTheme extends CodeTheme {
  substringColor?: string;
  keywordColor?: string;
  attributeColor?: string;
  selectorTagColor?: string;
  docTagColor?: string;
  nameColor?: string;
  builtInColor?: string;
  literalColor?: string;
  bulletColor?: string;
  codeColor?: string;
  additionColor?: string;
  regexpColor?: string;
  symbolColor?: string;
  variableColor?: string;
  templateVariableColor?: string;
  linkColor?: string;
  selectorAttributeColor?: string;
  selectorPseudoColor?: string;
  typeColor?: string;
  stringColor?: string;
  selectorIdColor?: string;
  selectorClassColor?: string;
  quoteColor?: string;
  templateTagColor?: string;
  deletionColor?: string;
  titleColor?: string;
  sectionColor?: string;
  commentColor?: string;
  metaKeywordColor?: string;
  metaColor?: string;
  functionColor?: string;
  numberColor?: string;
  prologColor?: string;
  cdataColor?: string;
  punctuationColor?: string;
  propertyColor?: string;
  constantColor?: string;
  deletedColor?: string;
  booleanColor?: string;
  charColor?: string;
  insertedColor?: string;
  operatorColor?: string;
  atruleColor?: string;
  importantColor?: string;
  highlightedLineBgColor?: string;
  highlightedLineBorderColor?: string;
  lineNumberWidth?: string | number;
}
