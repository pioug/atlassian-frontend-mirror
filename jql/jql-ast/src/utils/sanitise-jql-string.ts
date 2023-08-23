import escapeRegExp from 'lodash/escapeRegExp';

// Derived from JQLLexer#VALID_UNQUOTED_CHARS
const CHARS_TO_QUOTE = new RegExp(
  `[\\s${escapeRegExp(`"'=!<>()~,[]|&{}*/%+^$#@?;`)}]`,
);

/**
 * Quote the provided JQL string (and escape any existing quotes) if the input string uses reserved characters.
 *
 * @param jqlString String to sanitise
 */
export const sanitiseJqlString = (jqlString: string): string => {
  if (CHARS_TO_QUOTE.test(jqlString)) {
    return `"${jqlString.replace(/"/g, '\\"')}"`;
  }
  return jqlString;
};
