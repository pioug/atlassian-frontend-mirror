import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep, type Step } from '@atlaskit/editor-prosemirror/transform';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

interface TransactionMetadata {
	from: number;
	to: number;
	numReplaceSteps: number;
	isAllText: boolean;
	// represents if the transaction contains replaced content with another of the same size (e.g. empty paragraph node with a paragraph node)
	isReplacedWithSameSize: boolean;
}

/**
 * Checks if step adds inline char
 * @param s
 * @returns True if step adds inline char
 */
export const isStepText = (s: ReplaceStep): boolean => {
	const content = s.slice.content.firstChild;
	return s.from === s.to && s.slice.content.childCount === 1 && !!content && !!content.text;
};

/**
 * Checks if step is an inline delete/backspace (replace range from -> from + 1 with empty content)
 * @param s
 * @returns True if delete/backspace
 */
export const isStepDelete = (s: ReplaceStep): boolean => {
	const content = s.slice.content;
	return s.to === s.from + 1 && content.size === 0;
};

/**
 * Check if content being replaced is replaced with another of the same size
 * This can occur on empty docs and 'backspace' is pressed, the paragraph node is re-drawn
 * @param s
 * @returns True if content being replaced is replaced with another of the same size
 */
const isStepContentReplacedWithAnotherOfSameSize = (s: Step): boolean => {
	if (s instanceof ReplaceAroundStep) {
		const replacedContentSize = s.to - s.from;
		return s.slice.content.size === replacedContentSize;
	}
	return false;
};

/**
 * Get metadata from the transaction.
 * @param tr
 * @returns Min 'from', max 'to' (from + slice size, or mapped 'to', whichever is larger). If no steps, returns pos range of entire doc.
 * Number of ReplaceStep and ReplaceAroundStep steps 'numReplaceSteps'.
 * 'isAllText' if all steps are represent adding inline text or a backspace/delete or no-op
 */
export const getTrMetadata = (tr: Transaction | ReadonlyTransaction): TransactionMetadata => {
	let from: number | undefined;
	let to: number | undefined;
	let numReplaceSteps = 0;
	let isAllText = true;
	let isReplacedWithSameSize = false;

	tr.steps.forEach((s: Step) => {
		if (s instanceof ReplaceStep || s instanceof ReplaceAroundStep) {
			if (
				s instanceof ReplaceAroundStep ||
				(s instanceof ReplaceStep && !isStepText(s) && !isStepDelete(s))
			) {
				isAllText = false;
			}
			if (editorExperiment('platform_editor_controls', 'variant1')) {
				isReplacedWithSameSize = isStepContentReplacedWithAnotherOfSameSize(s);
			}
			const mappedTo = tr.mapping.map(s.to);
			let $to = s.from + s.slice.size;
			$to = $to > mappedTo ? $to : mappedTo;
			from = from === undefined || from > s.from ? s.from : from;
			to = to === undefined || to < $to ? $to : to;
			numReplaceSteps++;
		}
	});
	if (from === undefined) {
		from = 0;
	}
	if (to === undefined || to > tr.doc.nodeSize - 2) {
		to = tr.doc.nodeSize - 2;
	}
	return { from, to, numReplaceSteps, isAllText, isReplacedWithSameSize };
};
