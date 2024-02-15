import { defineMessages } from 'react-intl-next';

export const errorMessages = defineMessages({
  expectingOperatorButReceived: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingOperatorButReceived',
    defaultMessage:
      "Expecting an operator but got ''{received}''. The valid operators are '=', '!=', '<', '>', '<=', '>=', '~', '!~', 'IN', 'NOT IN', 'IS' and 'IS NOT'.",
    description:
      'When an operator was expected but another token was received.',
  },
  expectingOperatorBeforeEOF: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingOperatorBeforeEOF',
    defaultMessage:
      "Expecting an operator before the end of the query. The valid operators are '=', '!=', '<', '>', '<=', '>=', '~', '!~', 'IN', 'NOT IN', 'IS' and 'IS NOT'.",
    description: 'When an operator was expected before the end of the query.',
  },
  expectingFieldButReceived: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingFieldButReceived',
    defaultMessage:
      "Expecting a field name but got ''{received}''. You must surround ''{received}'' in quotation marks to use it as a field name.",
    description: 'When a field was expected but another token was received.',
  },
  expectingFieldBeforeEOF: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingFieldBeforeEOF',
    defaultMessage: 'Expecting a field name before the end of the query.',
    description: 'When a field was expected before the end of the query.',
  },
  expectingCFButReceived: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingCFButReceived',
    defaultMessage: "Expecting a field name but got '['. Did you mean 'cf['?",
    description: `When a field was expected but a left bracket was received without a 'cf' prefix.`,
  },
  expectingCustomFieldId: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingCustomFieldId',
    defaultMessage: `Expecting a custom field id enclosed by '[ ]' after 'cf'. Example: 'cf[10021]'.`,
    description:
      'When a custom field id was expected before the end of the query. Text wrapped in single quotes in our message refer to specific tokens in the query so they should not be translated.',
  },
  expectingOperandButReceived: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingOperandButReceived',
    defaultMessage:
      "Expecting either a value, list or function but got ''{received}''. You must surround ''{received}'' in quotation marks to use it as a value.",
    description: 'When an operand was expected but another token was received.',
  },
  expectingOperandBeforeEOF: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingOperandBeforeEOF',
    defaultMessage:
      'Expecting either a value, list or function before the end of the query.',
    description: 'When an operand was expected before the end of the query.',
  },
  expectingValueOrFunctionButReceived: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingValueOrFunctionButReceived',
    defaultMessage:
      "Expecting a value or function but got ''{received}''. You must surround ''{received}'' in quotation marks to use it as a value.",
    description:
      'When a value or function was expected but another token was received.',
  },
  expectingValueOrFunctionBeforeEOF: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingValueOrFunctionBeforeEOF',
    defaultMessage:
      'Expecting a value or function before the end of the query.',
    description:
      'When a value or function was expected before the end of the query.',
  },
  expectingListOrFunctionButReceived: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingListOrFunctionButReceived',
    defaultMessage:
      "Expecting a list or function but got ''{received}''. You must surround ''{received}'' in quotation marks to use it as a value.",
    description:
      'When a list or function was expected but another token was received.',
  },
  expectingListOrFunctionBeforeEOF: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingListOrFunctionBeforeEOF',
    defaultMessage: 'Expecting a list or function before the end of the query.',
    description:
      'When a list or function was expected before the end of the query.',
  },
  expectingValueButReceived: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingValueButReceived',
    defaultMessage:
      "Expecting a value but got ''{received}''. You must surround ''{received}'' in quotation marks to use it as a value.",
    description: 'When a value was expected but another token was received.',
  },
  expectingValueBeforeEOF: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingValueBeforeEOF',
    defaultMessage: 'Expecting a value before the end of the query.',
    description: 'When a value was expected before the end of the query.',
  },
  expectingListButReceived: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingListButReceived',
    defaultMessage:
      "Expecting a list but got ''{received}''. You must surround ''{received}'' in quotation marks to use it as a value.",
    description: 'When a list was expected but another token was received.',
  },
  expectingListBeforeEOF: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingListBeforeEOF',
    defaultMessage: 'Expecting a list before the end of the query.',
    description: 'When a list was expected before the end of the query.',
  },
  expectingFunctionButReceived: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingFunctionButReceived',
    defaultMessage:
      "Expecting a function but got ''{received}''. You must surround ''{received}'' in quotation marks to use it as a value.",
    description: 'When a function was expected but another token was received.',
  },
  expectingFunctionBeforeEOF: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingFunctionBeforeEOF',
    defaultMessage: 'Expecting a function before the end of the query.',
    description: 'When a function was expected before the end of the query.',
  },
  expectingFieldPropertyIdButReceived: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingFieldPropertyIdButReceived',
    defaultMessage:
      "Expecting a property id but got ''{received}''. You must surround ''{received}'' in quotation marks to use it as a value.",
    description:
      'When a field property ID was expected but another token was received.',
  },
  expectingFieldPropertyIdBeforeEOF: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingFieldPropertyIdBeforeEOF',
    defaultMessage: 'Expecting a property id before the end of the query.',
    description:
      'When a field property ID was expected before the end of the query.',
  },
  expectingFunctionArgButReceived: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingFunctionArgButReceived',
    defaultMessage:
      "Expecting a function argument but got ''{received}''. You must surround ''{received}'' in quotation marks to use it as a value.",
    description:
      'When a function argument was expected but another token was received.',
  },
  expectingFunctionArgBeforeEOF: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingFunctionArgBeforeEOF',
    defaultMessage:
      'Expecting a function argument before the end of the query.',
    description:
      'When a function argument was expected before the end of the query.',
  },
  expectingMultipleTokensButReceived: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingMultipleTokensButReceived',
    defaultMessage:
      "Expecting {firstExpectedTokens} or ''{lastExpectedToken}'' but got ''{received}''.",
    description:
      'When the text the user entered does not match any of the expected tokens.',
  },
  expectingMultipleTokensBeforeEOF: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingMultipleTokensBeforeEOF',
    defaultMessage:
      "Expecting {firstExpectedTokens} or ''{lastExpectedToken}'' before the end of the query.",
    description:
      'When there are still tokens expected before the query can end.',
  },
  expectingTokenButReceived: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingTokenButReceived',
    defaultMessage: "Expecting ''{expectedToken}'' but got ''{received}''.",
    description:
      'When the text the user entered does not match the expected tokens.',
  },
  expectingTokenBeforeEOF: {
    id: 'jql-editor.plugins.jql-ast.error-messages.expectingTokenBeforeEOF',
    defaultMessage:
      "Expecting ''{expectedToken}'' before the end of the query.",
    description:
      'When an expected token needs to be inserted before the query can end.',
  },
  unknownErrorAtToken: {
    id: 'jql-editor.plugins.jql-ast.error-messages.unknownErrorAtToken',
    defaultMessage: "Unable to parse the query at ''{received}''.",
    description: 'When the query could not be parsed when a token was reached.',
  },
  reservedChar: {
    id: 'jql-editor.plugins.jql-ast.error-messages.reservedChar',
    defaultMessage:
      "The character ''{char}'' is a reserved JQL character. You must enclose it in a string or use the escape ''{escapedChar}'' instead.",
    description: 'When the user has a reserved character in the query.',
  },
  reservedWord: {
    id: 'jql-editor.plugins.jql-ast.error-messages.reservedWord',
    defaultMessage:
      "''{word}'' is a reserved JQL word. You must surround it in quotation marks to use it in a query.",
    description: 'When the user has a reserved word in the query.',
  },
  unfinishedString: {
    id: 'jql-editor.plugins.jql-ast.error-messages.unfinishedString',
    defaultMessage: `The quoted string ''{received}'' has not been completed.`,
    description: 'When a string is missing an opening or closing quote.',
  },
  unfinishedStringBlank: {
    id: 'jql-editor.plugins.jql-ast.error-messages.unfinishedStringBlank',
    defaultMessage: 'The quoted string has not been completed.',
    description: 'When a string is missing an opening or closing quote.',
  },
  illegalEscape: {
    id: 'jql-editor.plugins.jql-ast.error-messages.illegalEscape',
    defaultMessage: `''{received}'' is an illegal JQL escape sequence. The valid escape sequences are \u005C', \u005C", \u005Ct, \u005Cn, \u005Cr, \u005C\u005C, '\u005C ' and \u005CuXXXX.`,
    description:
      'When there are no valid tokens following an escape character.',
  },
  illegalEscapeBlank: {
    id: 'jql-editor.plugins.jql-ast.error-messages.illegalEscapeBlank',
    defaultMessage: `The escape sequence has not been completed. The valid escape sequences are \u005C', \u005C", \u005Ct, \u005Cn, \u005Cr, \u005C\u005C, '\u005C ' and \u005CuXXXX.`,
    description:
      'When there are no valid tokens following an escape character.',
  },
  illegalChar: {
    id: 'jql-editor.plugins.jql-ast.error-messages.illegalChar',
    defaultMessage:
      "The character ''{char}'' must be escaped. Use the escape ''{escapedChar}'' instead.",
    description: 'When an illegal character is encountered in a query.',
  },
});
