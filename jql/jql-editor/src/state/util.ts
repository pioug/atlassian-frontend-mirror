import escapeRegExp from 'lodash/escapeRegExp';
import uuidv5 from 'uuid/v5';

import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
  AbstractJastVisitor,
  CompoundClause,
  Field,
  Jast,
  NotClause,
  OrderBy,
  OrderByField,
  Query,
  TerminalClause,
} from '@atlaskit/jql-ast';
import { JQLRuleKey, JQLSuggestions } from '@atlaskit/jql-autocomplete';

import { SelectableAutocompleteOptions } from '../plugins/autocomplete/components/types';
import getDocumentPosition from '../plugins/common/get-document-position';
import { getNodeText } from '../utils/document-text';

import {
  AutocompletePosition,
  ContextAwareTokenSuggestions,
  DebugMessageEventAttribute,
} from './types';

// Unique namespace to identify JQL autocomplete options!
const UUID_NAMESPACE = '9a90299c-aa58-494b-b6a1-e93206e3fdd6';

export const getAutocompleteOptionId = (value: string) =>
  uuidv5(value, UUID_NAMESPACE);

export const tokensToAutocompleteOptions = (
  tokens: ContextAwareTokenSuggestions,
): SelectableAutocompleteOptions => {
  let tokensToDisplay = tokens.values;

  if (tokens.matchedText !== '') {
    // Candidates that start with last token text but are not an exact match (case insensitive)
    const regex = new RegExp(`^${escapeRegExp(tokens.matchedText)}[^$]`, 'i');
    tokensToDisplay = tokens.values.filter(token => regex.test(token));
  }

  return tokensToDisplay.map(token => ({
    id: getAutocompleteOptionId(token),
    name: token,
    value: token,
    replacePosition: tokens.replacePosition,
    matchedText: tokens.matchedText,
    context: tokens.context ?? null,
    type: 'keyword',
  }));
};

export const getReplacePositionStart = ({
  rules,
  tokens,
}: JQLSuggestions): number => {
  // Matching tokens should be prioritized over rules when calculating autocomplete dropdown position
  if (tokens.values.length) {
    return tokens.replacePosition[0];
  }

  // Same precedence as `useAutocompleteOptions`, this may change in future if we don't limit suggestions to one rule
  const rulePrecedence: JQLRuleKey[] = [
    'value',
    'function',
    'list',
    'operator',
    'field',
  ];

  for (const rule of rulePrecedence) {
    if (Object.prototype.hasOwnProperty.call(rules, rule)) {
      return rules[rule]!.replacePosition[0];
    }
  }

  return tokens.replacePosition[0];
};

export const getAutocompletePosition = (
  editorView: EditorView,
  replacePositionStart: number,
): AutocompletePosition => {
  const { doc, selection } = editorView.state;
  const documentPosition = getDocumentPosition(doc, replacePositionStart);
  const { left } = editorView.coordsAtPos(documentPosition);
  // Vertically position autocomplete relative to selection end
  const { bottom } = editorView.coordsAtPos(selection.to);
  return { top: bottom, left };
};

const getDebugSelectionAttributes = (): {
  [key: string]: DebugMessageEventAttribute;
} => {
  const selection = document.getSelection();
  if (selection === null || selection.type === 'None') {
    return {};
  }

  return {
    anchorOffset: selection.anchorOffset,
    anchorNodeText: selection.anchorNode?.textContent,
    anchorNodeName: selection.anchorNode?.nodeName,
    focusOffset: selection.focusOffset,
    focusNodeText: selection.focusNode?.textContent,
    focusNodeName: selection.focusNode?.nodeName,
  };
};
export const sendDebugMessage = (
  message: string,
  editorView: EditorView,
  editorState: EditorState,
  onDebugUnsafeMessage?: (
    message: string,
    event: { [key: string]: DebugMessageEventAttribute },
  ) => void,
  eventAttributes?: { [key: string]: DebugMessageEventAttribute },
): void => {
  if (!onDebugUnsafeMessage) {
    return;
  }

  try {
    const editorViewStateText = getNodeText(
      editorView.state.doc,
      0,
      editorView.state.doc.content.size,
    );
    const editorViewStateJson = JSON.stringify(editorView.state.toJSON());
    const editorStateJson = JSON.stringify(editorState.toJSON());
    const editorViewHtml = editorView.dom.innerHTML;

    onDebugUnsafeMessage(message, {
      editorStateJson,
      editorViewStateText,
      editorViewStateJson,
      editorViewHtml,
      ...getDebugSelectionAttributes(),
      ...eventAttributes,
    });
  } catch (ignored) {
    // Do nothing
  }
};

export const getFieldNodes = (ast: Jast): Set<string> => {
  if (!ast.query) {
    return new Set();
  }

  const visitor = new FindFieldsVisitor();
  ast.query.accept(visitor);

  return visitor.fields;
};

class FindFieldsVisitor extends AbstractJastVisitor<void> {
  public fields: Set<string> = new Set();

  visitQuery = (query: Query): void => {
    if (query.where !== undefined) {
      query.where.accept(this);
    }
    if (query.orderBy !== undefined) {
      query.orderBy.accept(this);
    }
  };

  visitOrderBy = (orderBy: OrderBy): void => {
    orderBy.fields.map(orderByField => orderByField.accept(this));
  };

  visitOrderByField = (orderByField: OrderByField): void => {
    orderByField.field.accept(this);
  };

  visitCompoundClause = (compoundClause: CompoundClause): void => {
    compoundClause.clauses.map(clause => clause.accept(this));
  };

  visitTerminalClause = (terminalClause: TerminalClause): void => {
    terminalClause.field.accept(this);
  };

  visitNotClause = (notClause: NotClause): void => {
    notClause.clause.accept(this);
  };

  visitField = (field: Field): void => {
    this.fields.add(field.value.toLowerCase());
  };

  protected defaultResult(): void {
    return;
  }
}
