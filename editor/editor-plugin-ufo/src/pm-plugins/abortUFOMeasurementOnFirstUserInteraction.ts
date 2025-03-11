/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { abortAll } from '@atlaskit/react-ufo/interaction-metrics';

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

	const listenerWrapper = (event: Event) => {
		if (event.isTrusted) {
			listener();
		}
	};

	target.addEventListener(event, listenerWrapper, options);

	return function unbind() {
		target.removeEventListener(event, listenerWrapper, options);
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

export const abortUFOMeasurementOnFirstUserInteraction = () => {
	if (typeof window.AbortController !== 'function') {
		return;
	}
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

			for (const abortEventName of AbortEvent) {
				unbindCallbacks.add(
					bind(dom, abortEventName, controller, () => {
						abortAll('new_interaction');

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
