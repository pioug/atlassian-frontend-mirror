import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey, TextSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Mappable } from '@atlaskit/editor-prosemirror/transform';
import {
	AddMarkStep,
	AddNodeMarkStep,
	ReplaceStep,
	Step,
	StepMap,
	StepResult,
} from '@atlaskit/editor-prosemirror/transform';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { EditorViewModePlugin, EditorViewModePluginState, ViewMode } from './types';

type ViewModeStepProps = {
	from: number;
	to: number;
	mark?: Mark;
	inverted?: boolean;
};

type ViewModeNodeStepProps = {
	mark?: Mark;
	inverted?: boolean;
	pos: number;
};

class ViewModeNodeStep extends Step {
	public readonly inverted: boolean;
	public readonly pos: number;
	public readonly mark: Mark | undefined;

	private constructor({ inverted, pos, mark }: ViewModeNodeStepProps) {
		super();
		this.inverted = Boolean(inverted);
		this.pos = pos;
		this.mark = mark;
	}

	invert(doc: PMNode) {
		return new ViewModeNodeStep({
			inverted: true,
			pos: this.pos,
			mark: this.mark,
		});
	}

	apply(doc: PMNode) {
		return StepResult.ok(doc);
	}

	merge(): null {
		return null;
	}

	map(mapping: Mappable): ViewModeNodeStep | null {
		const mappedPos = mapping.mapResult(this.pos, 1);

		if (mappedPos.deleted) {
			return null;
		}

		return new ViewModeNodeStep({
			inverted: this.inverted,
			pos: mappedPos.pos,
		});
	}

	getMap() {
		return new StepMap([0, 0, 0]);
	}

	toJSON() {
		// When serialized we should create a noop Replace step
		return {
			stepType: 'replace',
			pos: 0,
		};
	}

	static fromJSON() {
		// This is a "local custom step" once serialized
		// we need to transform it in a no-operation action

		return new ReplaceStep(0, 0, Slice.empty);
	}

	static from(step: AddNodeMarkStep) {
		const { mark, pos } = step;

		return new ViewModeNodeStep({
			mark,
			pos,
		});
	}
}
class ViewModeStep extends Step {
	public readonly inverted: boolean;
	public readonly from: number;
	public readonly to: number;
	public readonly mark: Mark | undefined;

	private constructor({ inverted, from, to, mark }: ViewModeStepProps) {
		super();
		this.inverted = Boolean(inverted);
		this.from = from;
		this.to = to;
		this.mark = mark;
	}

	invert(doc: PMNode) {
		return new ViewModeStep({
			inverted: true,
			from: this.from,
			to: this.to,
			mark: this.mark,
		});
	}

	apply(doc: PMNode) {
		return StepResult.ok(doc);
	}

	merge(): null {
		return null;
	}

	map(mapping: Mappable): ViewModeStep | null {
		const mappedFrom = mapping.mapResult(this.from, 1);
		const mappedTo = mapping.mapResult(this.to, 1);

		if (mappedFrom.deleted || mappedTo.deleted) {
			return null;
		}

		return new ViewModeStep({
			inverted: this.inverted,
			from: mappedFrom.pos,
			to: mappedTo.pos,
		});
	}

	getMap() {
		return new StepMap([0, 0, 0]);
	}

	toJSON() {
		// When serialized we should create a noop Replace step
		return {
			stepType: 'replace',
			from: 0,
			to: 0,
		};
	}

	static fromJSON() {
		// This is a "local custom step" once serialized
		// we need to transform it in a no-operation action
		return new ReplaceStep(0, 0, Slice.empty);
	}

	static from(step: AddMarkStep) {
		const { mark, from, to } = step;
		return new ViewModeStep({
			mark,
			from,
			to,
		});
	}
}

const viewModePluginKey = new PluginKey<EditorViewModePluginState>('editorViewMode');

const createFilterStepsPlugin =
	(api: ExtractInjectionAPI<EditorViewModePlugin> | undefined) => () => {
		return new SafePlugin({
			filterTransaction: (tr, state) => {
				const mode = viewModePluginKey.getState(state)?.mode;

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
	};

const createPlugin = ({
	initialMode,
	api,
}: {
	initialMode: ViewMode | undefined;
	api: ExtractInjectionAPI<EditorViewModePlugin> | undefined;
}) => {
	return new SafePlugin({
		key: viewModePluginKey,
		state: {
			init: () => ({ mode: initialMode ?? 'edit' }),
			apply: (tr, pluginState) => {
				const meta = tr.getMeta(viewModePluginKey);
				if (meta) {
					return meta;
				}

				return pluginState;
			},
		},
		props: {
			// If we set to undefined it respects the previous value.
			// Prosemirror doesn't have this typed correctly for this type of behaviour
			// We will fast-follow to consolidate the logic with `editor-disabled` so we don't
			// need this workaround.
			// @ts-expect-error
			editable: (state: EditorState) => {
				const mode = viewModePluginKey.getState(state)?.mode;
				return mode === 'view' ? false : undefined;
			},
		},
		appendTransaction: (transactions, _oldState, newState) => {
			if (!api) {
				return;
			}

			if (!getBooleanFF('platform.editor.live-view.no-editor-selection-in-view-mode')) {
				return;
			}

			const isViewMode = viewModePluginKey.getState(_oldState)?.mode === 'view';
			if (!isViewMode) {
				return;
			}

			const remoteReplaceDocumentTransaction = transactions.find((tr) =>
				api.collabEdit?.actions.isRemoteReplaceDocumentTransaction(tr),
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
};

/**
 * View Mode plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const editorViewModePlugin: EditorViewModePlugin = ({ config: options, api }) => {
	return {
		name: 'editorViewMode',

		getSharedState(editorState) {
			if (!editorState) {
				return {
					mode: options?.mode === 'view' ? 'view' : 'edit',
				};
			}

			return {
				mode: viewModePluginKey.getState(editorState)?.mode ?? 'edit',
			};
		},

		commands: {
			updateViewMode:
				(mode: ViewMode) =>
				({ tr }) => {
					return tr.setMeta(viewModePluginKey, { mode });
				},
		},

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
					name: 'editorViewMode',
					plugin: () => createPlugin({ initialMode: options?.mode, api }),
				},
				{
					name: 'editorViewModeFilterSteps',
					plugin: createFilterStepsPlugin(api),
				},
			];
		},
	};
};
