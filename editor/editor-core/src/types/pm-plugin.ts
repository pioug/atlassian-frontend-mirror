import { ErrorReporter, ProviderFactory } from '@atlaskit/editor-common';
import { Plugin } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';

import { EditorReactContext } from '../types';
import { Dispatch, EventDispatcher } from '../event-dispatcher';
import { PortalProviderAPI } from '../ui/PortalProvider';
import { DispatchAnalyticsEvent } from '../plugins/analytics/types/dispatch-analytics-event';
import type { FeatureFlags } from './feature-flags';

export type PMPluginFactoryParams = {
  schema: Schema;
  dispatch: Dispatch;
  eventDispatcher: EventDispatcher;
  providerFactory: ProviderFactory;
  errorReporter?: ErrorReporter;
  portalProviderAPI: PortalProviderAPI;
  reactContext: () => EditorReactContext;
  dispatchAnalyticsEvent: DispatchAnalyticsEvent;
  featureFlags: FeatureFlags;
};

export type PMPluginFactory = (
  params: PMPluginFactoryParams,
) => Plugin | undefined;
export type PMPlugin = {
  name: string;
  plugin: PMPluginFactory;
};
