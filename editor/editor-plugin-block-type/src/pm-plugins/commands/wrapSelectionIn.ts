import { type EditorCommand } from '@atlaskit/editor-common/types';
import type { Mark, NodeType } from '@atlaskit/editor-prosemirror/model';
import { Slice, Fragment } from '@atlaskit/editor-prosemirror/model';
import { findWrapping } from '@atlaskit/editor-prosemirror/transform';

export function wrapSelectionInBlockType(nodeType: NodeType): EditorCommand {
	return ({ tr }) => {
		const { nodes } = tr.doc.type.schema;
		const { alignment, indentation } = tr.doc.type.schema.marks;

		if (nodes.paragraph && nodes.blockquote) {
			/**Remove alignment and indentation marks from the selection */
			const marksToRemove = [alignment, indentation];

			const hasMark = (mark: Mark) => marksToRemove.indexOf(mark.type) > -1;

			const not =
				<T>(fn: (args: T) => boolean) =>
				(arg: T) =>
					!fn(arg);

			/**
			 * When you need to toggle the selection
			 * when another type which does not allow alignment is applied
			 */
			tr.doc.nodesBetween(tr.selection.from, tr.selection.to, (node, pos) => {
				if (node.type === nodes.paragraph && node.marks.some(hasMark)) {
					const resolvedPos = tr.doc.resolve(pos);
					const withoutBlockMarks = node.marks.filter(not(hasMark));
					tr = tr.setNodeMarkup(resolvedPos.pos, undefined, node.attrs, withoutBlockMarks);
				}
			});

			/** Get range and wrapping needed for the selection */
			const { $from, $to } = tr.selection;
			const range = $from.blockRange($to);
			const wrapping = range && findWrapping(range, nodes.blockquote);

			if (wrapping) {
				/** Wrap the selection */
				tr.wrap(range, wrapping).scrollIntoView();
			} else {
				/** If wrapping is not possible, replace with a blockquote */
				const start = $from.start();
				const end = $to.end();

				const content = $from.node().content;
				const blockquote = nodes.blockquote.create({}, nodes.paragraph.create({}, content));
				const slice = new Slice(Fragment.from(blockquote), 0, 0);
				tr.replaceRange(start, end, slice).scrollIntoView();
			}
		}
		return tr;
	};
}
