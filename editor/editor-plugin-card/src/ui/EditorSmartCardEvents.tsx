import { useEffect } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { useSmartLinkEvents } from '@atlaskit/smart-card/hook/use-smart-link-events';

import { registerSmartCardEvents } from '../pm-plugins/actions';

export const EditorSmartCardEvents = ({ editorView }: { editorView: EditorView }) => {
	const events = useSmartLinkEvents();
	useEffect(() => {
		if (!events || !editorView) {
			return;
		}
		editorView.dispatch(registerSmartCardEvents(events)(editorView.state.tr));
	}, [events, editorView]);
	return null;
};
