import { fg } from '@atlaskit/platform-feature-flags';

let delayId: number | null = null;

function clearScheduled(): void {
	if (delayId != null) {
		window.clearTimeout(delayId);
		delayId = null;
	}
}

function scheduleTimeout(fn: () => void, delay: number): void {
	clearScheduled();

	delayId = window.setTimeout(() => {
		delayId = null;
		fn();
	}, delay);
}

// This file is a singleton for managing tooltips.
//
// Once we roll out top-layer and remove the legacy path, this manager can be simplified:
// - Singleton: Can be removed; the platform (popover="auto" or popover="hint") already enforces
//   only one tooltip open at a time.
// - Phase machine: Can be simplified; drop hide-animating and finishHideAnimation (legacy fade-out).
//   Use e.g. pending-show | visible | pending-hide with immediate hide.
// - API: Can drop or simplify mousePosition/mousePos if no longer needed; keep delay scheduling,
//   keep(), requestHide, abort, and minimal lifecycle.

export type Source =
	| {
			type: 'mouse';
			clientX: number;
			clientY: number;
	  }
	| { type: 'keyboard' };

export type Entry = {
	source: Source;
	show: (value: { isImmediate: boolean }) => void;
	hide: (value: { isImmediate: boolean }) => void;
	delay: number;
	done: () => void;
	shouldAlwaysFadeIn: boolean;
};

export type API = {
	isActive: () => boolean;
	mousePos: Pick<React.MouseEvent<HTMLElement>, 'clientX' | 'clientY'> | null;
	requestHide: (value: { isImmediate: boolean }) => void;
	finishHideAnimation: () => void;
	keep: () => void;
	abort: () => void;
};

type Phase = 'waiting-to-show' | 'shown' | 'waiting-to-hide' | 'hide-animating' | 'done';

type Active = {
	entry: Entry;
	isVisible: () => boolean;
};
let active: Active | null = null;

export function show(entry: Entry): API {
	let phase: Phase = 'waiting-to-show';

	function isActive(): boolean {
		return Boolean(active && active.entry === entry);
	}

	function cleanup() {
		if (isActive()) {
			clearScheduled();
			active = null;
		}
	}
	function done() {
		if (isActive()) {
			entry.done();
		}
		phase = 'done';
		cleanup();
	}

	function immediatelyHideAndDone() {
		if (isActive()) {
			entry.hide({ isImmediate: true });
		}
		done();
	}

	function keep() {
		if (!isActive()) {
			return;
		}

		// aborting a wait to hide
		if (phase === 'waiting-to-hide') {
			phase = 'shown';
			clearScheduled();
			return;
		}

		// aborting hide animation
		if (phase === 'hide-animating') {
			phase = 'shown';
			clearScheduled();
			entry.show({ isImmediate: false });
			return;
		}
	}

	function requestHide({ isImmediate }: { isImmediate: boolean }) {
		if (!isActive()) {
			return;
		}

		// If we were not showing yet anyway; finish straight away
		if (phase === 'waiting-to-show') {
			immediatelyHideAndDone();
			return;
		}

		// already waiting to hide
		// Bug in legacy path: isImmediate hide requests are ignored during waiting-to-hide,
		// meaning Escape/scroll won't instantly dismiss a tooltip that's already fading out.
		// Gated fix: only apply the immediate-hide behavior under the top-layer flag for now.
		if (phase === 'waiting-to-hide') {
			if (isImmediate && fg('platform-dst-top-layer')) {
				immediatelyHideAndDone();
			}
			return;
		}

		if (isImmediate) {
			immediatelyHideAndDone();
			return;
		}
		phase = 'waiting-to-hide';
		scheduleTimeout(() => {
			phase = 'hide-animating';
			entry.hide({ isImmediate: false });
		}, entry.delay);
	}

	function finishHideAnimation() {
		if (isActive() && phase === 'hide-animating') {
			done();
		}
	}

	function isVisible(): boolean {
		return phase === 'shown' || phase === 'waiting-to-hide' || phase === 'hide-animating';
	}

	function start() {
		const shouldAlwaysFadeIn = entry.shouldAlwaysFadeIn;
		const showImmediately: boolean = Boolean(active && active.isVisible()) && !shouldAlwaysFadeIn;

		// If there was an active tooltip; we tell it to remove itself at once!
		if (active) {
			clearScheduled();
			active.entry.hide({ isImmediate: true });
			active.entry.done();
			active = null;
		}

		// this tooltip is now the active tooltip
		active = {
			entry,
			isVisible,
		};

		function show() {
			phase = 'shown';
			entry.show({ isImmediate: showImmediately });
		}

		if (showImmediately) {
			show();
			return;
		}

		phase = 'waiting-to-show';
		scheduleTimeout(show, entry.delay);
	}
	// let's get started!
	start();

	const result: API = {
		keep,
		abort: cleanup,
		isActive,
		requestHide,
		finishHideAnimation,
		mousePos:
			entry.source.type === 'mouse'
				? { clientX: entry.source.clientX, clientY: entry.source.clientY }
				: null,
	};

	return result;
}
