import { useEffect } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { useSmartLinkEvents } from '@atlaskit/smart-card';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { registerSmartCardEvents } from '../pm-plugins/actions';

export const EditorSmartCardEvents = ({ editorView }: { editorView: EditorView }) => {
	const events = useSmartLinkEvents();
	useEffect(() => {
		if (
			!events ||
			(expValEquals('platform_editor_hydratable_ui', 'isEnabled', true) && !editorView)
		) {
			return;
		}
		editorView.dispatch(registerSmartCardEvents(events)(editorView.state.tr));
	}, [events, editorView]);
	return null;
};
