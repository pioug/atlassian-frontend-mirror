import { type RefObject, useEffect, useRef } from 'react';

import {
	unstable_IdlePriority as idlePriority,
	unstable_scheduleCallback as scheduleCallback,
} from 'scheduler';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as createUUID } from 'uuid';

import coinflip from '../coinflip';
import { getInteractionRate, getTypingPerformanceTracingMethod } from '../config';
import { addMetadata, addNewInteraction, tryComplete } from '../interaction-metrics';

type KeyboardEvent = {
	key: string;
	timeStamp: number;
};

const getTypingMetadata = (
	times: Float64Array | number[],
	computeStartTime: number,
	typingPerformanceTracingMethod: string,
) => {
	let min = 0;
	let max = 0;
	let avg = 0;
	let index = 0;
	let below50count = 0;

	times.forEach((time) => {
		if (time !== 0) {
			avg = (avg * index + time) / ++index;
			if (time > max) {
				max = time;
			}
			if (min === 0 || time < min) {
				min = time;
			}
			if (time < 50) {
				below50count++;
			}
		}
	});

	return {
		typing: {
			min,
			max,
			avg,
			count: index,
			below50count,
			compute: performance.now() - computeStartTime,
			typeTracingMethod: typingPerformanceTracingMethod,
		},
	};
};

function typingPerformanceTracingTimeout(element: HTMLElement, name: string, rate: number) {
	let tsubmit: NodeJS.Timeout | undefined;
	let times: number[] = [];
	let isInteractionInitialised = false;
	let id: string;

	const start = () => {
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		id = createUUID();
		addNewInteraction(id, name, 'typing', performance.now(), rate, null, null);
		isInteractionInitialised = true;
	};

	const end = () => {
		isInteractionInitialised = false;
		const timesCopy = times;
		times = [];
		scheduleCallback(idlePriority, () => {
			const computeStartTime = performance.now();
			const data = getTypingMetadata(timesCopy, computeStartTime, 'timeout');
			addMetadata(id, data);
			tryComplete(id);
		});
	};

	const onKeyPressHandler = (event: KeyboardEvent) => {
		if (!isInteractionInitialised) {
			start();
		}

		const startTime = event.timeStamp;
		setTimeout(() => {
			const endTime = performance.now();
			const time = endTime - startTime;
			times.push(time);
			clearTimeout(tsubmit);
			tsubmit = setTimeout(end, 2000); // debounce
		}, 0);
	};

	// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
	element.addEventListener('keypress', onKeyPressHandler);
	return () => {
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		element.removeEventListener('keypress', onKeyPressHandler);
	};
}

function typingPerformanceTracingTimeoutNoAlloc(element: HTMLElement, name: string, rate: number) {
	let tsubmit: NodeJS.Timeout | undefined;
	let isInteractionInitialised = false;
	let min = 0;
	let max = 0;
	let below50count = 0;
	let avg = 0;
	let count = 0;
	let id: string;

	const resetStats = () => {
		min = 0;
		max = 0;
		below50count = 0;
		avg = 0;
		count = 0;
	};

	const start = () => {
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		id = createUUID();
		addNewInteraction(id, name, 'typing', performance.now(), rate, null, null);
		isInteractionInitialised = true;
	};

	const end = () => {
		isInteractionInitialised = false;
		const typingMetaData = {
			typing: {
				min,
				max,
				avg,
				count,
				below50count,
				typeTracingMethod: 'timeoutNoAlloc',
			},
		};
		resetStats();
		scheduleCallback(idlePriority, () => {
			addMetadata(id, typingMetaData);
			tryComplete(id);
		});
	};

	const onKeyPressHandler = (event: KeyboardEvent) => {
		if (!isInteractionInitialised) {
			start();
		}

		const startTime = event.timeStamp;
		setTimeout(() => {
			const endTime = performance.now();
			const time = endTime - startTime;
			if (time !== 0) {
				avg = (avg * count + time) / ++count;
				if (time > max) {
					max = time;
				}
				if (min === 0 || time < min) {
					min = time;
				}
				if (time < 50) {
					below50count++;
				}
			}
			clearTimeout(tsubmit);
			tsubmit = setTimeout(end, 2000); // debounce
		}, 0);
	};

	// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
	element.addEventListener('keypress', onKeyPressHandler);
	return () => {
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		element.removeEventListener('keypress', onKeyPressHandler);
	};
}

function typingPerformanceTracingMutationObserver(
	element: HTMLElement,
	name: string,
	rate: number,
) {
	let eventTime = -1;
	let isInteractionInitialised = false;
	let count = 0;
	let id: string;
	let tsubmit: NodeJS.Timeout | undefined;
	const keyLimit = 20;
	const times = new Float64Array(keyLimit);

	const resetTimesArray = () => {
		times.fill(0);
	};

	const resetEventTime = () => {
		eventTime = -1;
	};

	const start = () => {
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		id = createUUID();
		addNewInteraction(id, name, 'typing', performance.now(), rate, null, null);
		isInteractionInitialised = true;
	};

	const end = () => {
		isInteractionInitialised = false;
		if (count === 0) {
			return;
		}
		const timesCopy = new Float64Array(times);
		const countCopy = count;
		resetTimesArray();
		resetEventTime();
		count = 0;
		scheduleCallback(idlePriority, () => {
			const computeStartTime = performance.now();
			const timesSubarray = timesCopy.subarray(0, countCopy);
			const data = getTypingMetadata(timesSubarray, computeStartTime, 'mutationObserver');
			addMetadata(id, data);
			tryComplete(id);
		});
	};

	const onKeyPressHandler = (event: KeyboardEvent) => {
		if (!isInteractionInitialised) {
			start();
		}
		eventTime = event.timeStamp;

		setTimeout(() => {
			clearTimeout(tsubmit);
			tsubmit = setTimeout(end, 2000); // debounce
		}, 0);
	};

	const mo = new MutationObserver((events) => {
		const moTime = performance.now();

		if (eventTime === -1) {
			return;
		}
		if (count > keyLimit - 1) {
			end();
			return;
		}

		const startTime = eventTime;
		resetEventTime();
		events.forEach(() => {
			requestAnimationFrame((firstFrameTime) => {
				if (firstFrameTime < moTime) {
					requestAnimationFrame((secondFrameTime) => {
						times[count] = secondFrameTime - startTime;
						count++;
					});
				} else {
					times[count] = firstFrameTime - startTime;
					count++;
				}
			});
		});
	});

	mo.observe(element, {
		attributeFilter: ['value'],
		attributes: true,
		characterData: true,
		childList: true,
		subtree: true,
	});

	// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
	element.addEventListener('keypress', onKeyPressHandler);
	return () => {
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		element.removeEventListener('keypress', onKeyPressHandler);
		mo.disconnect();
	};
}

const typingPerformanceTracingMethods = {
	timeout: typingPerformanceTracingTimeout,
	timeoutNoAlloc: typingPerformanceTracingTimeoutNoAlloc,
	mutationObserver: typingPerformanceTracingMutationObserver,
};

export default function useUFOTypingPerformanceTracing<T extends HTMLElement>(
	name: string,
): RefObject<T> {
	const ref = useRef<T>(null);

	useEffect(() => {
		const rate = getInteractionRate(name, 'typing');
		if (coinflip(rate) && ref.current != null) {
			const method = getTypingPerformanceTracingMethod();
			return typingPerformanceTracingMethods[method](ref.current, name, rate);
		}
	}, [name]);

	return ref;
}
