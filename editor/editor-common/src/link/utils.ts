import { getATLContextUrl } from '@atlaskit/atlassian-context';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { Predicate } from '../types';

import { linkPreferencesPath } from './constants';

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
	return getATLContextUrl('id') + linkPreferencesPath;
};
