import React from 'react';
import { analyticsBridgeClient } from '../../analytics-client';
import { type GasPurePayload, type GasPureScreenEventPayload } from '@atlaskit/analytics-gas-types';
import { toNativeBridge } from '../web-to-native';
import { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';

const handleAnalyticsEvent = (event: GasPurePayload | GasPureScreenEventPayload) => {
	toNativeBridge.call('analyticsBridge', 'trackEvent', {
		event: JSON.stringify(event),
	});
};

export function useAnalytics(): AnalyticsWebClient {
	return React.useMemo(() => {
		return analyticsBridgeClient(handleAnalyticsEvent);
	}, []);
}
