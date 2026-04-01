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

	// Check each character: if we find whitespace it's prose-like,
	// if we find a non-ASCII character it's likely CJK/Thai/etc.
	for (let i = 0; i < trimmed.length; i++) {
		const code = trimmed.charCodeAt(i);
		// Whitespace (space, tab, newline, etc.) → prose-like
		if (code === 0x20 || code === 0x09 || code === 0x0a || code === 0x0d) {
			return false;
		}
		// Non-ASCII character → likely a non-Latin script (CJK, Thai, etc.)
		if (code > 0x7f) {
			return false;
		}
	}

	// No whitespace and all ASCII → URL, token, path, etc.
	return true;
};

// Remove this file when experiment `platform_editor_paste_actions_menu` is cleaned up.
// Manual exposure event for `platform_editor_paste_actions_menu`. Due to the fact that as part of this experiment
// the paste menu was completely redesigned, it was very difficult to ensure that an exposure event fires accurately
// for both control and test cohorts without executing code paths for both menus.
// This manual exposure event executes all criteria for showing AI buttons and fires the exposure manually in a code path that
// is guaranteed to execute on both control and test.
export const firePasteActionsMenuExperimentExposure = (
	contentLength: number,
	state: EditorState,
	pasteStartPos?: number,
	pasteEndPos?: number,
	pastedText?: string,
	pastedSlice?: Slice,
) => {
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
			// Only include an ancestor if the entire pasted range is contained within it.
			// This prevents nodes like 'heading' from being flagged as ancestors when the
			// pasted content starts in a heading but extends beyond it (e.g. heading + paragraph).
			if (pasteEndPos <= $pos.end(depth)) {
				pasteAncestorNodeNames.push($pos.node(depth).type.name);
			}
		}

		const isInExcludedNode = pasteAncestorNodeNames.some((name) =>
			['codeBlock', 'heading'].includes(name),
		);

		if (!isInExcludedNode) {
			expVal('platform_editor_paste_actions_menu', 'isEnabled', false);
		}
	} catch {
		// pasteStartPos may be out of bounds if the document changed between
		// when the paste was recorded and when this effect fires.
		return;
	}
};
