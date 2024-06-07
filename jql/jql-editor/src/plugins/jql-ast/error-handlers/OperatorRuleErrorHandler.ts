import { type Token } from 'antlr4ts';
import { type IntlShape } from 'react-intl-next';

import { JQLLexer } from '@atlaskit/jql-parser';

import { errorMessages } from '../messages';

// TODO: Figure out if we can show a message without hardcoded operators
/**
 * Show the appropriate error message when parsing JQL fails and an operator rule was expected.
 */
export const handleOperatorRuleError = (currentToken: Token, intl: IntlShape): string => {
	const isEOF = currentToken.type === JQLLexer.EOF;

	return isEOF
		? intl.formatMessage(errorMessages.expectingOperatorBeforeEOF)
		: intl.formatMessage(errorMessages.expectingOperatorButReceived, {
				received: currentToken.text,
			});
};
