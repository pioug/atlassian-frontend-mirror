const TICK_INTERVAL = 1000;
const GAP_HISTORY_SIZE = 20;

const MIN_REPORTED_GAP = TICK_INTERVAL * 2;

type SuspensionListener = (gapMs: number) => void;

type Gap = {
	at: number;
	gap: number;
};

let lastTickAt = Date.now();
let gaps: Gap[] = [];
let sentinel: ReturnType<typeof setInterval> | undefined;
let consumers = 0;
const listeners = new Set<SuspensionListener>();

const tick = () => {
	const now = Date.now();
	const gap = now - lastTickAt;
	lastTickAt = now;

	gaps.push({ at: now, gap });
	if (gaps.length > GAP_HISTORY_SIZE) {
		gaps.shift();
	}

	if (gap >= MIN_REPORTED_GAP) {
		listeners.forEach((listener) => listener(gap));
	}
};

export const acquireSleepDetector = (): (() => void) => {
	consumers += 1;
	if (!sentinel) {
		gaps = [];
		lastTickAt = Date.now();
		sentinel = setInterval(tick, TICK_INTERVAL);
	}

	let released = false;
	return () => {
		if (released) {
			return;
		}
		released = true;
		consumers -= 1;

		if (consumers <= 0) {
			consumers = 0;
			if (sentinel) {
				clearInterval(sentinel);
				sentinel = undefined;
			}
		}
	};
};

export const onSuspension = (listener: SuspensionListener): (() => void) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};

export const getMaxGapSince = (since: number): number =>
	gaps.reduce((max, { at, gap }) => (at > since && gap > max ? gap : max), 0);
