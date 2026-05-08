// Remove this file when experiment 'platform_editor_paste_actions_menu_v2' is cleaned up.
import type { Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

const hasTableNode = (slice: Slice | undefined): boolean => {
	if (!slice) {
		return false;
	}
	let found = false;
	slice.content.descendants((node) => {
		if (node.type.name === 'table') {
			found = true;
			return false;
		}
		return true;
	});
	return found;
};

const isNotProse = (text: string): boolean => {
	const trimmed = text.trim();
	if (!trimmed) {
		return false;
	}
	for (let i = 0; i < trimmed.length; i++) {
		const code = trimmed.charCodeAt(i);
		if (code === 0x20 || code === 0x09 || code === 0x0a || code === 0x0d) {
			return false;
		}
		if (code > 0x7f) {
			return false;
		}
	}
	return true;
};

export const firePasteActionsMenuV2ExperimentExposure = (
	contentLength: number,
	state: EditorState,
	pasteStartPos?: number,
	pasteEndPos?: number,
	pastedText?: string,
	pastedSlice?: Slice,
): void => {
	if (contentLength < 100 || !pasteStartPos || !pasteEndPos || !pastedText) {
		return;
	}

	if (isNotProse(pastedText)) {
		return;
	}

	if (hasTableNode(pastedSlice)) {
		return;
	}

	try {
		const $pos = state.doc.resolve(pasteStartPos);
		const pasteAncestorNodeNames: string[] = [];
		for (let depth = $pos.depth; depth > 0; depth--) {
			if (pasteEndPos <= $pos.end(depth)) {
				pasteAncestorNodeNames.push($pos.node(depth).type.name);
			}
		}

		const isInExcludedNode = pasteAncestorNodeNames.some((name) =>
			['codeBlock', 'heading'].includes(name),
		);

		if (!isInExcludedNode) {
			expVal('platform_editor_paste_actions_menu_v2', 'variant', 'control');
		}
	} catch {
		return;
	}
};
