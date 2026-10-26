import type { ReactElement } from 'react';
import { flushSync } from 'react-dom';

import { createRoot, type Root } from 'react-dom/client';

/**
 * Shared registry of React roots created via `createRoot`.
 *
 * Both `decorations-drag-handle.ts` (render) and `decorations-common.ts`
 * (unmount) must operate on the **same** root for a given DOM element, so
 * the WeakMap lives here and is imported by both modules.
 */
const reactRoots = new WeakMap<Element, Root>();

/**
 * Mounts `element` into `mountPoint` using the `createRoot` API wrapped in
 * `flushSync` so the render is synchronous – matching the legacy
 * `ReactDOM.render` timing that ProseMirror decoration widgets depend on
 * (focus management, anchor positioning, block-menu visibility all read
 * the rendered DOM immediately after the callback returns).
 */
export const renderToMountPoint = (element: ReactElement, mountPoint: Element): void => {
	let root = reactRoots.get(mountPoint);

	if (!root) {
		root = createRoot(mountPoint);
		reactRoots.set(mountPoint, root);
	}

	const activeRoot = root;

	flushSync(() => activeRoot.render(element));
};

/**
 * Unmounts the React tree at `mountPoint` and removes it from the shared registry.
 */
export const unmountFromMountPoint = (mountPoint: Element): void => {
	const root = reactRoots.get(mountPoint);

	if (root) {
		root.unmount();
		reactRoots.delete(mountPoint);
	}
};
