export const bidiCharacterRegex = /[\u202A-\u202E\u2066-\u2069]/g;

/**
 * __Code Bidi Warning Decorator__
 *
 * Checks the code to see if it contains any bidi characters.
 * In case if bidi characters found - returns children with decorated
 * bidi characters. If no bidi characters found - original text returned.
 */
export default function codeBidiWarningDecorator<DecoratorOutput>(
  originalText: string,
  decorate: (options: {
    bidiCharacter: string;
    index?: number;
  }) => DecoratorOutput,
) {
  const matches = [...originalText.matchAll(bidiCharacterRegex)];

  if (matches.length === 0) {
    // No matches encountered, so we return the originalText value
    return originalText;
  }

  let children = [];
  let mappedTo = 0;

  for (const match of matches) {
    if (mappedTo !== match.index) {
      // There were unmatched characters prior to this match which haven't been
      // mapped to the children.
      // Add them as plain text.
      children.push(originalText.substring(mappedTo, match.index));
    }

    children.push(decorate({ bidiCharacter: match[0], index: match.index }));

    // While index is guaranteed to be present, it needs to be asserted due
    // to a limitation of typescripts regex handling
    //
    // https://github.com/microsoft/TypeScript/issues/36788
    // Decorate bidi character
    mappedTo = match.index! + match[0].length;
  }

  if (mappedTo !== originalText.length) {
    // There is text following the final match, which needs to be mapped
    // to the children.
    // Added as plain text.
    children.push(originalText.substring(mappedTo, originalText.length));
  }

  // return the mapped children with decorated bidi characters
  return children;
}
