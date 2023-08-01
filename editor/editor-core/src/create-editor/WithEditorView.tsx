import type { ComponentType, FunctionComponent } from 'react';
import React from 'react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { useEditorContext } from '../ui/EditorContext';

export interface WithEditorViewInternalProps {
  editorView?: EditorView | undefined;
}

export const WithEditorView = <P extends WithEditorViewInternalProps>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithEditorViewInternalProps>> => {
  const _WithFeatureFlags: FunctionComponent<
    Omit<P, keyof WithEditorViewInternalProps>
  > = (props) => {
    const { editorActions } = useEditorContext();

    return (
      <WrappedComponent
        {...(props as P)}
        editorView={editorActions?._privateGetEditorView()}
      />
    );
  };

  return _WithFeatureFlags;
};
