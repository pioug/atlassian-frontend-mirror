import React from 'react';
import type { ReactHookFactory } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

type HookParameters = Parameters<ReactHookFactory>[0];

interface MountPluginHookProps extends HookParameters {
  usePluginHook: ReactHookFactory;
}

function MountPluginHook({
  usePluginHook,
  editorView,
  containerElement,
}: MountPluginHookProps) {
  usePluginHook({ editorView, containerElement });
  return null;
}

interface MountPluginHooksProps {
  editorView: EditorView | undefined;
  pluginHooks: ReactHookFactory[] | undefined;
  containerElement: HTMLElement | null;
}

export function MountPluginHooks({
  pluginHooks,
  editorView,
  containerElement,
}: MountPluginHooksProps) {
  if (!editorView) {
    return null;
  }

  return (
    <>
      {pluginHooks?.map((usePluginHook, key) => (
        <MountPluginHook
          key={key}
          usePluginHook={usePluginHook}
          editorView={editorView}
          containerElement={containerElement}
        />
      ))}
    </>
  );
}
