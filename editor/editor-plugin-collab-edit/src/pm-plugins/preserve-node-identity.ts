import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

/**
 * Walk two Fragments (old and new) and return a Fragment that reuses old node
 * references wherever structurally equal (`node.eq()` returns true).
 *
 * This preserves referential identity (`===`) for unchanged subtrees, which is
 * critical for ProseMirror's view reconciliation performance. The `preMatch`
 * optimisation in `prosemirror-view/src/viewdesc.ts` uses `===` to fast-match
 * nodes against existing view descriptors. When all nodes are fresh objects
 * (e.g. after `Node.fromJSON` in `replaceDocument`), `preMatch` fails for
 * everything, and the fallback scan in `syncToMarks` is limited to 3
 * positions — causing mark wrappers to be destroyed and recreated when widget
 * decorations (gap cursor, telepointers, block controls) shift indices beyond
 * that window. The destroyed mark wrappers take their React nodeviews with
 * them, causing visible flicker.
 *
 * By preserving identity here, we ensure `preMatch` succeeds for unchanged
 * subtrees, preventing unnecessary mark wrapper destruction and React nodeview
 * re-mounting.
 *
 * @param oldFragment - Fragment from the current editor state (holds existing node references)
 * @param newFragment - Fragment parsed from incoming document (fresh node objects)
 * @returns A Fragment that reuses old node references where possible
 *
 * @see https://hello.jira.atlassian.cloud/browse/EDITOR-5277
 * @see https://hello.jira.atlassian.cloud/browse/EDITOR-4424
 */
export function preserveNodeIdentity(oldFragment: Fragment, newFragment: Fragment): Fragment {
	// Fast path: referentially identical — nothing to do
	if (oldFragment === newFragment) {
		return oldFragment;
	}

	// Fast path: structurally equal — reuse old fragment entirely.
	// This covers the common SSR case where collab init sends the same doc.
	if (oldFragment.eq(newFragment)) {
		return oldFragment;
	}

	// Walk children position-by-position and preserve what we can
	const oldCount = oldFragment.childCount;
	const newCount = newFragment.childCount;

	let changed = false;
	const children: Node[] = [];

	for (let i = 0; i < newCount; i++) {
		const newChild = newFragment.child(i);

		if (i < oldCount) {
			const oldChild = oldFragment.child(i);

			if (oldChild === newChild) {
				// Already referentially identical
				children.push(newChild);
			} else if (oldChild.eq(newChild)) {
				// Structurally equal — reuse old reference (THE KEY OPERATION)
				children.push(oldChild);
			} else if (
				oldChild.type === newChild.type &&
				oldChild.sameMarkup(newChild) &&
				oldChild.content.childCount > 0 &&
				newChild.content.childCount > 0 &&
				expValEquals('platform_editor_preserve_node_identity', 'isRecursive', true)
			) {
				// Same type and markup but different content — recurse into children
				const preservedContent = preserveNodeIdentity(oldChild.content, newChild.content);
				if (preservedContent === oldChild.content) {
					// All content was preserved — reuse old node entirely
					children.push(oldChild);
				} else {
					// Partially changed — create node with preserved content
					children.push(oldChild.copy(preservedContent));
					changed = true;
				}
			} else {
				// Completely different node — use new
				children.push(newChild);
				changed = true;
			}
		} else {
			// New child beyond old count — use as-is (insertion)
			children.push(newChild);
			changed = true;
		}
	}

	// If nothing changed and counts match, return old fragment directly
	// (avoids creating a new Fragment object)
	if (!changed && oldCount === newCount) {
		return oldFragment;
	}

	return Fragment.from(children);
}
