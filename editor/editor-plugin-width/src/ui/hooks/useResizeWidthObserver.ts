import { useEffect } from 'react';

import type { EditorContainerWidth as WidthPluginState } from '@atlaskit/editor-common/types';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import { pluginKey } from '../../pm-plugins/plugin-key';

import { useRefreshWidthOnTransition } from './useRefreshOnTransition';

export const setEditorWidth = (props: Partial<WidthPluginState>) => (editorView: EditorView) => {
	const {
		dispatch,
		state: { tr },
	} = editorView;

	tr.setMeta(pluginKey, props);

	dispatch(tr);
};

/**
 * Tracks the current width of the editor and its container in plugin state for plugins to listen to
 *
 * @param editorView EditorView - used to get the DOM element and dispatch transactions
 * @param containerElement HMTLElement - the container of the editor used to measure the current width
 */
export function useResizeWidthObserver({
	editorView,
	containerElement,
}: {
	editorView: EditorView;
	containerElement: HTMLElement | null;
}) {
	useRefreshWidthOnTransition(containerElement);

	useEffect(() => {
		const resizeWidth: ResizeObserverCallback = (entries) => {
			if (entries.length < 1) {
				return;
			}

			const fullAreaSize = entries.find((entry) => entry.target === containerElement);
			const editorViewDOMSize = entries.find((entry) => entry.target === editorView.dom);

			const width = fullAreaSize?.borderBoxSize[0]?.inlineSize;
			const lineLength = editorViewDOMSize?.borderBoxSize[0]?.inlineSize;

			setEditorWidth({
				width,
				lineLength,
			})(editorView);
		};

		const resizeObserver = new ResizeObserver(resizeWidth);
		if (containerElement) {
			resizeObserver.observe(containerElement);
		}
		if (editorView.dom) {
			resizeObserver.observe(editorView.dom);
		}

		return () => {
			resizeObserver.disconnect();
		};
	}, [containerElement, editorView]);
}

export const useResizeWidthObserverLegacy = ({
	editorView,
	containerElement,
}: {
	editorView: EditorView;
	containerElement: HTMLElement | null;
}) => {
	useRefreshWidthOnTransition(containerElement);

	useEffect(() => {
		const newState: Partial<WidthPluginState> = {
			lineLength: editorView.dom.clientWidth,
			width: containerElement?.offsetWidth,
		};
		setEditorWidth(newState)(editorView);
	}, [editorView, editorView.dom.clientWidth, containerElement]);

	useEffect(() => {
		const resizeWidth: ResizeObserverCallback = (entries) => {
			if (entries.length !== 1) {
				return;
			}
			const [fullAreaSize] = entries;

			if (!fullAreaSize || !Array.isArray(fullAreaSize.borderBoxSize)) {
				return;
			}

			const width = fullAreaSize.borderBoxSize[0].inlineSize;

			const lineLength = editorView.dom.clientWidth;

			setEditorWidth({
				width,
				lineLength,
			})(editorView);
		};

		const resizeObserver = new ResizeObserver(resizeWidth);
		if (containerElement) {
			resizeObserver.observe(containerElement);
		}

		return () => {
			resizeObserver.disconnect();
		};
	}, [containerElement, editorView]);
};
