import { ufowarn } from '../logger/ufowarn';
import { type UFOGlobalEventStreamEvent } from '../types';

import { type GlobalEventStream } from './index';

type GlobalEventStreamBuffer = {
	__buffer_only__: boolean;
	getStream: () => Array<UFOGlobalEventStreamEvent>;
	push(event: UFOGlobalEventStreamEvent): void;
};

export const setGlobalEventStream = (eventStream: GlobalEventStream): void => {
	if (
		globalThis.__UFO_GLOBAL_EVENT_STREAM__ &&
		!globalThis.__UFO_GLOBAL_EVENT_STREAM__?.__buffer_only__
	) {
		ufowarn('Global Event Stream already initialised. Ignoring new event stream setup');
		return;
	}

	if (globalThis.__UFO_GLOBAL_EVENT_STREAM__?.__buffer_only__) {
		(globalThis.__UFO_GLOBAL_EVENT_STREAM__ as GlobalEventStreamBuffer)
			.getStream()
			.forEach(eventStream.push.bind(eventStream));
	}

	globalThis.__UFO_GLOBAL_EVENT_STREAM__ = eventStream;
};
