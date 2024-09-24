import { useCallback, useEffect, useRef, useState } from 'react';

type Disposer = () => void;

/**
 * A hook that watches for changes to a node and forces a re-render when it changes.
 *
 * @param element The node to watch for changes.
 * @param opts Options for the hook.
 * @param [opts.disableWatch=false] Whether to watch for changes or not.
 * @param [opts.onChange] A callback that is called when the node changes.
 *
 * @returns A version number that is incremented when the node changes to force a re-render.
 *
 * @internal
 */
export function useElementObserver(
	element: Node,
	opts: { disableWatch?: boolean; onChange?: (version: number) => void } = {},
): number {
	const { onChange, disableWatch = false } = opts;

	// This state is used to force a re-render when the target changes
	const [targetContentVersion, setTargetContentVersion] = useState<number>(0);

	const mutationObserver = useRef<MutationObserver | undefined>(undefined);
	const cancelIdleCallback = useRef<Disposer | undefined>(undefined);
	const disposer = useCallback<Disposer>(() => {
		cancelIdleCallback.current?.();
		cancelIdleCallback.current = undefined;
		mutationObserver.current?.disconnect();
		mutationObserver.current = undefined;
	}, []);

	const onMutation = useCallback(() => {
		// MutationObserver can make multiple calls to the callback in quick succession so debounce when idle
		cancelIdleCallback.current?.();
		cancelIdleCallback.current = callWhenIdle(() =>
			setTargetContentVersion((v: number) => {
				const version = v + 1;
				onChange?.(version);
				return version;
			}),
		);
	}, [onChange]);

	useEffect(() => {
		// Clean up any existing observer in the case that the target node has changed
		disposer();
		if (!disableWatch && element) {
			mutationObserver.current = new MutationObserver(onMutation);
			mutationObserver.current.observe(element, {
				attributes: true,
				childList: true,
				subtree: true,
			});
		}

		return disposer;
	}, [disableWatch, disposer, element, onMutation]);

	return targetContentVersion;
}

/**
 * A component that watches for changes to a node and forces a re-render when it changes.
 *
 * @param props
 * @param props.element The node to watch for changes.
 * @param props.children The children to render.
 * @param [props.disableWatch=false] Whether to watch for changes or not.
 * @param [props.onChange] A callback that is called when the node changes.
 *
 * @component
 * @internal
 */
export function ElementObserver({
	element,
	children,
	onChange,
	disableWatch,
}: {
	element: HTMLElement;
	children: any;
	onChange?: (version: number) => void;
	disableWatch?: boolean;
}) {
	useElementObserver(element, { disableWatch, onChange });
	return { children };
}

/**
 * When the browser is idle call the callback.
 *
 * This function will use `requestIdleCallback` if available, otherwise it will fallback to `setTimeout`.
 *
 * @param callback The function to call when the browser is idle.
 * @param [opts] Options for the idle callback.
 * @param [opts.timeout=100] The maximum time to wait for the browser to be idle.
 *
 * @returns A function that can be called to cancel the idle callback.
 *
 * @internal
 */
function callWhenIdle(callback: () => void, opts: { timeout?: number } = {}): Disposer {
	const { timeout = 100 } = opts;

	// eslint-disable-next-line compat/compat
	if (typeof window.requestIdleCallback === 'function') {
		// eslint-disable-next-line compat/compat
		const idleHandle = window.requestIdleCallback(callback, { timeout });
		return () => cancelIdleCallback(idleHandle);
	}

	// Fallback to setTimeout if requestIdleCallback is not available
	const timeoutHandle = setTimeout(callback, timeout);
	return () => clearTimeout(timeoutHandle);
}
