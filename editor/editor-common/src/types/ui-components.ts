import type React from 'react';

import type { EditorView } from 'prosemirror-view';

import type { DispatchAnalyticsEvent } from '../analytics/types/dispatch-analytics-event';
import type { EventDispatcher } from '../event-dispatcher';
import type { ProviderFactory } from '../provider-factory';

import type { EditorActionsOptions } from './editor-actions';
import type { EditorAppearance } from './editor-appearance';

export type UiComponentFactoryParams = {
  editorView: EditorView;
  editorActions: EditorActionsOptions;
  eventDispatcher: EventDispatcher;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  providerFactory: ProviderFactory;
  appearance: EditorAppearance;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  containerElement: HTMLElement | null;
  disabled: boolean;
  wrapperElement: HTMLElement | null;
};
export type UIComponentFactory = (
  params: UiComponentFactoryParams,
) => React.ReactElement<any> | null;

export type ReactHookFactory = (
  params: Pick<UiComponentFactoryParams, 'editorView' | 'containerElement'>,
) => void;
