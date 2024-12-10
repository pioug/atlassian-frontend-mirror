export type Subscriber<T> = (event: T) => void;

export type EditorCardPluginEvents<T> = {
	push: (...events: T[]) => void;
	subscribe: (listener: Subscriber<T>) => () => void;
	flush: () => void;
	getSize: () => number;
};

/**
 * Simple mechanism to defer event related callbacks
 *
 * Probably think twice whether your event should use this instead of
 * editor's built-in `editor-plugin-analytics`
 *
 * Editor-Plugin-Analytics provides methods methods to dispatch events, and attach events into prosemiror transactions
 * However we do not have access to the smart card context in prosemirror
 *
 * We are using this queue to relay events occurring in prosemirror (which does not have access to the react context)
 * to be subscribed to elsewhere where the react context is available (contentComponent or otherwise) (smart card context)
 * in order to be able to annotate events with additional attributes to events
 */
export const createEventsQueue = <T extends unknown>(): EditorCardPluginEvents<T> => {
	const queue: T[] = [];
	const subscribers = new Set<Subscriber<T>>();

	const subscribe = (subscriber: Subscriber<T>) => {
		subscribers.add(subscriber);
		return () => {
			subscribers.delete(subscriber);
		};
	};

	const push = (...events: T[]) => {
		queue.push(...events);
	};

	const flush = () => {
		while (queue.length) {
			const event = queue.shift();

			if (event) {
				subscribers.forEach((subscriber) => {
					subscriber(event);
				});
			}
		}
	};

	const getSize = () => queue.length;

	return {
		push,
		flush,
		subscribe,
		getSize,
	};
};
