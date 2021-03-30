import React from 'react';
import { pluginKey as disabledPluginKey } from '../../plugins/editor-disabled';
import WithPluginState from '../../ui/WithPluginState';
import PluginSlot from '../../ui/PluginSlot';
import { useEditorSharedConfig } from './Editor';

export function ContentComponents(disabled?: any) {
  const config = useEditorSharedConfig();

  if (!config) {
    return null;
  }

  return (
    <WithPluginState
      plugins={{ disabled: disabledPluginKey }}
      render={({ disabled }) => (
        <PluginSlot
          editorView={config.editorView}
          eventDispatcher={config.eventDispatcher}
          providerFactory={config.providerFactory}
          items={config.contentComponents}
          popupsMountPoint={config.popupsMountPoint}
          popupsBoundariesElement={config.popupsBoundariesElement}
          popupsScrollableElement={config.popupsScrollableElement}
          containerElement={null} // TODO: Figure out how to pass containerElement here ED-8448
          disabled={disabled?.editorDisabled ?? false}
        />
      )}
    />
  );
}
