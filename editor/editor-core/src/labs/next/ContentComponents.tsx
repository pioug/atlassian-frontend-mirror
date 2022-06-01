import React from 'react';
import { pluginKey as disabledPluginKey } from '../../plugins/editor-disabled';
import WithPluginState from '../../ui/WithPluginState';
import PluginSlot from '../../ui/PluginSlot';
import { useEditorSharedConfig } from './Editor';

type ContentComponentsProps = {
  disabled?: any;
  wrapperElement: HTMLElement | null;
  containerElement: HTMLElement | null;
};

export function ContentComponents({
  disabled,
  wrapperElement,
  containerElement,
}: ContentComponentsProps) {
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
          containerElement={containerElement} // TODO: Figure out how to pass containerElement here ED-8448
          wrapperElement={wrapperElement}
          disabled={disabled?.editorDisabled ?? false}
        />
      )}
    />
  );
}
