import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common/analytics';
import { fg } from '@atlaskit/platform-feature-flags';
import { type ExperimentalPerformanceResourceTiming } from './types';
import { createMediaDurationMetrics, createUfoDurationMetrics } from './durationMetrics';
import { sendUfoDurationMetrics } from './ufo';

const MEDIA_CARD_PERF_STATE_KEY = '__mediaCardPerfState_asflkajsdflja';

declare global {
	interface Window {
		[MEDIA_CARD_PERF_STATE_KEY]?: {
			mediaCardPerfObserver?: PerformanceObserver;
			mediaCardCreateAnalyticsEvent?: CreateUIAnalyticsEvent;
		};
	}
}

const urlRegex =
	/https:\/\/(?:media\.(?:dev|staging|prod)\.atl-paas\.net|api\.media\.atlassian\.com|media-cdn(?:\.stg\.|\.)atlassian\.com)\/file\/([^/]+)\/image.*[?&]source=mediaCard/;

const clientIdParamRegex = /[?&]clientId=([^&]+)/;
const ssrParamRegex = /[?&]token=([^&]+)/;

const createAndGetResourceObserver = (): PerformanceObserver => {
	return new PerformanceObserver((list) => {
		list.getEntries().forEach((baseEntry) => {
			const entry = baseEntry as ExperimentalPerformanceResourceTiming;
			const matchFileId = entry.name.match(urlRegex);
			const matchClientId = entry.name.match(clientIdParamRegex);
			const matchSSR = entry.name.match(ssrParamRegex);

			if (matchFileId && window[MEDIA_CARD_PERF_STATE_KEY]?.mediaCardCreateAnalyticsEvent) {
				const fileId = matchFileId[1];
				const clientId = matchClientId?.[1];
				const ssr = matchSSR ? 'server' : undefined;
				const navigationTime = performance.getEntriesByType('navigation')[0] as
					| PerformanceNavigationTiming
					| undefined;

				const mediaDurationMetrics = createMediaDurationMetrics(entry, navigationTime);

				const event = window[MEDIA_CARD_PERF_STATE_KEY].mediaCardCreateAnalyticsEvent({
					eventType: 'operational',
					action: 'succeeded',
					actionSubject: 'mediaCardPerfObserver',
					attributes: {
						ssr,
						fileId: fileId,
						mediaClientId: clientId,
						featureFlags: {
							'media-cdn-single-host': fg('platform_media_cdn_single_host'),
						},
						...mediaDurationMetrics,
					},
				});
				event.fire(ANALYTICS_MEDIA_CHANNEL);

				if (fg('platform_media_card_ufo_network_metrics')) {
					const ufoDurationMetrics = createUfoDurationMetrics(entry, navigationTime);
					const endpointName = 'image';
					sendUfoDurationMetrics(ufoDurationMetrics, endpointName);
				}
			}
		});
	});
};

export const setAnalyticsContext = (newAnalyticsContext: CreateUIAnalyticsEvent) => {
	if (!window[MEDIA_CARD_PERF_STATE_KEY]) {
		window[MEDIA_CARD_PERF_STATE_KEY] = {};
	}
	window[MEDIA_CARD_PERF_STATE_KEY].mediaCardCreateAnalyticsEvent = newAnalyticsContext;
};

export const startResourceObserver = () => {
	if (window[MEDIA_CARD_PERF_STATE_KEY]?.mediaCardPerfObserver) {
		return;
	}
	if (!window[MEDIA_CARD_PERF_STATE_KEY]) {
		window[MEDIA_CARD_PERF_STATE_KEY] = {};
	}
	window[MEDIA_CARD_PERF_STATE_KEY].mediaCardPerfObserver = createAndGetResourceObserver();
	window[MEDIA_CARD_PERF_STATE_KEY].mediaCardPerfObserver.observe({
		type: 'resource',
		buffered: true,
	});
};
