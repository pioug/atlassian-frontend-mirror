import { AnalyticsQueue } from './analytics-queue';
import { editorAnalyticsChannel } from './editorAnalyticsChannel';
import type { FireAnalyticsEvent } from './types/events';

export const fireAnalyticsEvent: FireAnalyticsEvent =
	(createAnalyticsEvent, options) =>
	({ payload, channel = editorAnalyticsChannel }) => {
		if (!createAnalyticsEvent) {
			return;
		}

		if (options?.immediate) {
			createAnalyticsEvent(payload)?.fire(channel);
			return;
		}

		const queue = AnalyticsQueue.get();
		queue.schedule(() => createAnalyticsEvent(payload)?.fire(channel));
	};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { editorAnalyticsChannel } from './editorAnalyticsChannel';
