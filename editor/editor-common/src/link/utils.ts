import { getATLContextUrl } from '@atlaskit/atlassian-context';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { Predicate } from '../types';

import {
	linkPreferencesPath,
	productionLinkPreferencesUrl,
	stagingLinkPreferencesUrl,
} from './constants';

export function isTextAtPos(pos: number): Predicate {
	return (state: EditorState) => {
		const node = state.doc.nodeAt(pos);
		return !!node && node.isText;
	};
}

export function isLinkAtPos(pos: number): Predicate {
	return (state: EditorState) => {
		const node = state.doc.nodeAt(pos);
		return !!node && !!state.schema.marks.link.isInSet(node.marks);
	};
}

export const getLinkPreferencesURLFromENV = (): string => {
	if (getBooleanFF('platform.editor.linking-preferences-url-atlassian-context')) {
		return getATLContextUrl('id') + linkPreferencesPath;
	}

	if (process.env.NODE_ENV === 'production' && process.env.CLOUD_ENV === 'staging') {
		// only a production CLOUD_ENV staging environment has a different link preferences URL
		return stagingLinkPreferencesUrl;
	} else if (process.env.NODE_ENV === 'production') {
		return productionLinkPreferencesUrl;
	} else {
		return stagingLinkPreferencesUrl;
	}
};
