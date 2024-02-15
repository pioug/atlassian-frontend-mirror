import { Token } from 'antlr4ts';
import { RecognitionException } from 'antlr4ts/RecognitionException';
import { IntlShape } from 'react-intl-next';

import { JQLLexer, JQLParser } from '@atlaskit/jql-parser';

import { commonMessages } from '../../../common/messages';
import { lowPriorityTokens } from '../constants';
import { errorMessages } from '../messages';
import {
  getExpectedTokensFromParserOrException,
  getTokenDisplayNames,
} from '../utils';

/**
 * Show the appropriate error message when parsing JQL fails and 0 or more tokens were expected.
 *
 * If no `expectedTokens` were provided then we'll attempt to find viable tokens to suggest from the provided
 * exception/parser state.
 */
export const handleExpectedTokensError = (
  recognizer: JQLParser,
  currentToken: Token,
  expectedTokens: string[],
  intl: IntlShape,
  exception?: RecognitionException,
): string => {
  // If there are no expected autocomplete tokens, then attempt to find viable tokens from the exception/parser.
  if (expectedTokens.length === 0) {
    expectedTokens = getTokenDisplayNames(
      recognizer,
      getExpectedTokensFromParserOrException(recognizer, exception),
    );
  }

  const lowPriorityTokenNames = getTokenDisplayNames(
    recognizer,
    lowPriorityTokens,
  );

  // Only include tokens that are NOT low priority
  const highPriorityTokens = expectedTokens.filter(
    tokenType => !lowPriorityTokenNames.includes(tokenType),
  );

  // If we have any tokens that are high priority then we want to show them (without low priority suggestions).
  if (highPriorityTokens.length > 0) {
    expectedTokens = highPriorityTokens;
  }

  const isEOF = currentToken.type === JQLLexer.EOF;

  if (expectedTokens.length > 1) {
    const firstExpectedTokens = expectedTokens
      .slice(0, -1)
      // Need to wrap tokens in single quotes ourselves as we cannot do it in the message descriptor
      .map(token => `'${token}'`)
      .join(', ');
    const lastExpectedToken = expectedTokens[expectedTokens.length - 1];
    return isEOF
      ? intl.formatMessage(errorMessages.expectingMultipleTokensBeforeEOF, {
          firstExpectedTokens,
          lastExpectedToken,
        })
      : intl.formatMessage(errorMessages.expectingMultipleTokensButReceived, {
          firstExpectedTokens,
          lastExpectedToken,
          received: currentToken.text,
        });
  } else if (expectedTokens.length === 1) {
    return isEOF
      ? intl.formatMessage(errorMessages.expectingTokenBeforeEOF, {
          expectedToken: expectedTokens[0],
        })
      : intl.formatMessage(errorMessages.expectingTokenButReceived, {
          expectedToken: expectedTokens[0],
          received: currentToken.text,
        });
  } else {
    return isEOF
      ? intl.formatMessage(commonMessages.unknownError)
      : intl.formatMessage(errorMessages.unknownErrorAtToken, {
          received: currentToken.text,
        });
  }
};
