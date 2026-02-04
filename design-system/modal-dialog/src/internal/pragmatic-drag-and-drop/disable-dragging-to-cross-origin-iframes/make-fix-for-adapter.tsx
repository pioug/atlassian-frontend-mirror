import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { type CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';

/**
 * Set a `style` property on a `HTMLElement`
 *
 * @returns a `cleanup` function to restore the `style` property to it's original state
 */
function setStyle(
	el: HTMLElement,
	{
		property,
		rule,
		priority = '',
	}: { property: string; rule: string; priority?: 'important' | '' },
): CleanupFn {
	const originalValue = el.style.getPropertyValue(property);
	const originalPriority = el.style.getPropertyPriority(property);
	el.style.setProperty(property, rule, priority);
	return function cleanup() {
		el.style.setProperty(property, originalValue, originalPriority);
	};
}

function hasSameOrigin(href1: string, href2: string): boolean {
	let url1;
	let url2;
	try {
		url1 = new URL(href1);
		url2 = new URL(href2);
	} catch {
		// failed to parse a href
		return false;
	}

	// https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
	return url1.protocol === url2.protocol && url1.host === url2.host && url1.port === url2.port;
}

function isIframeOnAnotherDomain(iframe: HTMLIFrameElement): boolean {
	/**
	 * iframe with contents defined inline. Runs on the current origin.
	 * `<iframe srcdoc="<!doctype html><body>Hello</body>" />`
	 */
	if (iframe.srcdoc) {
		return false;
	}

	/**
	 * iframe with contents defined inline. Runs on the current origin.
	 * `<iframe src={`data:text/html;charset=utf-8,${encodeURI('<!doctype html><body>Hello</body>')}`} />`
	 */
	if (iframe.src.startsWith('data:')) {
		return false;
	}

	return !hasSameOrigin(window.location.href, iframe.src);
}

const registry = new Map<HTMLIFrameElement, { count: number; reset: CleanupFn }>();

function applyFix(watchForEndOfInteraction: ({ stop }: { stop: () => void }) => CleanupFn) {
	const iframes = Array.from(document.querySelectorAll('iframe')).filter(isIframeOnAnotherDomain);

	const cleanups = iframes.map((iframe) => {
		let entry = registry.get(iframe);

		if (!entry) {
			entry = {
				reset: setStyle(iframe, {
					property: 'pointer-events',
					rule: 'none',
					priority: 'important',
				}),
				count: 1,
			};
			registry.set(iframe, entry);
		} else {
			// pointer-events:none already applied to the iframe
			// increment how many things requested the fix
			entry.count++;
		}

		return function cleanup() {
			entry.count--;

			if (entry.count < 1) {
				entry.reset();
				registry.delete(iframe);
			}
		};
	});

	function stop() {
		cleanupWatcher();
		combine(...cleanups)();
	}

	const cleanupWatcher = watchForEndOfInteraction({ stop });
}

export function makeFixForAdapter({
	watchForInteractionStart,
	watchForInteractionEnd,
}: {
	watchForInteractionStart: ({ start }: { start: () => void }) => CleanupFn;
	watchForInteractionEnd: ({ stop }: { stop: () => void }) => CleanupFn;
}): {
    registerUsage: () => CleanupFn;
} {
	let registrationCount = 0;
	let stopWatchingInteractionStart: CleanupFn | null = null;

	function start() {
		applyFix(watchForInteractionEnd);
	}

	function registerUsage(): CleanupFn {
		if (registrationCount === 0) {
			stopWatchingInteractionStart = watchForInteractionStart({ start });
		}

		registrationCount++;

		return function unregisterUsage() {
			registrationCount--;
			if (registrationCount !== 0) {
				return;
			}
			stopWatchingInteractionStart?.();
			stopWatchingInteractionStart = null;
		};
	}

	return { registerUsage };
}
