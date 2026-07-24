import type { Command } from '@atlaskit/editor-common/types';
import { splitBlockAs } from '@atlaskit/editor-prosemirror/commands';
import type { NodeType, ResolvedPos } from '@atlaskit/editor-prosemirror/model';

// eslint-disable-next-line require-unicode-regexp
const WHITESPACE_ONLY = /^\s+$/;

/**
 * Determines whether the current selection is inside a heading, positioned after
 * all of the heading's visible (non-whitespace) content but *before* one or more
 * trailing whitespace characters.
 *
 * In this scenario ProseMirror's default `splitBlock` treats the cursor as *not*
 * being at the end of the node (`atEnd === false`), because there is still
 * (whitespace) content between the cursor and the node boundary. As a result the
 * newly split-off block inherits the heading type instead of becoming a
 * paragraph — even though, visually, the cursor looks like it is at the end of
 * the heading.
 *
 * We intentionally scope this to *only* that case:
 * - The parent must be a heading.
 * - The selection must be empty (a plain caret, not a range).
 * - There must be at least one character between the caret and the end of the
 *   heading, and every such character must be whitespace.
 *
 * All other cases (caret mid-word, caret at the true end, empty heading, etc.)
 * return `false` so the default behaviour is preserved.
 */
const isCursorAfterHeadingContentBeforeTrailingWhitespace = ($from: ResolvedPos): boolean => {
	const parent = $from.parent;
	const headingType: NodeType | undefined = $from.doc.type.schema.nodes.heading;

	if (!headingType || parent.type !== headingType) {
		return false;
	}

	// Offset of the caret within the heading's content.
	const offsetInParent = $from.parentOffset;
	const contentSize = parent.content.size;

	// If the caret is already at (or past) the end of the heading content, this is
	// the normal "atEnd" case handled correctly by the default split — skip.
	if (offsetInParent >= contentSize) {
		return false;
	}

	// The remaining text between the caret and the end of the heading.
	const trailingText = parent.textBetween(offsetInParent, contentSize);

	// Must be non-empty and consist solely of whitespace.
	return trailingText.length > 0 && WHITESPACE_ONLY.test(trailingText);
};

/**
 * A plain-Enter command that fixes the "new line after a heading with a trailing
 * space becomes another heading" bug.
 *
 * It reuses ProseMirror's `splitBlockAs` but supplies a custom `splitNode`
 * callback that forces the newly split-off block to be a paragraph *only* when
 * the caret is in a heading, after all visible content, immediately before
 * trailing whitespace. In every other case it returns `null`, which makes
 * `splitBlockAs` fall back to its default type resolution — identical to the
 * default `splitBlock` behaviour.
 *
 * The command returns `false` when the target scenario does not apply, allowing
 * other Enter handlers (lists, code blocks, base keymap) to run unchanged.
 */
export const splitHeadingWithTrailingSpace: Command = (state, dispatch, view) => {
	const { $from } = state.selection;

	// Only act on an empty caret selection inside a matching heading.
	if (!state.selection.empty || !isCursorAfterHeadingContentBeforeTrailingWhitespace($from)) {
		return false;
	}

	const paragraphType: NodeType | undefined = state.schema.nodes.paragraph;
	if (!paragraphType) {
		return false;
	}

	return splitBlockAs((_node, atEnd) => {
		// Guard again inside the callback: only override the type for the exact
		// scenario. If ProseMirror already considers us at the end, defer to the
		// default (return null).
		if (atEnd) {
			return null;
		}
		return { type: paragraphType };
	})(state, dispatch, view);
};
