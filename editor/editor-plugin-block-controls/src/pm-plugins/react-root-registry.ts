import type { ReactElement } from 'react';
import ReactDOM, { flushSync } from 'react-dom';

import { createRoot, type Root } from 'react-dom/client';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

/**
 * Shared registry of React roots created via `createRoot`.
 *
 * Both `decorations-drag-handle.ts` (render) and `decorations-common.ts`
 * (unmount) must operate on the **same** root for a given DOM element, so
 * the WeakMap lives here and is imported by both modules.
 */
const reactRoots = new WeakMap<Element, Root>();

/**
 * Mounts `element` into `mountPoint`.
 *
 * When `platform_editor_react19_migration` is **on**, uses the React 18/19 `createRoot`
 * API wrapped in `flushSync` so the render is synchronous – matching the
 * legacy `ReactDOM.render` timing that ProseMirror decoration widgets depend
 * on (focus management, anchor positioning, block-menu visibility all read
 * the rendered DOM immediately after the callback returns).
 *
 * Otherwise, falls back to the legacy `ReactDOM.render` path. The API is not
 * available in React 19, so the root path is also selected when the legacy
 * method has been removed.
 */
export const renderToMountPoint = (element: ReactElement, mountPoint: Element): void => {
	if (
		isExperimentEnabled('platform_editor_react19_migration') ||
		typeof ReactDOM.render !== 'function'
	) {
		let root = reactRoots.get(mountPoint);

		if (!root) {
			root = createRoot(mountPoint);
			reactRoots.set(mountPoint, root);
		}

		const activeRoot = root;

		// flushSync makes createRoot render synchronously, matching legacy
		// ReactDOM.render timing that the widget/focus/positioning code depends on.
		flushSync(() => activeRoot.render(element));
	} else {
		ReactDOM.render(element, mountPoint);
	}
};

/**
 * Unmounts the React tree at `mountPoint`.
 *
 * When `platform_editor_react19_migration` is **on**, looks up the root in the shared
 * registry, calls `root.unmount()`, and removes the entry.
 *
 * Otherwise, falls back to `ReactDOM.unmountComponentAtNode`.
 */
export const unmountFromMountPoint = (mountPoint: Element): void => {
	if (
		isExperimentEnabled('platform_editor_react19_migration') ||
		typeof ReactDOM.render !== 'function'
	) {
		const root = reactRoots.get(mountPoint);

		if (root) {
			root.unmount();
			reactRoots.delete(mountPoint);
		}
	} else {
		ReactDOM.unmountComponentAtNode(mountPoint);
	}
};
