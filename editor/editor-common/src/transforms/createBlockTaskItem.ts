import type { Fragment, Mark, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

export const createBlockTaskItem = ({
	attrs,
	content,
	marks,
	schema,
}: {
	attrs?: Record<string, unknown> | null;
	content: PMNode[] | Fragment;
	marks?: readonly Mark[];
	schema: Schema;
}): PMNode => {
	const { blockTaskItem, paragraph } = schema.nodes;

	const newParagraph = paragraph.createChecked(
		null,
		content,
		marks?.filter((mark) => blockTaskItem.allowsMarkType(mark.type)),
	);

	return blockTaskItem.create(attrs ?? null, newParagraph);
};
