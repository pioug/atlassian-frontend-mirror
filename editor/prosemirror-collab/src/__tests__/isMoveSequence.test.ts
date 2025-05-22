import { Schema, Slice } from '@atlaskit/editor-prosemirror/model';
import {
	Step,
	ReplaceStep,
	ReplaceAroundStep,
	Transform,
} from '@atlaskit/editor-prosemirror/transform';

import { Rebaseable } from '../index';
import { isMoveSequence } from '../movedContent';

const createRebaseableStep = (
	step: Step,
	origin: Pick<Transform, 'docs' | 'steps'>,
): Rebaseable => ({
	step,
	origin: origin as Transform,
	inverted: step.invert(origin.docs[origin.docs.length - 1]),
});

const schema = new Schema({
	nodes: {
		doc: { content: 'block+' },
		paragraph: { content: 'text*', group: 'block' },
		text: { inline: true },
	},
	marks: {},
});

const createDoc = (content: string) => {
	const paragraph = schema.nodes.paragraph.createAndFill({}, schema.text(content));
	// @ts-expect-error
	return schema.nodes.doc.createAndFill({}, [paragraph])!;
};

const createReplaceStep = (from: number, to: number, slice: Slice) => {
	return new ReplaceStep(from, to, slice);
};
const createDeleteStep = (from: number, to: number) => {
	return new ReplaceStep(from, to, Slice.empty);
};

// Tests for isMoveSequence
describe('isMoveSequence', () => {
	it('returns true for a valid move sequence (cut + paste)', () => {
		const originalDoc = createDoc('Hello world');

		const deletionStep = createDeleteStep(0, 6);
		const insertionStep = createReplaceStep(6, 6, originalDoc.slice(0, 6));

		const previousRebaseableStep = createRebaseableStep(deletionStep, {
			steps: [deletionStep],
			docs: [originalDoc],
		});

		const result = isMoveSequence(previousRebaseableStep, insertionStep);

		expect(result).toBe(true);
	});

	it('returns false if steps are not replace steps', () => {
		const originalDoc = createDoc('Hello world');

		const nonReplaceStep = new ReplaceAroundStep(0, 6, 0, 0, Slice.empty, 0);
		const insertionStep = createReplaceStep(6, 6, originalDoc.slice(0, 6));

		const previousRebaseableStep = createRebaseableStep(nonReplaceStep, {
			steps: [nonReplaceStep],
			docs: [originalDoc],
		});

		const result = isMoveSequence(previousRebaseableStep, insertionStep);

		expect(result).toBe(false);
	});

	it('returns false if deletion and insertion slices do not match', () => {
		const originalDoc = createDoc('Hello world');

		const deletionStep = createDeleteStep(0, 6);
		const mismatchedInsertionStep = createReplaceStep(6, 6, schema.text('Different').slice(0));

		const previousRebaseableStep = createRebaseableStep(deletionStep, {
			steps: [deletionStep],
			docs: [originalDoc],
		});

		const result = isMoveSequence(previousRebaseableStep, mismatchedInsertionStep);

		expect(result).toBe(false);
	});

	it('returns false if the deletion step does not match the expected size', () => {
		const originalDoc = createDoc('Hello world');

		const deletionStep = createReplaceStep(0, 5, originalDoc.slice(5));
		const insertionStep = createReplaceStep(6, 6, originalDoc.slice(0, 6));

		const previousRebaseableStep = createRebaseableStep(deletionStep, {
			steps: [deletionStep],
			docs: [originalDoc],
		});

		const result = isMoveSequence(previousRebaseableStep, insertionStep);

		expect(result).toBe(false);
	});

	it('returns false if no matching origin document slice is found', () => {
		const deletionStep = createDeleteStep(0, 6);
		const insertionStep = createReplaceStep(6, 6, schema.text('Hello').slice(0));

		const previousRebaseableStep = createRebaseableStep(deletionStep, {
			steps: [],
			docs: [createDoc('Different origin')], // Mismatched original doc
		});

		const result = isMoveSequence(previousRebaseableStep, insertionStep);

		expect(result).toBe(false);
	});
});
