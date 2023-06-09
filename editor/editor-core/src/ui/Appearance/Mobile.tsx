import React from 'react';
import { EditorAppearanceComponentProps } from '../../types';
import { MobileAppearance } from '../AppearanceComponents/Mobile';
import PluginSlot from '../PluginSlot';

export default function Mobile({
  editorView,
  maxHeight,
  persistScrollGutter,
  editorDOMElement,
  disabled,
  contentComponents,
  editorActions,
  eventDispatcher,
  dispatchAnalyticsEvent,
  providerFactory,
  appearance,
  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,
  innerRef,
  pluginHooks,
  featureFlags,
}: EditorAppearanceComponentProps) {
  return (
    <MobileAppearance
      ref={innerRef}
      editorView={editorView || null}
      maxHeight={maxHeight}
      persistScrollGutter={persistScrollGutter}
      editorDisabled={disabled}
      featureFlags={featureFlags}
    >
      {editorDOMElement}
      <PluginSlot
        editorView={editorView}
        editorActions={editorActions}
        eventDispatcher={eventDispatcher}
        dispatchAnalyticsEvent={dispatchAnalyticsEvent}
        providerFactory={providerFactory}
        appearance={appearance}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        popupsScrollableElement={popupsScrollableElement}
        containerElement={innerRef?.current ?? null}
        disabled={!!disabled}
        wrapperElement={null}
        pluginHooks={pluginHooks}
      />
    </MobileAppearance>
  );
}
