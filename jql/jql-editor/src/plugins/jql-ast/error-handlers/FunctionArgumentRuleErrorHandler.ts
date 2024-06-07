import { type Token } from 'antlr4ts';
import { type IntlShape } from 'react-intl-next';

import { JQLLexer } from '@atlaskit/jql-parser';

import { errorMessages } from '../messages';

/**
 * Show the appropriate error message when parsing JQL fails and a function argument rule was expected.
 */
export const handleFunctionArgumentRuleError = (currentToken: Token, intl: IntlShape): string => {
	const isEOF = currentToken.type === JQLLexer.EOF;

	return isEOF
		? intl.formatMessage(errorMessages.expectingFunctionArgBeforeEOF)
		: intl.formatMessage(errorMessages.expectingFunctionArgButReceived, {
				received: currentToken.text,
			});
};
