import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { interactionTrackingPluginKey } from './pm-plugin';

export const stopEditing = (view: EditorView): void => {
	view.dispatch(view.state.tr.setMeta(interactionTrackingPluginKey, { type: 'stopEditing' }));
};

export const startEditing = (view: EditorView): void => {
	view.dispatch(view.state.tr.setMeta(interactionTrackingPluginKey, { type: 'startEditing' }));
};

export const mouseLeave = (view: EditorView): void => {
	view.dispatch(view.state.tr.setMeta(interactionTrackingPluginKey, { type: 'mouseLeave' }));
};

export const mouseEnter = (view: EditorView): void => {
	view.dispatch(view.state.tr.setMeta(interactionTrackingPluginKey, { type: 'mouseEnter' }));
};

export const setHoverSide = (view: EditorView, side: 'left' | 'right'): void => {
	view.dispatch(
		view.state.tr.setMeta(interactionTrackingPluginKey, { type: 'setHoverSide', side }),
	);
};

export const clearHoverSide = (view: EditorView): void => {
	view.dispatch(view.state.tr.setMeta(interactionTrackingPluginKey, { type: 'clearHoverSide' }));
};
