import { Schema, Slice } from '@atlaskit/editor-prosemirror/model';
import { ReplaceStep, Transform } from '@atlaskit/editor-prosemirror/transform';

import { createMoveMapStep } from '../movedContent'; // Adjust path to your file

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

// Tests for createMoveMapStep
describe('createMoveMapStep', () => {
	it('returns undefined if previousStep is not a ReplaceStep', () => {
		const transform = new Transform(createDoc('Hello world'));
		const previousStep = {};
		const mappedStep = createReplaceStep(0, 5, createDoc('Hello').slice(0, 5));
		const result = createMoveMapStep(mappedStep, previousStep as any, transform, 0);
		expect(result).toBeUndefined();
	});
	it('returns undefined if mapped step is null', () => {
		const transform = new Transform(createDoc('Hello world'));
		const previousStep = createReplaceStep(0, 5, createDoc('Hello').slice(0, 5));
		const result = createMoveMapStep(null, previousStep, transform, 0);
		expect(result).toBeUndefined();
	});
	it('returns undefined if no diff is found', () => {
		const transform = new Transform(createDoc('Hello world'));
		const previousDoc = createDoc('Hello');
		const previousStep = createReplaceStep(0, 5, previousDoc.slice(0, 5));
		const mappedStep = createReplaceStep(0, 5, previousDoc.slice(0, 5));
		// Mock transform docs
		transform.docs.push(previousDoc);
		const result = createMoveMapStep(mappedStep, previousStep, transform, 0);
		expect(result).toBeUndefined();
	});

	it('should return undefined if there is no diff', () => {
		const originalDoc = createDoc('Hello world');
		const updatedDoc = createDoc('Hello'); // Simulates a deletion of " world"

		const previousStep = createReplaceStep(5, 11, Slice.empty); // Deleting " world"
		const mappedStep = createReplaceStep(5, 5, originalDoc.slice(5, 11)); // Original mapped step

		const transform = new Transform(originalDoc);
		transform.docs.push(updatedDoc);
		transform.docs.push(originalDoc);

		const result = createMoveMapStep(mappedStep, previousStep, transform, 1);

		expect(result).toBeUndefined();
	});

	it('should create a move step when shifting backwards', () => {
		const originalDoc = createDoc('Hello world');

		const previousStep = createReplaceStep(7, 12, Slice.empty);
		const mappedStep = createReplaceStep(6, 6, originalDoc.slice(8, 12)); // mapped step must be different from original

		const transform = new Transform(originalDoc);
		transform.step(previousStep);
		transform.step(mappedStep);

		const result = createMoveMapStep(mappedStep, previousStep, transform, 0);

		expect(result).toBeInstanceOf(ReplaceStep);
		expect(result?.from).toBe(6);
		expect(result?.to).toBe(6);
		expect(result?.slice.content.size).toBe(1);
	});

	it('should create a move step when shifting forwards', () => {
		const originalDoc = createDoc('Hello world');

		const previousStep = createReplaceStep(1, 6, Slice.empty);
		const mappedStep = createReplaceStep(7, 7, originalDoc.slice(1, 5));

		const transform = new Transform(originalDoc);
		transform.step(previousStep);
		transform.step(mappedStep);

		const result = createMoveMapStep(mappedStep, previousStep, transform, 0);

		expect(result).toBeInstanceOf(ReplaceStep);
		expect(result?.from).toBe(11);
		expect(result?.to).toBe(11);
		expect(result?.slice.content.size).toBe(1);
	});

	it('should create a delete step', () => {
		const originalDoc = createDoc('Hello world');

		const previousStep = createReplaceStep(1, 6, Slice.empty);
		const mappedStep = createReplaceStep(7, 7, originalDoc.slice(1, 7));

		const transform = new Transform(originalDoc);
		transform.step(previousStep);
		transform.step(mappedStep);

		const result = createMoveMapStep(mappedStep, previousStep, transform, 0);

		expect(result).toBeInstanceOf(ReplaceStep);
		expect(result?.from).toBe(12);
		expect(result?.to).toBe(13);
		expect(result?.slice.content.size).toBe(0);
	});

	it('should return undefined for a delete step with invalid index (small)', () => {
		const originalDoc = createDoc('Hello world');

		const previousStep = createReplaceStep(1, 6, Slice.empty);
		const mappedStep = createReplaceStep(7, 7, originalDoc.slice(1, 7));

		const transform = new Transform(originalDoc);
		transform.step(previousStep);
		transform.step(mappedStep);

		const result = createMoveMapStep(mappedStep, previousStep, transform, -1);

		expect(result).toBe(undefined);
	});

	it('should return undefined for a delete step with invalid index (large)', () => {
		const originalDoc = createDoc('Hello world');

		const previousStep = createReplaceStep(1, 6, Slice.empty);
		const mappedStep = createReplaceStep(7, 7, originalDoc.slice(1, 7));

		const transform = new Transform(originalDoc);
		transform.step(previousStep);
		transform.step(mappedStep);

		const result = createMoveMapStep(mappedStep, previousStep, transform, 99);

		expect(result).toBe(undefined);
	});
});
