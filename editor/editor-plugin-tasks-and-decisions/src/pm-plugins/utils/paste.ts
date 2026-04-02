import type { FontSizeMarkAttrs } from '@atlaskit/adf-schema';
import { uuid } from '@atlaskit/adf-schema';
import { getBlockMarkAttrs, getFirstParagraphBlockMarkAttrs } from '@atlaskit/editor-common/lists';
import { createBlockTaskItem, isTaskList } from '@atlaskit/editor-common/transforms';
import { Slice, Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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
const getTaskPasteContext = (
	view: EditorView,
): { isInTaskContext: boolean; smallTextAttrs: FontSizeMarkAttrs | false } => {
	const { schema, selection } = view.state;
	const { taskItem, blockTaskItem, paragraph } = schema.nodes;
	const fontSize = schema.marks?.fontSize;
	const { $from } = selection;
	const currentParent = $from.parent;
	const currentNode = typeof $from.node === 'function' ? $from.node() : undefined;

	if (currentParent?.type === taskItem || currentNode?.type === taskItem) {
		return { isInTaskContext: true, smallTextAttrs: false };
	}

	if (!blockTaskItem) {
		return { isInTaskContext: false, smallTextAttrs: false };
	}

	if (currentParent?.type === blockTaskItem || currentNode?.type === blockTaskItem) {
		return {
			isInTaskContext: true,
			smallTextAttrs: fontSize
				? getFirstParagraphBlockMarkAttrs<FontSizeMarkAttrs>(currentParent ?? currentNode, fontSize)
				: false,
		};
	}

	if (
		currentParent?.type === paragraph &&
		$from.depth > 0 &&
		$from.node($from.depth - 1).type === blockTaskItem
	) {
		return {
			isInTaskContext: true,
			smallTextAttrs: fontSize
				? getBlockMarkAttrs<FontSizeMarkAttrs>(currentParent, fontSize)
				: false,
		};
	}

	return { isInTaskContext: false, smallTextAttrs: false };
};

const convertTaskItemToBlockTaskItem = (
	node: PMNode,
	schema: Schema,
	smallTextAttrs: FontSizeMarkAttrs,
) => {
	const { fontSize } = schema.marks;

	return createBlockTaskItem({
		attrs: node.attrs,
		content: node.content,
		marks: [fontSize.create(smallTextAttrs)],
		schema,
	});
};

const addSmallTextToBlockTaskItem = (
	node: PMNode,
	schema: Schema,
	smallTextAttrs: FontSizeMarkAttrs,
) => {
	const { paragraph } = schema.nodes;
	const { fontSize } = schema.marks;
	const newContent: PMNode[] = [];
	node.content.forEach((child) => {
		if (child.type === paragraph) {
			newContent.push(
				paragraph.createChecked(
					child.attrs,
					child.content,
					child.marks
						.filter((mark) => mark.type !== fontSize)
						.concat(fontSize.create(smallTextAttrs)),
				),
			);
		} else {
			newContent.push(child);
		}
	});
	return node.type.create(node.attrs, newContent);
};

const normalizeBlockTaskItemToTaskItems = (node: PMNode, schema: Schema): PMNode[] => {
	const { taskItem, blockTaskItem, paragraph } = schema.nodes;

	if (!blockTaskItem || node.type !== blockTaskItem) {
		return [node];
	}

	let allChildrenAreParagraphs = true;
	node.content.forEach((child) => {
		if (child.type !== paragraph) {
			allChildrenAreParagraphs = false;
		}
	});

	if (allChildrenAreParagraphs && node.childCount > 0) {
		const transformedContent: PMNode[] = [];
		node.content.forEach((paragraphNode) => {
			transformedContent.push(
				taskItem.create(
					{
						localId: uuid.generate(),
						state: node.attrs.state || 'TODO',
					},
					paragraphNode.content,
				),
			);
		});
		return transformedContent;
	}

	return [node];
};

const transformSliceContent = (slice: Slice, transformNode: (node: PMNode) => PMNode[]): Slice => {
	const transformedContent: PMNode[] = [];
	slice.content.forEach((node) => {
		transformedContent.push(...transformNode(node));
	});

	if (
		transformedContent.length !== slice.content.childCount ||
		transformedContent.some((node, idx) => node !== slice.content.child(idx))
	) {
		const newFragment = Fragment.from(transformedContent);
		return new Slice(newFragment, slice.openStart, slice.openEnd);
	}

	return slice;
};

const transformSliceToRemoveBlockTaskItemLegacy = (slice: Slice, view: EditorView): Slice => {
	const { schema } = view.state;
	const { taskItem, blockTaskItem } = schema.nodes;
	const isInTaskItem = view.state.selection.$from.node().type === taskItem;

	if (!isInTaskItem || !blockTaskItem) {
		return slice;
	}

	return transformSliceContent(slice, (node) => normalizeBlockTaskItemToTaskItems(node, schema));
};

export const normalizeNodeForTaskTextSize = (
	node: PMNode,
	schema: Schema,
	smallTextAttrs: FontSizeMarkAttrs | false,
): PMNode[] => {
	const { taskList, taskItem, blockTaskItem } = schema.nodes;
	const { fontSize } = schema.marks;

	if (!smallTextAttrs) {
		return [node];
	}

	if (isTaskList(node.type)) {
		const transformedChildren: PMNode[] = [];
		node.content.forEach((child) => {
			transformedChildren.push(...normalizeNodeForTaskTextSize(child, schema, smallTextAttrs));
		});
		return [taskList.create(node.attrs, transformedChildren)];
	}

	if (blockTaskItem && fontSize) {
		if (node.type === taskItem) {
			return [convertTaskItemToBlockTaskItem(node, schema, smallTextAttrs)];
		}
		if (node.type === blockTaskItem) {
			return [addSmallTextToBlockTaskItem(node, schema, smallTextAttrs)];
		}
	}

	return [node];
};

const normalizeNodeForTaskPaste = (
	node: PMNode,
	schema: Schema,
	smallTextAttrs: FontSizeMarkAttrs | false,
): PMNode[] => {
	if (smallTextAttrs) {
		return normalizeNodeForTaskTextSize(node, schema, smallTextAttrs);
	}

	return normalizeBlockTaskItemToTaskItems(node, schema);
};

export const tempTransformSliceToRemoveBlockTaskItem = (slice: Slice, view: EditorView): Slice => {
	const fontSizeExperimentEnabled = expValEquals(
		'platform_editor_small_font_size',
		'isEnabled',
		true,
	);

	if (!fontSizeExperimentEnabled) {
		return transformSliceToRemoveBlockTaskItemLegacy(slice, view);
	}

	const { blockTaskItem } = view.state.schema.nodes;
	const { isInTaskContext, smallTextAttrs } = getTaskPasteContext(view);

	if (!isInTaskContext || !blockTaskItem) {
		return slice;
	}

	return transformSliceContent(slice, (node) =>
		normalizeNodeForTaskPaste(node, view.state.schema, smallTextAttrs),
	);
};
