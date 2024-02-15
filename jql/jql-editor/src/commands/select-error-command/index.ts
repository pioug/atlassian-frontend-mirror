import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { JQLSyntaxError } from '@atlaskit/jql-ast';

import getDocumentPosition from '../../plugins/common/get-document-position';
import { getJastFromState } from '../../plugins/jql-ast';
import { JQLEditorCommand } from '../../schema';

/**
 * A Prosemirror Command that will select the first JQL error in the query if present.
 */
export const selectErrorCommand: JQLEditorCommand = (state, _, view) => {
  const jast = getJastFromState(state);
  const error = jast.errors.length > 0 ? jast.errors[0] : null;
  if (!(error instanceof JQLSyntaxError) || !view) {
    return false;
  }

  const transaction = state.tr;

  const documentFrom = getDocumentPosition(transaction.doc, error.start);
  const documentTo = getDocumentPosition(transaction.doc, error.stop);

  const selection = TextSelection.create(
    transaction.doc,
    documentFrom,
    documentTo,
  );
  transaction.setSelection(selection);
  transaction.scrollIntoView();

  view.focus();
  view.dispatch(transaction);

  return true;
};
