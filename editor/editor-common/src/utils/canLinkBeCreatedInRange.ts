import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export const canLinkBeCreatedInRange =
	(from: number, to: number) =>
	(state: EditorState): boolean => {
		if (!state.doc.rangeHasMark(from, to, state.schema.marks.link)) {
			const $from = state.doc.resolve(from);
			const $to = state.doc.resolve(to);
			const link = state.schema.marks.link;

			if ($from.parent === $to.parent && $from.parent.isTextblock) {
				if ($from.parent.type.allowsMarkType(link)) {
					let allowed = true;
					state.doc.nodesBetween(from, to, (node) => {
						const hasInlineCard = node.type === state.schema.nodes.inlineCard;

						allowed = allowed && !node.marks.some((m) => m.type.excludes(link)) && !hasInlineCard;
						return allowed;
					});
					return allowed;
				}
			}
		}
		return false;
	};
