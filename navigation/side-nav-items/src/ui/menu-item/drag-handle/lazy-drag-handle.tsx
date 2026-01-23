// Using `lazy` so that only consumers who want drag and drop
// need to include code for the drag handle.
import { lazy } from 'react';

/**
 * Exposing this for use by custom components
 */
export const LazyDragHandle = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_nav4-menu-item-drag-handle" */
			'./drag-handle'
		),
);
