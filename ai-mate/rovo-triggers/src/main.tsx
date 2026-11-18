/* eslint-disable @atlaskit/platform/one-value-export-per-file -- command callers cannot use hooks */

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import type { Callback, Payload, Topic } from './types';

interface SubscribeOptions {
	// Reject unrelated events before consuming or clearing them from replay.
	filter?: (payload: Payload) => boolean;
	topic: Topic;
	// Trigger the latest event for the topic when subscribing if it hasn't already been triggered
	triggerLatest?: boolean;
	// Clear replay state when the subscriber owns the topic lifecycle.
	clearLatestOnUnmount?: boolean;
	// When provided, consumeOnce events are processed once across subscribers sharing this key.
	consumeOnceKey?: string;
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

type PubSubEvent = {
	id: string;
	payload: Payload;
};

type PubSubEventCallback = (event: PubSubEvent) => void;

type TopicEvents = {
	[key in Topic]?: Array<{
		id: string;
		callback: PubSubEventCallback;
	}>;
};

type TopicEventQueue = {
	[key in Topic]?: PubSubEvent;
};

const MAX_CONSUMED_EVENT_KEYS = 5000;

const ignoredTriggerLatestEvents = new Set<Payload['type']>([
	'editor-context-payload',
	'agent-changed',
	'agent-editor-open-tools',
	// Internal signals that must never overwrite the publish queue — they would
	// cause `triggerLatest` subscribers (e.g. PubSubListener) to replay them
	// instead of the real action event (e.g. open-browse-agent-modal) that
	// originally opened the chat.
	'smartlinks-subscription-changed',
	'conversation-read',
	'smartlinks-context-payload',
	'set-message-context',
	'jira-create-context-payload',
	'submit-rovo-remix',
	'rovo-remix-handoff-failed',
	'sync-prompt-input-draft',
]);

const isIgnoredForTriggerLatest = (type: Payload['type']): boolean =>
	ignoredTriggerLatestEvents.has(type);

const createPubSub = () => {
	let subscribedEvents: TopicEvents = {};
	let publishQueue: TopicEventQueue = {};
	let wildcardEvents: Array<{ callback: Callback; id: string }> = [];
	let consumedEventKeys = new Set<string>();
	let consumedEventKeyQueue: string[] = [];
	let subIdCounter = 0;
	let eventIdCounter = 0;

	const generateSubId = () => {
		subIdCounter += 1;
		return subIdCounter.toString();
	};

	const createEvent = (payload: Payload): PubSubEvent => {
		eventIdCounter += 1;
		return {
			id: eventIdCounter.toString(),
			payload,
		};
	};

	const rememberConsumedEventKey = (claimKey: string) => {
		consumedEventKeys.add(claimKey);
		consumedEventKeyQueue = [...consumedEventKeyQueue, claimKey];

		if (consumedEventKeyQueue.length > MAX_CONSUMED_EVENT_KEYS) {
			const [oldestClaimKey, ...remainingClaimKeys] = consumedEventKeyQueue;
			consumedEventKeyQueue = remainingClaimKeys;
			if (oldestClaimKey) {
				consumedEventKeys.delete(oldestClaimKey);
			}
		}
	};

	const claimConsumeOnceEvent = ({
		event,
		consumeOnceKey,
	}: {
		event: PubSubEvent;
		consumeOnceKey?: string;
	}) => {
		if (!event.payload.consumeOnce || !consumeOnceKey) {
			return true;
		}

		const claimKey = `${consumeOnceKey}:${event.id}`;
		if (consumedEventKeys.has(claimKey)) {
			return false;
		}

		rememberConsumedEventKey(claimKey);
		return true;
	};

	const subscribe: Subscribe = ({ topic, triggerLatest, consumeOnceKey, filter }, callback) => {
		const events = subscribedEvents[topic] ?? [];
		const subId = generateSubId();
		const subExists = events.some(({ id }) => id === subId);
		const callbackWithConsumption = (event: PubSubEvent): boolean => {
			if (filter && !filter(event.payload)) {
				return false;
			}
			if (claimConsumeOnceEvent({ event, consumeOnceKey })) {
				callback(event.payload);
			}
			return true;
		};

		// Push to Topic stack if not already there
		if (!subExists) {
			subscribedEvents = {
				...subscribedEvents,
				[topic]: [...events, { callback: callbackWithConsumption, id: subId }],
			};
			// If this Topic already has a published event and `triggerLatest` is true, trigger the callback then clear the publishQueue for that Topic
			if (triggerLatest && !!publishQueue[topic]) {
				const event = publishQueue[topic] as PubSubEvent;
				const accepted = callbackWithConsumption(event);
				// Keep rejected events and newer events published synchronously during replay.
				if (accepted && publishQueue[topic] === event) {
					delete publishQueue[topic];
				}
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
		const event = createEvent(payload);

		/**
		 * Log that this Topic received a published event, regardless of whether it has subscribers or not.
		 * This ensures new subscribers can trigger their callback if `triggerLatest` is true, and the event hasn't already been triggered.
		 */
		// This `ignoredTriggerLatestEvents` is a quick fix to prevent triggering the latest event for certain events
		if (!isIgnoredForTriggerLatest(payload.type)) {
			publishQueue[topic] = event;
		}

		// Notify `subscribeAll` subscribers as they are Topic agnostic
		wildcardEvents.forEach(({ callback }) => callback(event.payload));

		const topicSubs = subscribedEvents[topic] || [];

		// If there are no subscribers for this Topic, nothing to do.
		if (!topicSubs.length) {
			return;
		}

		// Notify all Topic subscribers of this event
		topicSubs.forEach(({ callback }) => callback(event));
	};

	const flushQueue = () => {
		publishQueue = {};
	};
	const clearLatest = (topic: Topic) => {
		delete publishQueue[topic];
	};

	return { subscribe, subscribeAll, publish, flushQueue, clearLatest };
};

const pubSub = createPubSub();

export const publish = (topic: Topic, payload: Payload): void => {
	pubSub.publish(topic, payload);
};

const usePubSub = () => {
	return pubSub;
};

export const useSubscribe = (
	{ topic, triggerLatest, clearLatestOnUnmount, consumeOnceKey, filter }: SubscribeOptions,
	callback: Callback,
): void => {
	const { subscribe, clearLatest } = usePubSub();
	const callbackRef = useRef(callback);
	callbackRef.current = callback;
	const filterRef = useRef(filter);
	filterRef.current = filter;

	useEffect(
		() => {
			const unsubscribe = subscribe(
				{
					topic,
					triggerLatest,
					consumeOnceKey,
					filter: (payload) => filterRef.current?.(payload) ?? true,
				},
				(...args) => callbackRef.current(...args),
			);
			return () => {
				unsubscribe();
				if (clearLatestOnUnmount) {
					clearLatest(topic);
				}
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[topic, clearLatestOnUnmount, consumeOnceKey],
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

export const usePublish = (topic: Topic): ((payload: Payload) => void) => {
	const { publish } = usePubSub();
	const publishFn = useCallback((payload: Payload) => publish(topic, payload), [publish, topic]);
	return publishFn;
};

export const Subscriber = ({
	topic,
	triggerLatest,
	onEvent,
	flushQueueOnUnmount,
	consumeOnceKey,
	filter,
}: {
	topic: Topic;
	triggerLatest?: boolean;
	onEvent: Callback;
	flushQueueOnUnmount?: boolean;
	consumeOnceKey?: string;
	filter?: (payload: Payload) => boolean;
}) => {
	useSubscribe({ topic, triggerLatest, consumeOnceKey, filter }, onEvent);
	useFlushOnUnmount(flushQueueOnUnmount);
	return null;
};
