/**
 * Splits the provided text by new line characters.
 */
export const splitTextByNewLine = (text: string): string[] =>
  text.split(/(?:\r\n?|\n)/);
