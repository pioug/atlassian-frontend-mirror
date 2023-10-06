const COLOR_PROPERTIES = [
  'color',
  'background',
  'background-color',
  'box-shadow',
  'border',
  'border-left',
  'border-right',
  'border-top',
  'border-bottom',
  'border-color',
  'border-left-color',
  'border-right-color',
  'border-top-color',
  'border-bottom-color',
  'outline',
  'outline-color',
  'accent-color',
  'caret-color',
  'scrollbar-color',
  'text-stroke',
] as const;

export function isColorRelatedProperty(prop: string) {
  return COLOR_PROPERTIES.some((property) => property === prop);
}

export function isCssDeclaration(prop: string) {
  return prop.startsWith('--');
}

export function extractCssVarName(prop: string) {
  return prop.substring(prop.indexOf('(') + 1).split(/\,|\)/)[0];
}

export function extractLessVarName(prop: string) {
  return prop.substring(1);
}

export function splitCssValue(value: string) {
  const regex = /(?:[^\s()]+|\((?:[^()]+|\([^()]*\))*\))+/g;
  return value.match(regex);
}
