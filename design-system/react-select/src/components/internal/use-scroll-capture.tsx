import { useCallback, useEffect, useRef } from 'react';

import { supportsPassiveEvents } from '../../utils';

const cancelScroll = (event: WheelEvent | TouchEvent) => {
	if (event.cancelable) {
		event.preventDefault();
	}
	event.stopPropagation();
};

interface Options {
	readonly isEnabled: boolean;
	readonly onBottomArrive?: (event: WheelEvent | TouchEvent) => void;
	readonly onBottomLeave?: (event: WheelEvent | TouchEvent) => void;
	readonly onTopArrive?: (event: WheelEvent | TouchEvent) => void;
	readonly onTopLeave?: (event: WheelEvent | TouchEvent) => void;
}

// TODO: Fill in the hook {description}.
/**
 * {description}.
 */
export default function useScrollCapture({
	isEnabled,
	onBottomArrive,
	onBottomLeave,
	onTopArrive,
	onTopLeave,
}: Options) {
	const isBottom = useRef(false);
	const isTop = useRef(false);
	const touchStart = useRef(0);
	const scrollTarget = useRef<HTMLElement | null>(null);

	const handleEventDelta = useCallback(
		(event: WheelEvent | TouchEvent, delta: number) => {
			if (scrollTarget.current === null) {
				return;
			}

			const { scrollTop, scrollHeight, clientHeight } = scrollTarget.current;
			const target = scrollTarget.current;
			const isDeltaPositive = delta > 0;
			const availableScroll = scrollHeight - clientHeight - scrollTop;
			let shouldCancelScroll = false;

			// reset bottom/top flags
			if (availableScroll > delta && isBottom.current) {
				if (onBottomLeave) {
					onBottomLeave(event);
				}
				isBottom.current = false;
			}
			if (isDeltaPositive && isTop.current) {
				if (onTopLeave) {
					onTopLeave(event);
				}
				isTop.current = false;
			}

			// bottom limit
			if (isDeltaPositive && delta > availableScroll) {
				if (onBottomArrive && !isBottom.current) {
					onBottomArrive(event);
				}
				target.scrollTop = scrollHeight;
				shouldCancelScroll = true;
				isBottom.current = true;

				// top limit
			} else if (!isDeltaPositive && -delta > scrollTop) {
				if (onTopArrive && !isTop.current) {
					onTopArrive(event);
				}
				target.scrollTop = 0;
				shouldCancelScroll = true;
				isTop.current = true;
			}

			// cancel scroll
			if (shouldCancelScroll) {
				cancelScroll(event);
			}
		},
		[onBottomArrive, onBottomLeave, onTopArrive, onTopLeave],
	);

	const onWheel = useCallback(
		(event: WheelEvent) => {
			handleEventDelta(event, event.deltaY);
		},
		[handleEventDelta],
	);
	const onTouchStart = useCallback((event: TouchEvent) => {
		// set touch start so we can calculate touchmove delta
		touchStart.current = event.changedTouches[0].clientY;
	}, []);
	const onTouchMove = useCallback(
		(event: TouchEvent) => {
			const deltaY = touchStart.current - event.changedTouches[0].clientY;
			handleEventDelta(event, deltaY);
		},
		[handleEventDelta],
	);

	const startListening = useCallback(
		(el: HTMLElement | null) => {
			// bail early if no element is available to attach to
			if (!el) {
				return;
			}

			const notPassive = supportsPassiveEvents ? { passive: false } : false;
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			el.addEventListener('wheel', onWheel, notPassive);
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			el.addEventListener('touchstart', onTouchStart, notPassive);
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			el.addEventListener('touchmove', onTouchMove, notPassive);
		},
		[onTouchMove, onTouchStart, onWheel],
	);

	const stopListening = useCallback(
		(el: HTMLElement | null) => {
			// bail early if no element is available to detach from
			if (!el) {
				return;
			}

			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			el.removeEventListener('wheel', onWheel, false);
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			el.removeEventListener('touchstart', onTouchStart, false);
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			el.removeEventListener('touchmove', onTouchMove, false);
		},
		[onTouchMove, onTouchStart, onWheel],
	);

	useEffect(() => {
		if (!isEnabled) {
			return;
		}

		const element = scrollTarget.current;
		startListening(element);

		return () => {
			stopListening(element);
		};
	}, [isEnabled, startListening, stopListening]);

	return (element: HTMLElement | null): void => {
		scrollTarget.current = element;
	};
}
