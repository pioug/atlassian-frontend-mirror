import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export const DISPLAY_AS_OPTIONS = ['url', 'inline', 'block', 'embed'] as const;
export type DisplayAsOption = (typeof DISPLAY_AS_OPTIONS)[number];

export const getCardAtPasteRange = (
	state: EditorState,
	pasteStartPos: number,
	pasteEndPos: number,
): { appearance: Exclude<DisplayAsOption, 'url'>; pos: number } | undefined => {
	let result: { appearance: Exclude<DisplayAsOption, 'url'>; pos: number } | undefined;
	const docContentSize = state.doc.content.size;
	const clampedStart = Math.max(0, Math.min(pasteStartPos, docContentSize));
	const clampedEnd = Math.max(0, Math.min(pasteEndPos, docContentSize));
	const from = Math.min(clampedStart, clampedEnd);
	const to = Math.max(clampedStart, clampedEnd);
	try {
		state.doc.nodesBetween(from, to, (node, pos) => {
			if (
				node.type.name === 'inlineCard' ||
				node.type.name === 'blockCard' ||
				node.type.name === 'embedCard'
			) {
				result = {
					appearance:
						node.type.name === 'inlineCard'
							? 'inline'
							: node.type.name === 'blockCard'
								? 'block'
								: 'embed',
					pos,
				};
				return false;
			}
			return true;
		});
	} catch {
		return;
	}
	return result;
};
