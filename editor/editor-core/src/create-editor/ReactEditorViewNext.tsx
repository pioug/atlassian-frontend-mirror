import React from 'react';
import { ReactEditorView, EditorViewProps } from './ReactEditorViewInternal';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

export function ReactEditorViewEditor<T = {}>(
  props: EditorViewProps & WrappedComponentProps & T,
) {
  return <ReactEditorView {...props} />;
}

export default injectIntl(ReactEditorViewEditor);
