/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { getVCObserver } from '@atlaskit/react-ufo/vc';

function bind(
	target: HTMLElement,
	event: FirstUserInteractionEvents,
	controller: AbortController,
	listener: () => void,
) {
	// Safe check for rare cases where window doesn't exist
	if (!target || typeof target.addEventListener !== 'function') {
		return () => {};
	}

	const options = {
		capture: true,
		passive: true,
		once: true,
		signal: controller.signal,
	};

	target.addEventListener(event, listener, options);

	return function unbind() {
		target.removeEventListener(event, listener, options);
	};
}

type FirstUserInteractionEvents =
	| 'wheel'
	| 'keydown'
	| 'mousedown'
	| 'pointerdown'
	| 'pointerup'
	| 'touchend'
	| 'scroll'
	| 'mouseover';

const AbortEvent: ReadonlyArray<FirstUserInteractionEvents> = [
	'wheel',
	'keydown',
	'mousedown',
	'pointerdown',
	'pointerup',
	'touchend',
	'scroll',
	'mouseover',
];

const ttvcAbort = () => {
	const vc = getVCObserver();

	if (
		!vc ||
		// For reasons that goes beyond my understand,
		// the type is not properly set.
		// https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/169231
		// @ts-expect-error
		typeof vc.abortCalculation !== 'function'
	) {
		return;
	}

	// For reasons that goes beyond my understand,
	// the type is not properly set.
	// https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/169231
	// @ts-expect-error
	vc.abortCalculation();
};

export const disableTTVCOnFirstUserInteraction = () => {
	const unbindCallbacks: Set<() => void> = new Set();
	const controller = new AbortController();
	const unbindFirstInteractionEvents = () => {
		controller.abort();

		unbindCallbacks.forEach((cb) => {
			cb();
		});

		unbindCallbacks.clear();
	};

	return new SafePlugin({
		view(view) {
			if (!view || !view.dom) {
				return {};
			}

			const { dom } = view;

			for (let abortEventName of AbortEvent) {
				unbindCallbacks.add(
					bind(dom, abortEventName, controller, () => {
						ttvcAbort();

						unbindFirstInteractionEvents();
					}),
				);
			}

			return {
				destroy: () => {
					unbindFirstInteractionEvents();
				},
			};
		},
	});
};
