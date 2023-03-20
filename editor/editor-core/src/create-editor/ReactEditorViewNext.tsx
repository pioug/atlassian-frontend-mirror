import React from 'react';
import { ReactEditorView, EditorViewProps } from './ReactEditorViewInternal';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

type AddRequiredProp<Type, Key extends keyof Type> = Type &
  Required<Pick<Type, Key>>;

export function ReactEditorViewEditor<T = {}>(
  props: AddRequiredProp<
    EditorViewProps & WrappedComponentProps & T,
    'getEditorPlugins'
  >,
) {
  return <ReactEditorView {...props} />;
}

export default injectIntl(ReactEditorViewEditor);
