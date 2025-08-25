import { type Slice } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

interface DetailedReplaceStep extends ReplaceStep {
	from: number;
	slice: Slice;
	to: number;
}

export const isTextInput = (tr: Transaction | ReadonlyTransaction): boolean => {
	const [step] = tr.steps;
	if (!step || !(step instanceof ReplaceStep)) {
		return false;
	}

	const {
		slice: { content },
		from,
		to,
	} = step as DetailedReplaceStep;
	const char = content.firstChild;

	return from === to && content.childCount === 1 && !!char && !!char.text && char.text.length === 1;
};
