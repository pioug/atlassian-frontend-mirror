import { type Token } from 'antlr4ts';
import { type RecognitionException } from 'antlr4ts/RecognitionException';
import { type IntlShape } from 'react-intl-next';

import { type JQLRuleSuggestions } from '@atlaskit/jql-autocomplete';
import { JQLLexer, type JQLParser } from '@atlaskit/jql-parser';

import { errorMessages } from '../messages';
import { getExpectedTokensFromParserOrException, getTokenDisplayNames } from '../utils';

import { handleExpectedTokensError } from './ExpectedTokensErrorHandler';

/**
 * Show the appropriate error message when parsing JQL fails and an operand rule was expected.
 */
export const handleOperandRuleError = (
	recognizer: JQLParser,
	currentToken: Token,
	expectedTokens: string[],
	rules: JQLRuleSuggestions,
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

	const isEOF = currentToken.type === JQLLexer.EOF;

	if (rules.value && rules.list && rules.function) {
		return isEOF
			? intl.formatMessage(errorMessages.expectingOperandBeforeEOF)
			: intl.formatMessage(errorMessages.expectingOperandButReceived, {
					received: currentToken.text,
				});
	}

	if (rules.value && rules.function) {
		return isEOF
			? intl.formatMessage(errorMessages.expectingValueOrFunctionBeforeEOF)
			: intl.formatMessage(errorMessages.expectingValueOrFunctionButReceived, {
					received: currentToken.text,
				});
	}

	if (rules.list && rules.function) {
		// Lists and functions are the only operands that contain structural tokens (i.e. LPAREN, RPAREN and COMMA).
		// So, if there are specific expected tokens, we prioritize those over generic rule messages.
		if (expectedTokens.length) {
			return handleExpectedTokensError(recognizer, currentToken, expectedTokens, intl, exception);
		}
		return isEOF
			? intl.formatMessage(errorMessages.expectingListOrFunctionBeforeEOF)
			: intl.formatMessage(errorMessages.expectingListOrFunctionButReceived, {
					received: currentToken.text,
				});
	}

	// Value or list combination is not possible with current grammar definition

	if (rules.function) {
		// Lists and functions are the only operands that contain structural tokens (i.e. LPAREN, RPAREN and COMMA).
		// So, if there are specific expected tokens, we prioritize those over generic rule messages.
		if (expectedTokens.length) {
			return handleExpectedTokensError(recognizer, currentToken, expectedTokens, intl, exception);
		}
		return isEOF
			? intl.formatMessage(errorMessages.expectingFunctionBeforeEOF)
			: intl.formatMessage(errorMessages.expectingFunctionButReceived, {
					received: currentToken.text,
				});
	}

	if (rules.list) {
		// Lists and functions are the only operands that contain structural tokens (i.e. LPAREN, RPAREN and COMMA).
		// So, if there are specific expected tokens, we prioritize those over generic rule messages.
		if (expectedTokens.length) {
			return handleExpectedTokensError(recognizer, currentToken, expectedTokens, intl, exception);
		}
		return isEOF
			? intl.formatMessage(errorMessages.expectingListBeforeEOF)
			: intl.formatMessage(errorMessages.expectingListButReceived, {
					received: currentToken.text,
				});
	}

	return isEOF
		? intl.formatMessage(errorMessages.expectingValueBeforeEOF)
		: intl.formatMessage(errorMessages.expectingValueButReceived, {
				received: currentToken.text,
			});
};
