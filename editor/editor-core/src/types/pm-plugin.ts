import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { ErrorReporter } from '@atlaskit/editor-common/utils';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { Schema } from 'prosemirror-model';
import { IntlShape } from 'react-intl-next';

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
  getIntl: () => IntlShape;
};

export type PMPluginFactory = (
  params: PMPluginFactoryParams,
) => SafePlugin | undefined;
export type PMPlugin = {
  name: string;
  plugin: PMPluginFactory;
};
