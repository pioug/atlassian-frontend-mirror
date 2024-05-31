import { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { type GasPurePayload, type GasPureScreenEventPayload } from '@atlaskit/analytics-gas-types';

import { analyticsBridgeClient } from '../analytics-client';

import { toNativeBridge } from './web-to-native/implementation';

export const handleAnalyticsEvent = (event: GasPurePayload | GasPureScreenEventPayload) => {
	toNativeBridge.call('analyticsBridge', 'trackEvent', {
		event: JSON.stringify(event),
	});
};

export const rendererAnalyticsClient: AnalyticsWebClient =
	analyticsBridgeClient(handleAnalyticsEvent);
