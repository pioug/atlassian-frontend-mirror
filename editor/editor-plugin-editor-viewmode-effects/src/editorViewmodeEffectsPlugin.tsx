import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	type EditorState,
	TextSelection,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import {
	AddMarkStep,
	AddNodeMarkStep,
	ReplaceAroundStep,
	ReplaceStep,
	RemoveMarkStep,
	RemoveNodeMarkStep,
} from '@atlaskit/editor-prosemirror/transform';
import { fg } from '@atlaskit/platform-feature-flags';

import { type EditorViewModeEffectsPlugin } from './editorViewmodeEffectsPluginType';
import { ViewModeNodeStep, ViewModeStep } from './pm-plugins/viewModeStep';

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
					if (s instanceof ViewModeNodeStep || s instanceof ViewModeStep) {
						acc.push(s);
					}
					return acc;
				}, []);

				if (viewModeSteps.length === 0 || !api) {
					// Editor should not allow local edits in view mode (except for comments) which are handled
					// via ViewModeSteps. If we have no ViewModeSteps, we should block the transaction.
					if (fg('aifc_create_enabled')) {
						if (
							tr.docChanged &&
							// Check if the transaction contains any steps that modify the document (view mode steps do not)
							tr.steps.filter(
								(s) =>
									s instanceof ReplaceAroundStep ||
									s instanceof ReplaceStep ||
									s instanceof AddMarkStep ||
									s instanceof AddNodeMarkStep ||
									s instanceof RemoveMarkStep ||
									s instanceof RemoveNodeMarkStep,
							).length
						) {
							return false;
						}
						return true;
					}
					return true;
				}

				viewModeSteps.forEach((step) => {
					if (step.inverted || !step.mark) {
						return;
					}

					if (step.mark.type.name === 'annotation') {
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
					}
				});

				// Ignored via go/ees007
				// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
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
				// Ignored via go/ees007
				// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
				// TODO: We probably want to check the RemoveMarkStep flow too.
				if (s instanceof AddMarkStep || s instanceof AddNodeMarkStep) {
					acc.push(s);
				}

				return acc;
			}, []);

			if (marksSteps.length === 0) {
				return false;
			}

			marksSteps
				.reverse()
				.map((s) =>
					s instanceof AddNodeMarkStep
						? tr.step(ViewModeNodeStep.from(s))
						: tr.step(ViewModeStep.from(s)),
				);

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
