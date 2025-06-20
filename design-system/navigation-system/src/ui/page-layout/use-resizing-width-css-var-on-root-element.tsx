import { useEffect } from 'react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { isPanelSplitterDragData } from './panel-splitter/panel-splitter';

/**
 * Monitors resizing on the panel splitter with the provided `panelId`
 * and writes the resizing width to the `cssVar` on the root element (`<html>`).
 */
export function useResizingWidthCssVarOnRootElement({
	isEnabled = true,
	cssVar,
	panelId,
}: {
	isEnabled?: boolean;
	cssVar: string;
	panelId: symbol;
}) {
	useEffect(() => {
		if (!isEnabled) {
			return;
		}

		return combine(
			monitorForElements({
				canMonitor({ source }) {
					return source.data.panelId === panelId;
				},
				onDrag({ source }) {
					if (!isPanelSplitterDragData(source.data)) {
						return;
					}

					/**
					 * Copies the resizing width value to the `<html>` element.
					 *
					 * Required to reflect the live width of the side navigation.
					 *
					 * Used by:
					 *   - Legacy `--leftSidebarWidth` variable
					 *   - Panel slot max-width constraint
					 *
					 * When the legacy `--leftSidebarWidth` variable is no longer needed,
					 * we could consider writing to the `Panel` element instead.
					 */
					document.documentElement.style.setProperty(cssVar, source.data.resizingWidth);
				},
				onDrop() {
					document.documentElement.style.removeProperty(cssVar);
				},
			}),
		);
	}, [cssVar, isEnabled, panelId]);

	useEffect(() => {
		if (!isEnabled) {
			return;
		}

		/**
		 * Ensures that the resizing CSS var on the `<html>` element is cleaned up properly
		 * if the component unmounts during a drag.
		 */
		return function cleanupGlobalResizingCssVar() {
			document.documentElement.style.removeProperty(cssVar);
		};
	}, [cssVar, isEnabled]);
}
