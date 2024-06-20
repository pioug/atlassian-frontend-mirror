import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	type EditorState,
	TextSelection,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { AddMarkStep, AddNodeMarkStep } from '@atlaskit/editor-prosemirror/transform';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { type EditorViewModeEffectsPlugin } from './types';
import { ViewModeNodeStep, ViewModeStep } from './viewModeStep';

const createFilterStepsPlugin =
	(api: ExtractInjectionAPI<EditorViewModeEffectsPlugin> | undefined) => () =>
		new SafePlugin({
			filterTransaction: (tr: Transaction) => {
				const mode = api?.editorViewMode?.sharedState.currentState()?.mode;

				if (mode !== 'view') {
					return true;
				}

				if (tr.getMeta('isRemote')) {
					return true;
				}

				const viewModeSteps = tr.steps.reduce<(ViewModeStep | ViewModeNodeStep)[]>((acc, s) => {
					if (getBooleanFF('platform.editor.live-view.comments-in-media-toolbar-button')) {
						if (s instanceof ViewModeNodeStep || s instanceof ViewModeStep) {
							acc.push(s);
						}
					} else {
						if (s instanceof ViewModeStep) {
							acc.push(s);
						}
					}

					return acc;
				}, []);

				if (viewModeSteps.length === 0 || !api) {
					// TODO: Do we want to block everything?
					// If yes, we should return false;
					return true;
				}

				viewModeSteps.forEach((step) => {
					if (step.inverted || !step.mark) {
						return;
					}

					if (step.mark.type.name === 'annotation') {
						if (getBooleanFF('platform.editor.live-view.comments-in-media-toolbar-button')) {
							if (step instanceof ViewModeNodeStep) {
								api.collabEdit?.actions.addInlineCommentNodeMark({
									mark: step.mark,
									pos: step.pos,
								});
							} else if (step instanceof ViewModeStep) {
								api.collabEdit?.actions.addInlineCommentMark({
									mark: step.mark,
									from: step.from,
									to: step.to,
								});
							}
						} else {
							if (step instanceof ViewModeStep) {
								api.collabEdit?.actions.addInlineCommentMark({
									mark: step.mark,
									from: step.from,
									to: step.to,
								});
							}
						}
					}
				});

				// TODO: Follow-up and improve annotation logic so we can filter out transactions here
				return true;
			},
		});

const createReplaceDocumentTransactionPlugin =
	(api: ExtractInjectionAPI<EditorViewModeEffectsPlugin> | undefined) => () =>
		new SafePlugin({
			// Shouldn't need explicit types but sometimes TS can't infer them so 🤷
			appendTransaction: (
				transactions: readonly Transaction[],
				_oldState: EditorState,
				newState: EditorState,
			) => {
				if (!api) {
					return;
				}

				if (!getBooleanFF('platform.editor.live-view.no-editor-selection-in-view-mode')) {
					return;
				}

				const isViewMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'view';
				if (!isViewMode) {
					return;
				}

				const remoteReplaceDocumentTransaction = transactions.find((tr) =>
					api.collabEdit?.actions?.isRemoteReplaceDocumentTransaction(tr),
				);

				if (!remoteReplaceDocumentTransaction || !remoteReplaceDocumentTransaction.selectionSet) {
					return;
				}

				const doc = newState.doc;
				const nextTr = newState.tr;

				const emptySelection = new TextSelection(doc.resolve(0));
				nextTr.setSelection(emptySelection);

				return nextTr;
			},
		});

export const editorViewModeEffectsPlugin: EditorViewModeEffectsPlugin = ({ api }) => ({
	name: 'editorViewModeEffects',

	actions: {
		applyViewModeStepAt: (tr: Transaction) => {
			const marksSteps: (AddMarkStep | AddNodeMarkStep)[] = tr.steps.reduce<
				(AddMarkStep | AddNodeMarkStep)[]
			>((acc, s) => {
				// TODO: We probably want to check the RemoveMarkStep flow too.
				if (getBooleanFF('platform.editor.live-view.comments-in-media-toolbar-button')) {
					if (s instanceof AddMarkStep || s instanceof AddNodeMarkStep) {
						acc.push(s);
					}
				} else {
					if (s instanceof AddMarkStep) {
						acc.push(s);
					}
				}

				return acc;
			}, []);

			if (marksSteps.length === 0) {
				return false;
			}

			marksSteps.reverse().map((s) => {
				if (getBooleanFF('platform.editor.live-view.comments-in-media-toolbar-button')) {
					s instanceof AddNodeMarkStep
						? tr.step(ViewModeNodeStep.from(s))
						: tr.step(ViewModeStep.from(s));
				} else {
					if (s instanceof AddMarkStep) {
						tr.step(ViewModeStep.from(s));
					}
				}
			});

			return true;
		},
	},

	pmPlugins() {
		return [
			{
				name: 'editorViewModeEffectsFilterSteps',
				plugin: createFilterStepsPlugin(api),
			},
			{
				name: 'editorViewModeEffectsReplaceDocumentTransaction',
				plugin: createReplaceDocumentTransactionPlugin(api),
			},
		];
	},
});
