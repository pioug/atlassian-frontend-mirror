import { logException } from '@atlaskit/editor-common/monitoring';
import { md } from '@atlaskit/editor-common/paste';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

import type { PasteOtionsPluginState } from '../../types/types';

import { escapeLinks } from './index';

export const formatMarkdown = (
	tr: Transaction,
	pluginState: PasteOtionsPluginState,
): Transaction => {
	let pasteStartPos = pluginState.pasteStartPos;
	let pasteEndPos = pluginState.pasteEndPos;
	let plaintext = pluginState.plaintext;

	if (pasteStartPos < 0) {
		return tr;
	}

	const resolvedPasteStartPos = tr.doc.resolve(pasteStartPos);
	const parentOffset = resolvedPasteStartPos.parentOffset;
	if (parentOffset === 0 && resolvedPasteStartPos.depth > 0) {
		pasteStartPos = resolvedPasteStartPos.before();
	}

	const markdownSlice: Slice | undefined = getMarkdownSlice(
		plaintext,
		tr.doc.type.schema,
		tr.selection,
	);

	if (!markdownSlice) {
		return tr;
	}

	pasteSliceIntoTransactionWithSelectionAdjust({
		tr,
		pasteStartPos,
		pasteEndPos,
		slice: markdownSlice,
	});

	return tr;
};

export const formatRichText = (
	tr: Transaction,
	pluginState: PasteOtionsPluginState,
): Transaction => {
	let pasteStartPos = pluginState.pasteStartPos;
	let pasteEndPos = pluginState.pasteEndPos;
	const richTextSlice = pluginState.richTextSlice;

	if (pasteStartPos < 0) {
		return tr;
	}

	if (richTextSlice.content.size === 0) {
		return tr;
	}

	const resolvedPasteStartPos = tr.doc.resolve(pasteStartPos);
	const parentOffset = resolvedPasteStartPos.parentOffset;
	if (parentOffset === 0 && resolvedPasteStartPos.depth > 0) {
		pasteStartPos = resolvedPasteStartPos.before();
	}

	richTextSliceTransactionWithSelectionAdjust({
		tr,
		pasteStartPos,
		pasteEndPos,
		slice: richTextSlice,
	});

	return tr;
};

export const formatPlainText = (
	tr: Transaction,
	pluginState: PasteOtionsPluginState,
): Transaction => {
	let pasteStartPos = pluginState.pasteStartPos;
	let pasteEndPos = pluginState.pasteEndPos;
	let plaintext = pluginState.plaintext;

	//not possible to create plain text slice with empty string
	if (pasteStartPos < 0 || plaintext === '') {
		return tr;
	}

	const resolvedPasteStartPos = tr.doc.resolve(pasteStartPos);
	const parentOffset = resolvedPasteStartPos.parentOffset;
	if (parentOffset === 0 && resolvedPasteStartPos.depth > 0) {
		pasteStartPos = resolvedPasteStartPos.before();
	}

	const schema = tr.doc.type.schema;
	const plainTextNode = schema.text(plaintext);
	const plainTextFragment = Fragment.from(
		schema.nodes.paragraph.createAndFill(null, plainTextNode),
	);

	const plainTextSlice = new Slice(
		plainTextFragment,
		resolvedPasteStartPos.depth,
		resolvedPasteStartPos.depth,
	);

	pasteSliceIntoTransactionWithSelectionAdjust({
		tr,
		pasteStartPos,
		pasteEndPos,
		slice: plainTextSlice,
	});

	return tr;
};

type PasteSliceIntoTransactionProps = {
	tr: Transaction;
	pasteStartPos: number;
	pasteEndPos: number;
	slice: Slice;
};
function pasteSliceIntoTransactionWithSelectionAdjust({
	tr,
	pasteStartPos,
	pasteEndPos,
	slice,
}: PasteSliceIntoTransactionProps) {
	tr.replaceRange(pasteStartPos, pasteEndPos, slice);

	// ProseMirror doesn't give a proper way to tell us where something was inserted.
	// However, we can know "how" it inserted something.
	//
	// So, instead of weird depth calculations, we can use the step produced by the transform.
	// For instance:
	//    The `replaceStep.to and replaceStep.from`, tell us the real position
	//    where the content will be insert.
	//    Then, we can use the `tr.mapping.map` to the updated position after the replace operation
	const replaceStep = tr.steps[0];

	if (!(replaceStep instanceof ReplaceStep)) {
		return tr;
	}

	const lastInsertNode = replaceStep.slice.content.lastChild;
	const emptyNodeReference = lastInsertNode?.type.createAndFill();
	const isLastNodeEmpty = emptyNodeReference?.nodeSize === lastInsertNode?.nodeSize;
	const isStepSplitingTarget = !lastInsertNode?.isLeaf && isLastNodeEmpty;

	const $nextHead = tr.doc.resolve(tr.mapping.map(replaceStep.to));

	const $nextPosition =
		isStepSplitingTarget && $nextHead.depth > 0 ? tr.doc.resolve($nextHead.before()) : $nextHead;

	// The findFrom will make search for both: TextSelection and NodeSelections.
	const nextSelection = Selection.findFrom($nextPosition, -1);

	if (nextSelection) {
		tr.setSelection(nextSelection);
	}
}
function richTextSliceTransactionWithSelectionAdjust({
	tr,
	pasteStartPos,
	pasteEndPos,
	slice,
}: PasteSliceIntoTransactionProps) {
	tr.replaceRange(pasteStartPos, pasteEndPos, slice);

	// ProseMirror doesn't give a proper way to tell us where something was inserted.
	// However, we can know "how" it inserted something.
	//
	// So, instead of weird depth calculations, we can use the step produced by the transform.
	// For instance:
	//    The `replaceStep.to and replaceStep.from`, tell us the real position
	//    where the content will be insert.
	//    Then, we can use the `tr.mapping.map` to the updated position after the replace operation
	const replaceStep = tr.steps[0];

	if (!(replaceStep instanceof ReplaceStep)) {
		return tr;
	}

	const nextPosition = tr.mapping.map(replaceStep.to);

	// The findFrom will make search for both: TextSelection and NodeSelections.
	const nextSelection = Selection.findFrom(
		tr.doc.resolve(Math.min(nextPosition, tr.doc.content.size)),
		-1,
	);

	if (nextSelection) {
		tr.setSelection(nextSelection);
	}
}

export function getMarkdownSlice(
	text: string,
	schema: Schema,
	selection: Selection,
): Slice | undefined {
	const targetOpenStartNode = selection.$from.parent;
	const targetOpenEndNode = selection.$to.parent;

	try {
		let textInput: string = text;

		const textSplitByCodeBlock = textInput.split(/```/);

		for (let i = 0; i < textSplitByCodeBlock.length; i++) {
			if (i % 2 === 0) {
				textSplitByCodeBlock[i] = textSplitByCodeBlock[i].replace(/\\/g, '\\\\');
			}
		}

		textInput = textSplitByCodeBlock.join('```');

		const atlassianMarkDownParser = new MarkdownTransformer(schema, md);
		const doc = atlassianMarkDownParser.parse(escapeLinks(textInput));

		if (!doc || !doc.content) {
			return;
		}

		const canMergeOpenStart = targetOpenStartNode.type === doc.content.firstChild?.type;
		const canMergeOpenEnd = targetOpenEndNode.type === doc.content.lastChild?.type;

		const $start = Selection.atStart(doc).$from;
		const $end = Selection.atEnd(doc).$from;

		const openStart = canMergeOpenStart ? $start.depth : 0;
		const openEnd = canMergeOpenEnd ? $end.depth : 0;

		return new Slice(doc.content, openStart, openEnd);
	} catch (error) {
		logException(error as Error, {
			location: 'editor-plugin-paste-options-toolbar/util',
		});
		return;
	}
}
