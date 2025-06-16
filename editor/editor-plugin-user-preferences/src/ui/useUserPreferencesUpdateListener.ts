import { useEffect } from 'react';

import { ResolvedUserPreferences } from '@atlaskit/editor-common/user-preferences';
import { EditorView } from '@atlaskit/editor-prosemirror/view';

import { userPreferencesPluginKey } from '../pm-plugins/main';

export const useUserPreferencesUpdateListener = (
	editorView: EditorView,
	resolvedUserPreferences: ResolvedUserPreferences | null,
) => {
	useEffect(() => {
		if (resolvedUserPreferences) {
			editorView.dispatch(
				editorView.state.tr.setMeta(userPreferencesPluginKey, {
					preferences: resolvedUserPreferences,
				}),
			);
		}
	}, [resolvedUserPreferences, editorView]);
};
