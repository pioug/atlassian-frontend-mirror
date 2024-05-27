import { type Token } from 'antlr4ts';
import { type IntlShape } from 'react-intl-next';

import { JQLLexer } from '@atlaskit/jql-parser';

import { errorMessages } from '../messages';

/**
 * Show the appropriate error message when parsing JQL fails and a field rule was expected.
 */
export const handleFieldRuleError = (
  currentToken: Token,
  intl: IntlShape,
): string => {
  const isEOF = currentToken.type === JQLLexer.EOF;

  if (currentToken.type === JQLLexer.LBRACKET) {
    return intl.formatMessage(errorMessages.expectingCFButReceived);
  }
  return isEOF
    ? intl.formatMessage(errorMessages.expectingFieldBeforeEOF)
    : intl.formatMessage(errorMessages.expectingFieldButReceived, {
        received: currentToken.text,
      });
};
