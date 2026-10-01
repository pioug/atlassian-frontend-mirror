import { useEffect, useRef } from 'react';

import type { EditorContainerWidth as WidthPluginState } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { setEditorWidth } from './setEditorWidth';
import { useRefreshWidthOnTransitionNext } from './useRefreshOnTransitionNext';

/**
 * Copy of `useResizeWidthObserver` selected by `platform_editor_reduce_forced_layout`. On cleanup,
 * rename this over that file.
 *
 * The legacy hook keyed the first effect on `editorView.dom.clientWidth`. Dependency arrays are
 * evaluated during render, so it measured layout on every render rather than when the width
 * actually changed. It existed to catch `full-width` <-> `full-page`, where `clientWidth` changes
 * without the container resizing; `widthTransitionCount` detects that without measuring.
 *
 * That first effect now runs only for a transition. The observer already reports both values when
 * it starts observing, so mount needs no measurement of its own.
 *
 * The `clientWidth` read below is not usually a forced layout, because ResizeObserver callbacks
 * run after layout. Another observer's callback can write to the DOM before ours in the same
 * delivery cycle, in which case it is.
 */
export const useResizeWidthObserverNext: (props: {
	containerElement: HTMLElement | null;
	editorView: EditorView;
}) => void = ({ editorView, containerElement }) => {
	const widthTransitionCount = useRefreshWidthOnTransitionNext(containerElement);
	const lastMeasuredTransition = useRef(widthTransitionCount);

	useEffect(() => {
		// `apply` spreads meta over state, so dispatching an explicit `undefined` would overwrite
		// the existing width.
		if (!containerElement) {
			return;
		}

		// only update editor width state after change editor layout
		if (lastMeasuredTransition.current === widthTransitionCount) {
			return;
		}
		lastMeasuredTransition.current = widthTransitionCount;

		const newState: Partial<WidthPluginState> = {
			lineLength: editorView.dom.clientWidth,
			width: containerElement.offsetWidth,
		};
		setEditorWidth(newState)(editorView);
	}, [editorView, widthTransitionCount, containerElement]);

	useEffect(() => {
		if (!containerElement) {
			return;
		}

		const resizeWidth: ResizeObserverCallback = (entries) => {
			// A delivery can batch several entries for the observed target; the last is current.
			const fullAreaSize = entries[entries.length - 1];

			if (!fullAreaSize || !Array.isArray(fullAreaSize.borderBoxSize)) {
				return;
			}

			// `Array.isArray` passes for `[]`, which some polyfills produce. Bail rather than
			// dispatch `undefined`, which would overwrite the width via the spread in `apply`.
			const width = fullAreaSize.borderBoxSize[0]?.inlineSize;

			if (width === undefined) {
				return;
			}

			const lineLength = editorView.dom.clientWidth;

			setEditorWidth({
				width,
				lineLength,
			})(editorView);
		};

		const resizeObserver = new ResizeObserver(resizeWidth);
		resizeObserver.observe(containerElement);

		return () => {
			resizeObserver.disconnect();
		};
	}, [containerElement, editorView]);
};
