import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { interactionTrackingPluginKey } from './pm-plugin';

export const stopEditing = (view: EditorView) => {
	view.dispatch(view.state.tr.setMeta(interactionTrackingPluginKey, { type: 'stopEditing' }));
};

export const startEditing = (view: EditorView) => {
	view.dispatch(view.state.tr.setMeta(interactionTrackingPluginKey, { type: 'startEditing' }));
};
