import { type UFOGlobalEventStreamEvent } from '../types';

import { MAX_EARLY_QUEUE_LENGTH } from './index';
import { type GlobalEventStream } from './index';

export const getGlobalEventStream = (): GlobalEventStream => {
	if (!globalThis.__UFO_GLOBAL_EVENT_STREAM__) {
		const earlyStream: GlobalEventStream = (() => {
			const stream: Array<UFOGlobalEventStreamEvent> = [];
			return {
				__buffer_only__: true,
				push: (event: UFOGlobalEventStreamEvent) => {
					if (stream.length < MAX_EARLY_QUEUE_LENGTH) {
						stream.push(event);
					}
				},
				getStream: () => stream,
			};
		})();

		globalThis.__UFO_GLOBAL_EVENT_STREAM__ = earlyStream;
	}
	return globalThis.__UFO_GLOBAL_EVENT_STREAM__;
};
