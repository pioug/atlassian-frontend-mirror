import { MutableRefObject } from 'react';

import {
  DefaultErrorStrategy,
  FailedPredicateException,
  InputMismatchException,
  Parser,
  Token,
} from 'antlr4ts';
import { NoViableAltException } from 'antlr4ts/NoViableAltException';
import { RecognitionException } from 'antlr4ts/RecognitionException';
import padStart from 'lodash/padStart';
import { IntlShape } from 'react-intl-next';

import { normaliseJqlString } from '@atlaskit/jql-ast';
import { JQLAutocomplete } from '@atlaskit/jql-autocomplete';
import { JQLLexer, JQLParser } from '@atlaskit/jql-parser';

import { ignoredTokens, preferredRules } from './constants';
import { handleCustomFieldRuleError } from './error-handlers/CustomFieldRuleErrorHandler';
import { handleExpectedTokensError } from './error-handlers/ExpectedTokensErrorHandler';
import { handleFieldPropertyIdRuleError } from './error-handlers/FieldPropertyIdErrorHandler';
import { handleFieldRuleError } from './error-handlers/FieldRuleErrorHandler';
import { handleFunctionArgumentRuleError } from './error-handlers/FunctionArgumentRuleErrorHandler';
import { handleOperandRuleError } from './error-handlers/OperandRuleErrorHandler';
import { handleOperatorRuleError } from './error-handlers/OperatorRuleErrorHandler';
import { errorMessages } from './messages';
import { getExpectedTokensFromParserOrException } from './utils';

const isEscape = (char: string | void) => char === '\\';

export const getPrintableChar = (char: string) => {
  const hex = char.charCodeAt(0).toString(16).toUpperCase();
  return `U+${padStart(hex, 4, '0')}`;
};

export const getJavaCodeFromChar = (char: string) => {
  const hex = char.charCodeAt(0).toString(16);
  return `\\u${padStart(hex, 4, '0')}`;
};

export default class JQLEditorErrorStrategy extends DefaultErrorStrategy {
  intlRef: MutableRefObject<IntlShape>;

  constructor(intlRef: MutableRefObject<IntlShape>) {
    super();
    this.intlRef = intlRef;
  }

  protected reportInputMismatch(
    recognizer: JQLParser,
    exception: InputMismatchException,
  ): void {
    this.handleSyntaxError(recognizer, recognizer.currentToken, exception);
  }

  protected reportUnwantedToken(recognizer: JQLParser): void {
    if (this.inErrorRecoveryMode(recognizer)) {
      return;
    }
    this.beginErrorCondition(recognizer);
    this.handleSyntaxError(recognizer, recognizer.currentToken);
  }

  protected reportMissingToken(recognizer: JQLParser): void {
    if (this.inErrorRecoveryMode(recognizer)) {
      return;
    }
    this.beginErrorCondition(recognizer);

    // This is called when single token insertion is a viable recovery strategy for the error. In this case we can
    // use expected tokens from the parser to display an error to the user. If there are no viable tokens to show then
    // we should fallback to syntax error handling.
    if (getExpectedTokensFromParserOrException(recognizer).length > 0) {
      const message = handleExpectedTokensError(
        recognizer,
        recognizer.currentToken,
        // We want to derive expectedTokens from the parser state
        [],
        this.intlRef.current,
      );

      recognizer.notifyErrorListeners(
        message,
        recognizer.currentToken,
        undefined,
      );
    } else {
      this.handleSyntaxError(recognizer, recognizer.currentToken);
    }
  }

  protected reportNoViableAlternative(
    recognizer: JQLParser,
    exception: NoViableAltException,
  ): void {
    // There are some cases, like "status was", where parser is unable to provide viable alternatives for current
    // token, but autocomplete engine is still able to provide meaningful suggestions at offending token index
    const currentToken =
      exception?.getOffendingToken() ?? recognizer.currentToken;
    this.handleSyntaxError(recognizer, currentToken, exception);
  }

  protected reportFailedPredicate(
    recognizer: Parser,
    e: FailedPredicateException,
  ): void {
    // TODO: Don't know how to produce this error. Monitor if this happens and defer to default implementation
    super.reportFailedPredicate(recognizer, e);
  }

  private handleSyntaxError(
    recognizer: JQLParser,
    currentToken: Token,
    exception?: RecognitionException,
  ): void {
    let message;

    switch (currentToken.type) {
      /*
       * This is called when ANTLR finds a character that the grammar does not recognise. The grammar lexer uses
       * a DFA to decide if a character is in error or not. This can mean that legal characters come as an error
       * because they do not form a valid token. Because of this we have to do some extra checks here.
       */
      case JQLLexer.ERRORCHAR:
      case JQLLexer.INVALID_QUOTE_STRING:
      case JQLLexer.INVALID_SQUOTE_STRING: {
        let currentText = currentToken.text;

        // These tokens are returned when an illegal character appears at the end of a quote string, but the token
        // includes the entire quoted text. We take the last character from our text as that's the offending token.
        if (
          currentToken.type === JQLLexer.INVALID_QUOTE_STRING ||
          currentToken.type === JQLLexer.INVALID_SQUOTE_STRING
        ) {
          currentText = currentText?.slice(-1);
        }

        // This can happen (e.g. comment ~ \)
        if (isEscape(currentText)) {
          const nextToken = recognizer.inputStream.get(
            currentToken.tokenIndex + 1,
          );
          if (
            nextToken.type === JQLLexer.MATCHWS ||
            nextToken.type === JQLLexer.EOF
          ) {
            message = this.intlRef.current.formatMessage(
              errorMessages.illegalEscapeBlank,
            );
          } else {
            // Show the escaped character sequence in the message
            const received = `${currentText ?? ''}${nextToken.text ?? ''}`;
            message = this.intlRef.current.formatMessage(
              errorMessages.illegalEscape,
              {
                received,
              },
            );
          }
        } else {
          message = this.intlRef.current.formatMessage(
            errorMessages.illegalChar,
            {
              char: getPrintableChar(currentText ?? ''),
              escapedChar: getJavaCodeFromChar(currentText ?? ''),
            },
          );
        }
        break;
      }
      // Special tokens that get created every time there is an unfinished string (i.e. without matching closing quote)
      case JQLLexer.UNCLOSED_QUOTE_STRING:
      case JQLLexer.UNCLOSED_SQUOTE_STRING: {
        const received = normaliseJqlString(currentToken.text ?? '');
        if (received === '') {
          message = this.intlRef.current.formatMessage(
            errorMessages.unfinishedStringBlank,
          );
        } else {
          message = this.intlRef.current.formatMessage(
            errorMessages.unfinishedString,
            {
              received,
            },
          );
        }
        break;
      }
      case JQLLexer.RESERVED_WORD: {
        message = this.intlRef.current.formatMessage(
          errorMessages.reservedWord,
          {
            word: currentToken.text,
          },
        );
        break;
      }
      case JQLLexer.ERROR_RESERVED: {
        message = this.intlRef.current.formatMessage(
          errorMessages.reservedChar,
          {
            char: currentToken.text,
            escapedChar: getJavaCodeFromChar(currentToken.text ?? ''),
          },
        );
        break;
      }
      default: {
        const autocomplete = JQLAutocomplete.fromParser(
          recognizer,
          ignoredTokens,
          preferredRules,
          new Set<number>(),
        );

        const { tokens, rules } = autocomplete.getJQLSuggestionsForTokenIndex(
          currentToken.tokenIndex,
        );

        if (
          rules.value ||
          rules.list ||
          // Restrict function rules to only be shown if we are currently INSIDE a function rule. Otherwise this error
          // message would be shown for incomplete tokens following an operand, e.g. `status = open ord`.
          (rules.function &&
            recognizer.context.ruleIndex === JQLParser.RULE_jqlFunction)
        ) {
          message = handleOperandRuleError(
            recognizer,
            currentToken,
            tokens.values,
            rules,
            this.intlRef.current,
            exception,
          );
        } else if (tokens.values.includes('EMPTY')) {
          message = handleExpectedTokensError(
            recognizer,
            currentToken,
            tokens.values,
            this.intlRef.current,
            exception,
          );
        } else if (rules.operator) {
          message = handleOperatorRuleError(currentToken, this.intlRef.current);
        } else if (rules.field) {
          message = handleFieldRuleError(currentToken, this.intlRef.current);
        } else if (rules.customField) {
          message = handleCustomFieldRuleError(this.intlRef.current);
        }
        // Restrict field property rules to only be shown if we are currently INSIDE a field property. Otherwise this
        // error message would be shown for incomplete tokens following a field, e.g. `ORDER BY issuetype as`.
        else if (
          rules.fieldProperty &&
          recognizer.context.ruleIndex === JQLParser.RULE_jqlFieldProperty
        ) {
          // Shows the correct message when a field property rule hasn't been completed, e.g. `issuetype[abc!`
          message = handleExpectedTokensError(
            recognizer,
            currentToken,
            // We want to derive expectedTokens from the exception/parser state
            [],
            this.intlRef.current,
            exception,
          );
        } else if (rules.fieldPropertyId) {
          message = handleFieldPropertyIdRuleError(
            currentToken,
            this.intlRef.current,
          );
        } else if (rules.functionArgument) {
          message = handleFunctionArgumentRuleError(
            currentToken,
            this.intlRef.current,
          );
        } else {
          message = handleExpectedTokensError(
            recognizer,
            currentToken,
            tokens.values,
            this.intlRef.current,
            exception,
          );
        }
        break;
      }
    }

    recognizer.notifyErrorListeners(message, currentToken, undefined);
  }
}
