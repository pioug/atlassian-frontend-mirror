import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import type { Callback, Payload, Topic, TopicEventQueue, TopicEvents } from './types';

interface SubscribeOptions {
	topic: Topic;
	// Trigger the latest event for the topic when subscribing if it hasn't already been triggered
	triggerLatest?: boolean;
}

interface Subscribe {
	(options: SubscribeOptions, callback: Callback): () => void;
}

interface Publish {
	(topic: Topic, payload: Payload): void;
}

interface SubscribeAll {
	(callback: Callback): () => void;
}

const ignoredTriggerLatestEvents = new Set<Payload['type']>([
	'editor-context-payload',
	'agent-changed',
]);

const createPubSub = () => {
	let subscribedEvents: TopicEvents = {};
	let publishQueue: TopicEventQueue = {};
	let wildcardEvents: Array<{ callback: Callback; id: string }> = [];
	let subIdCounter = 0;

	const generateSubId = () => {
		subIdCounter += 1;
		return subIdCounter.toString();
	};

	const subscribe: Subscribe = ({ topic, triggerLatest }, callback) => {
		const events = subscribedEvents[topic] ?? [];
		const subId = generateSubId();
		const subExists = events.some(({ id }) => id === subId);

		// Push to Topic stack if not already there
		if (!subExists) {
			subscribedEvents = {
				...subscribedEvents,
				[topic]: [...events, { callback, id: subId }],
			};
			// If this Topic already has a published event and `triggerLatest` is true, trigger the callback then clear the publishQueue for that Topic
			if (triggerLatest && !!publishQueue[topic]) {
				const payload = publishQueue[topic] as Payload;
				callback(payload);
				delete publishQueue[topic];
			}
		}

		return () => {
			// Remove from Topic stack
			subscribedEvents = {
				...subscribedEvents,
				[topic]: (subscribedEvents[topic] || []).filter(({ id }) => id !== subId),
			};
		};
	};

	const subscribeAll: SubscribeAll = (callback: Callback) => {
		const subId = wildcardEvents.length.toString();
		wildcardEvents = [...wildcardEvents, { callback, id: subId }];
		return () => {
			wildcardEvents = wildcardEvents.filter(({ id }) => id !== subId);
		};
	};

	const publish: Publish = (topic: Topic, payload: Payload) => {
		/**
		 * Log that this Topic received a published event, regardless of whether it has subscribers or not.
		 * This ensures new subscribers can trigger their callback if `triggerLatest` is true, and the event hasn't already been triggered.
		 */
		// This `ignoredTriggerLatestEvents` is a quick fix to prevent triggering the latest event for certain events
		if (!ignoredTriggerLatestEvents.has(payload.type)) {
			publishQueue[topic] = payload;
		}

		// Notify `subscribeAll` subscribers as they are Topic agnostic
		wildcardEvents.forEach(({ callback }) => callback(payload));

		const topicSubs = subscribedEvents[topic] || [];

		// If there are no subscribers for this Topic, nothing to do.
		if (!topicSubs.length) {
			return;
		}

		// Notify all Topic subscribers of this event
		topicSubs.forEach(({ callback }) => callback(payload));
	};

	const flushQueue = () => {
		publishQueue = {};
	};

	return { subscribe, subscribeAll, publish, flushQueue };
};

const pubSub = createPubSub();

const usePubSub = () => {
	return pubSub;
};

export const useSubscribe = ({ topic, triggerLatest }: SubscribeOptions, callback: Callback): void => {
	const { subscribe } = usePubSub();
	const callbackRef = useRef(callback);
	callbackRef.current = callback;

	useEffect(
		() => {
			const unsubscribe = subscribe({ topic, triggerLatest }, (...args) =>
				callbackRef.current(...args),
			);
			return unsubscribe;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[topic],
	);
};

export const useSubscribeAll = (callback: Callback): void => {
	const { subscribeAll } = usePubSub();
	const callbackRef = useRef(callback);
	callbackRef.current = callback;

	useEffect(
		() => {
			const unsubscribe = subscribeAll((...args) => callbackRef.current(...args));
			return unsubscribe;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);
};

const useFlushOnUnmount = (active: boolean = false) => {
	const { flushQueue } = usePubSub();
	useLayoutEffect(() => {
		return () => {
			if (active) {
				flushQueue();
			}
		};
	}, [active, flushQueue]);
};

export const usePublish = (topic: Topic) => {
	const { publish } = usePubSub();
	const publishFn = useCallback((payload: Payload) => publish(topic, payload), [publish, topic]);
	return publishFn;
};

export const Subscriber = ({
	topic,
	triggerLatest,
	onEvent,
	flushQueueOnUnmount,
}: {
	topic: Topic;
	triggerLatest?: boolean;
	onEvent: Callback;
	flushQueueOnUnmount?: boolean;
}) => {
	useSubscribe({ topic, triggerLatest }, onEvent);
	useFlushOnUnmount(flushQueueOnUnmount);
	return null;
};
