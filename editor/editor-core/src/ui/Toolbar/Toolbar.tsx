import React from 'react';
import { ToolbarProps } from './toolbar-types';
import { ToolbarInner } from './ToolbarInner';
import { ToolbarSize } from './types';

export const Toolbar: React.FunctionComponent<ToolbarProps> = (props) => {
  return (
    <ToolbarInner
      items={props.items}
      editorView={props.editorView}
      editorActions={props.editorActions}
      eventDispatcher={props.eventDispatcher}
      providerFactory={props.providerFactory}
      appearance={props.appearance}
      popupsMountPoint={props.popupsMountPoint}
      popupsBoundariesElement={props.popupsBoundariesElement}
      popupsScrollableElement={props.popupsScrollableElement}
      disabled={props.disabled}
      dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
      toolbarSize={props.toolbarSize}
      isToolbarReducedSpacing={props.toolbarSize < ToolbarSize.XXL}
      containerElement={props.containerElement}
    />
  );
};
