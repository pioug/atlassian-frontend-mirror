import {
	createProsemirrorEditorFactory,
	Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';

import { getOfflineStepsLength, getOfflineReplaceStepsLength } from '../get-offline-steps-length';

const preset = new Preset<LightEditorPlugin>();
const createEditor = createProsemirrorEditorFactory();
const editor = () => {
	return createEditor({
		preset,
	});
};

const createStepsAndOriginsFromTransaction = (
	tr: Transaction,
): { origins: Transaction[]; steps: ProseMirrorStep[] } => {
	const so = tr.steps.map((step) => {
		return {
			step,
			origin: tr,
		};
	});
	return {
		steps: so.map((so) => so.step),
		origins: so.map((so) => so.origin),
	};
};

it('should get no offline steps if not marked', () => {
	const { editorView } = editor();
	const tr = editorView.state.tr.insertText('hi');
	const stepsAndOrigins = createStepsAndOriginsFromTransaction(tr);
	expect(getOfflineStepsLength(stepsAndOrigins.steps, stepsAndOrigins.origins)).toBe(undefined);
	expect(getOfflineReplaceStepsLength(stepsAndOrigins.steps, stepsAndOrigins.origins)).toBe(
		undefined,
	);
});

it('should get offline steps if marked', () => {
	const { editorView } = editor();
	const tr = editorView.state.tr.insertText('hi').setMeta('isOffline', true);
	const stepsAndOrigins = createStepsAndOriginsFromTransaction(tr);
	expect(getOfflineStepsLength(stepsAndOrigins.steps, stepsAndOrigins.origins)).toBe(1);
	expect(getOfflineReplaceStepsLength(stepsAndOrigins.steps, stepsAndOrigins.origins)).toBe(1);
});

it('should get multiple offline steps if marked', () => {
	const { editorView } = editor();
	const tr = editorView.state.tr.insertText('hi').insertText('world').setMeta('isOffline', true);
	const stepsAndOrigins = createStepsAndOriginsFromTransaction(tr);
	expect(getOfflineStepsLength(stepsAndOrigins.steps, stepsAndOrigins.origins)).toBe(2);
	expect(getOfflineReplaceStepsLength(stepsAndOrigins.steps, stepsAndOrigins.origins)).toBe(2);
});

it('should handle multiple transactions', () => {
	const { editorView } = editor();
	const tr = editorView.state.tr.insertText('hi').insertText('world').setMeta('isOffline', true);

	const stepsAndOrigins = createStepsAndOriginsFromTransaction(tr);
	const stepsAndOrigins2 = createStepsAndOriginsFromTransaction(tr);

	expect(
		getOfflineStepsLength(
			[...stepsAndOrigins.steps, ...stepsAndOrigins2.steps],
			[...stepsAndOrigins.origins, ...stepsAndOrigins2.origins],
		),
	).toBe(4);
	expect(
		getOfflineReplaceStepsLength(
			[...stepsAndOrigins.steps, ...stepsAndOrigins2.steps],
			[...stepsAndOrigins.origins, ...stepsAndOrigins2.origins],
		),
	).toBe(4);
});

it('should handle if steps do not match origins', () => {
	const { editorView } = editor();
	const tr = editorView.state.tr.insertText('hi').insertText('world').setMeta('isOffline', true);

	const stepsAndOrigins = createStepsAndOriginsFromTransaction(tr);
	const stepsAndOrigins2 = createStepsAndOriginsFromTransaction(tr);

	expect(getOfflineStepsLength([...stepsAndOrigins.steps, ...stepsAndOrigins2.steps], [])).toBe(
		undefined,
	);
	expect(
		getOfflineReplaceStepsLength([...stepsAndOrigins.steps, ...stepsAndOrigins2.steps], []),
	).toBe(undefined);
});

it('should only get steps marked if multiple', () => {
	const { editorView } = editor();
	const tr = editorView.state.tr.insertText('hi').insertText('world').setMeta('isOffline', true);
	const tr2 = editorView.state.tr.insertText('hi').insertText('world');

	const stepsAndOrigins = createStepsAndOriginsFromTransaction(tr);
	const stepsAndOrigins2 = createStepsAndOriginsFromTransaction(tr2);

	expect(
		getOfflineStepsLength(
			[...stepsAndOrigins.steps, ...stepsAndOrigins2.steps],
			[...stepsAndOrigins.origins, ...stepsAndOrigins2.origins],
		),
	).toBe(2);
	expect(
		getOfflineReplaceStepsLength(
			[...stepsAndOrigins.steps, ...stepsAndOrigins2.steps],
			[...stepsAndOrigins.origins, ...stepsAndOrigins2.origins],
		),
	).toBe(2);
});

it('should get offline steps if marked was offline', () => {
	const { editorView } = editor();
	const tr = editorView.state.tr.insertText('hi').setMeta('wasOffline', true);
	const stepsAndOrigins = createStepsAndOriginsFromTransaction(tr);
	expect(getOfflineStepsLength(stepsAndOrigins.steps, stepsAndOrigins.origins)).toBe(1);
	expect(getOfflineReplaceStepsLength(stepsAndOrigins.steps, stepsAndOrigins.origins)).toBe(1);
});
