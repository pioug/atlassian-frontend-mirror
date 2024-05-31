import { FabricChannel } from '@atlaskit/analytics-listeners';

import { AnalyticsQueue } from './analytics-queue';
import type { FireAnalyticsEvent } from './types';

export const editorAnalyticsChannel = FabricChannel.editor;

export const fireAnalyticsEvent: FireAnalyticsEvent =
	(createAnalyticsEvent) =>
	({ payload, channel = editorAnalyticsChannel }) => {
		if (!createAnalyticsEvent) {
			return;
		}

		const queue = AnalyticsQueue.get();
		queue.schedule(() => createAnalyticsEvent(payload)?.fire(channel));
	};
