import { uuid } from '@atlaskit/adf-schema';
import { type Node as PMNode, Slice, Fragment } from '@atlaskit/editor-prosemirror/model';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

/**
 * Transforms a paste slice to handle blockTaskItem nodes when pasting into task items.
 *
 * Initially we do not support user creation of blockTaskItem - it is intended primarily
 * for TinyMCE migration purposes however that may change in the future.
 * This function handles the behavior to work around Prosemirror behaviour which decides
 * that blockTaskItem is the appropriate node to use here.
 *
 * @param slice - The slice being pasted
 * @param view - The editor view where the paste is occurring
 * @returns The transformed slice with blockTaskItems converted to taskItems when appropriate
 *
 * @example
 * ```typescript
 * const transformedSlice = tempTransformSliceToRemoveBlockTaskItem(pasteSlice, editorView);
 * ```
 *
 * @see {@link https://hello.atlassian.net/wiki/spaces/EDITOR/pages/5626622054/Block+elements+in+task+-+Decision+log#Can-users-create-block-task-items%3F} for reasoning
 */
export const tempTransformSliceToRemoveBlockTaskItem = (slice: Slice, view: EditorView): Slice => {
	const { schema } = view.state;
	const { taskItem, blockTaskItem, paragraph } = schema.nodes;

	// Check if we're pasting into a taskItem
	const { $from } = view.state.selection;
	const isInTaskItem = $from.node().type === taskItem;

	if (isInTaskItem && blockTaskItem) {
		// Transform the slice to replace blockTaskItems with taskItems
		const transformedContent: PMNode[] = [];

		slice.content.forEach((node) => {
			if (node.type === blockTaskItem) {
				// Check if blockTaskItem only contains paragraphs
				let allChildrenAreParagraphs = true;
				node.content.forEach((child) => {
					if (child.type !== paragraph) {
						allChildrenAreParagraphs = false;
					}
				});

				if (allChildrenAreParagraphs && node.childCount > 0) {
					// Convert each paragraph to a taskItem
					node.content.forEach((paragraphNode) => {
						const newTaskItem = taskItem.create(
							{
								localId: uuid.generate(),
								state: node.attrs.state || 'TODO',
							},
							paragraphNode.content,
						);
						transformedContent.push(newTaskItem);
					});
				} else {
					// Keep the blockTaskItem as is if it doesn't only contain paragraphs
					transformedContent.push(node);
				}
			} else {
				// Keep other nodes as is
				transformedContent.push(node);
			}
		});

		// Create new slice with transformed content
		if (
			transformedContent.length !== slice.content.childCount ||
			transformedContent.some((node, idx) => node !== slice.content.child(idx))
		) {
			const newFragment = Fragment.from(transformedContent);
			return new Slice(newFragment, slice.openStart, slice.openEnd);
		}
	}

	return slice;
};
