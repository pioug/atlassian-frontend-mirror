import { type Token } from 'antlr4ts';
import { type IntlShape } from 'react-intl-next';

import { JQLLexer } from '@atlaskit/jql-parser';

import { errorMessages } from '../messages';

/**
 * Show the appropriate error message when parsing JQL fails and a field property ID rule was expected.
 */
export const handleFieldPropertyIdRuleError = (
  currentToken: Token,
  intl: IntlShape,
): string => {
  const isEOF = currentToken.type === JQLLexer.EOF;

  return isEOF
    ? intl.formatMessage(errorMessages.expectingFieldPropertyIdBeforeEOF)
    : intl.formatMessage(errorMessages.expectingFieldPropertyIdButReceived, {
        received: currentToken.text,
      });
};
