import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { EditorView } from 'prosemirror-view';
import EditorActions from '../actions';
import { EventDispatcher } from '../event-dispatcher';
import { EditorAppearance } from './editor-appearance';
import { DispatchAnalyticsEvent } from '../plugins/analytics/types/dispatch-analytics-event';

export type UiComponentFactoryParams = {
  editorView: EditorView;
  editorActions: EditorActions;
  eventDispatcher: EventDispatcher;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  providerFactory: ProviderFactory;
  appearance: EditorAppearance;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  containerElement: HTMLElement | null;
  disabled: boolean;
};
export type UIComponentFactory = (
  params: UiComponentFactoryParams,
) => React.ReactElement<any> | null;
