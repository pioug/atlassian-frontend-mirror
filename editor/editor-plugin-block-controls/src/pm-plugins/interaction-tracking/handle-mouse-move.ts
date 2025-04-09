import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { stopEditing } from './commands';
import { getInteractionTrackingState } from './pm-plugin';

export const handleMouseMove = (view: EditorView) => {
	const state = getInteractionTrackingState(view.state);
	// if user has stopped editing and moved their mouse, show block controls again
	if (state?.isEditing) {
		stopEditing(view);
	}

	return false;
};
