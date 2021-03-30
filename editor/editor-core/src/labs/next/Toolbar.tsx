import React from 'react';
import { pluginKey as disabledPluginKey } from '../../plugins/editor-disabled';
import WithPluginState from '../../ui/WithPluginState';
import ToolBar from '../../ui/Toolbar';
import { useEditorSharedConfig } from './Editor';

interface Props {
  containerElement: HTMLElement | null;
}

export function Toolbar({ containerElement }: Props) {
  const config = useEditorSharedConfig();

  if (!config) {
    return null;
  }

  return (
    <WithPluginState
      plugins={{ disabled: disabledPluginKey }}
      render={({ disabled }) => (
        <ToolBar
          editorView={config.editorView}
          eventDispatcher={config.eventDispatcher!}
          providerFactory={config.providerFactory}
          items={config.primaryToolbarComponents}
          popupsMountPoint={config.popupsMountPoint}
          popupsBoundariesElement={config.popupsBoundariesElement}
          popupsScrollableElement={config.popupsScrollableElement}
          disabled={disabled?.editorDisabled ?? false}
          containerElement={containerElement}
        />
      )}
    />
  );
}
