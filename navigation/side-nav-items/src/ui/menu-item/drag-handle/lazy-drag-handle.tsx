import React, { type ComponentType, lazy, Suspense, useEffect, useState } from 'react';

import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

const LazyDragHandleComponent = lazy(() => {
	return import(
		/* webpackChunkName: "@atlaskit-internal_nav4-menu-item-drag-handle" */
		'./drag-handle'
	);
});

export const LazyDragHandle = componentWithFG(
	'navx-4169-improve-gsn-code',
	LazyDragHandleNEW,
	LazyDragHandleComponent,
);

/**
 * A wrapper around `React.lazy` that defers rendering until after the component has mounted.
 *
 * This avoids hydration errors because:
 * - On the server: `Component` is `null`, so nothing is rendered.
 * - On the first client render (hydration): `Component` is still `null`, matching the server HTML.
 * - After mount: `useEffect` fires, sets the lazy component, and triggers a re-render
 *   that is scoped to this component only.
 *
 * This is preferable to using `<Suspense>` around `React.lazy` directly in the parent,
 * because `<Suspense fallback={null}>` on the server renders nothing, but after hydration
 * the lazy component will resolve and produce DOM that doesn't match the server HTML.
 *
 * By deferring to after mount, both server and initial client render agree on `null`,
 * and the lazy import + Suspense only kicks in after hydration is complete.
 */
function LazyDragHandleNEW() {
	const [Component, setComponent] = useState<ComponentType | null>(null);

	useEffect(() => {
		// Using a function updater to store the component reference itself
		// (not the result of calling it)
		setComponent(() => LazyDragHandleComponent);
	}, []);

	if (!Component) {
		return null;
	}

	return (
		<Suspense fallback={null}>
			<Component />
		</Suspense>
	);
}
