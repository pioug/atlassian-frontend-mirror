import { Dictionary, TransformedToken } from 'style-dictionary';

/**
 * Safely retrieves token values, accounting for the possibility for
 * token references/aliases
 */
export function getValue(dictionary: Dictionary, token: TransformedToken) {
  return dictionary.usesReference(token)
    ? dictionary.getReferences(token)[0].value
    : token.value;
}
