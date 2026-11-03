export type EventOrTimestamp = number | { readonly timeStamp: number };

export function resolveInteractionTimestamp(
	eventOrTimestamp?: EventOrTimestamp,
): number | undefined {
	return typeof eventOrTimestamp === 'number' ? eventOrTimestamp : eventOrTimestamp?.timeStamp;
}
