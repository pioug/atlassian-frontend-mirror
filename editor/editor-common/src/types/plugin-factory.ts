import type { IntlShape } from 'react-intl-next';

import type { Schema } from '@atlaskit/editor-prosemirror/model';

import type { DispatchAnalyticsEvent } from '../analytics/types/dispatch-analytics-event';
import type { Dispatch, EventDispatcher } from '../event-dispatcher';
import { type PortalProviderAPI } from '../portal';
import type { ProviderFactory } from '../provider-factory';
import type { SafePlugin } from '../safe-plugin';
import type { ErrorReporter } from '../utils';

import type { FeatureFlags } from './feature-flags';

export type PMPluginFactoryParams = {
	schema: Schema;
	dispatch: Dispatch;
	eventDispatcher: EventDispatcher;
	providerFactory: ProviderFactory;
	errorReporter?: ErrorReporter;
	portalProviderAPI: PortalProviderAPI;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	featureFlags: FeatureFlags;
	getIntl: () => IntlShape;
};

export type PMPluginFactory = (params: PMPluginFactoryParams) => SafePlugin | undefined;
export type PMPlugin = {
	name: string;
	plugin: PMPluginFactory;
};
