import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { type Jast } from '@atlaskit/jql-ast';

import { JQLAstPluginKey } from './index';

export const getJastFromState = (state: EditorState): Jast => {
	const jast = JQLAstPluginKey.getState(state);
	// This should never happen as the JQLAstPlugin will always be configured but we'll handle this case anyway to keep TS happy.
	if (jast == null) {
		// eslint-disable-next-line no-console
		console.error('Unable to get state from the JQLAstPlugin as it has not been configured.');
		return {
			query: undefined,
			represents: '',
			errors: [],
		};
	}

	return jast;
};
