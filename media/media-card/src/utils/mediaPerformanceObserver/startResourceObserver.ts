import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common/analytics';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';

import { createMediaDurationMetrics } from './createMediaDurationMetrics';
import { createUfoDurationMetrics } from './createUfoDurationMetrics';
import { MEDIA_CARD_PERF_STATE_KEY } from './mediaPerformanceObserver';
import { type ExperimentalPerformanceResourceTiming } from './types';
import { sendUfoDurationMetrics } from './ufo';

// this should fire around 10% of the time
const shouldSamplePerfObserver = () => Math.random() < 0.1;

const urlRegex =
	/(?:https:\/\/(?:media\.(?:dev|staging|prod)\.atl-paas\.net|api\.media\.atlassian\.com|media-cdn(?:\.stg\.|\.)atlassian\.com)\/|media-api\/)file\/([^/]+)\/image.*[?&]source=mediaCard/;

const clientIdParamRegex = /[?&]clientId=([^&]+)/;

const ssrParamRegex = /[?&]token=([^&]+)/;

const createAndGetResourceObserver = (): PerformanceObserver => {
	return new PerformanceObserver((list) => {
		list.getEntries().forEach((baseEntry) => {
			const entry = baseEntry as ExperimentalPerformanceResourceTiming;
			const matchFileId = entry.name.match(urlRegex);
			const matchClientId = entry.name.match(clientIdParamRegex);
			const matchSSR = entry.name.match(ssrParamRegex);

			const state = window[MEDIA_CARD_PERF_STATE_KEY];
			if (matchFileId && state?.mediaCardCreateAnalyticsEvent) {
				const fileId = matchFileId[1];
				const clientId = matchClientId?.[1];
				const ssr = matchSSR ? 'server' : undefined;

				// Get UFO interaction start time for proper timing in SPAs
				// For page_load: start = 0 (relative to page navigation)
				// For transitions: start = performance.now() when transition started
				const interaction = getActiveInteraction();
				const interactionStartTime = interaction?.start ?? 0;

				const mediaDurationMetrics = createMediaDurationMetrics(entry, interactionStartTime);

				const event = state.mediaCardCreateAnalyticsEvent({
					eventType: 'operational',
					action: 'succeeded',
					actionSubject: 'mediaCardPerfObserver',
					attributes: {
						ssr,
						fileId: fileId,
						mediaClientId: clientId,
						featureFlags: {
							'media-perf-lazy-loading-optimisation': fg('media-perf-lazy-loading-optimisation'),
						},
						...mediaDurationMetrics,
					},
				});

				if (shouldSamplePerfObserver()) {
					event.fire(ANALYTICS_MEDIA_CHANNEL);
				}

				if (fg('platform_media_card_ufo_network_metrics')) {
					const ufoDurationMetrics = createUfoDurationMetrics(entry, interactionStartTime);
					const endpointName = 'image';
					sendUfoDurationMetrics(ufoDurationMetrics, endpointName);
				}
			}
		});
	});
};

const isDefinedPerformanceObserver = () => typeof window['PerformanceObserver'] !== 'undefined';

export const startResourceObserver = (): void => {
	if (!isDefinedPerformanceObserver()) {
		return;
	}
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
