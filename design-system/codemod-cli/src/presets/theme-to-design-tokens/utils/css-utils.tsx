import { isColorRelatedProperty } from '../../css-to-design-tokens/lib/declaration';

export function containsReplaceableCSSDeclarations(input: string) {
  const cssPattern = /(\S+)\s*:/g;

  let match;
  while ((match = cssPattern.exec(input)) !== null) {
    if (isColorRelatedProperty(match[1])) {
      return true;
    }
  }
  return false;
}

export function findEndIndexOfCSSExpression(
  text: string,
  isAtEndOfInput: boolean,
): number | null {
  // CSS expression can end *on* a semicolon or *before* a brace. In either
  // case we treat the remaining part of the value to cover one character
  // before that symbol.
  const semicolonIndex = text.indexOf(';');
  const braceIndex = text.indexOf('}');

  if (semicolonIndex === -1 && braceIndex === -1) {
    if (isAtEndOfInput) {
      return text.length;
    } else {
      return null;
    }
  } else if (semicolonIndex === -1) {
    return braceIndex - 1;
  } else if (braceIndex === -1) {
    return semicolonIndex - 1;
  } else {
    return Math.min(semicolonIndex, braceIndex) - 1;
  }
}
