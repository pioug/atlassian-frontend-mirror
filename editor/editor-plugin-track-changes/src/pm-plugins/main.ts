import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep, type Step } from '@atlaskit/editor-prosemirror/transform';

import type { TrackChangesPlugin } from '../trackChangesPluginType';

import { TOGGLE_TRACK_CHANGES_ACTION as ACTION } from './types';

export const trackChangesPluginKey = new PluginKey<TrackChangesPluginState>('trackChangesPlugin');

type TrackChangesPluginState = {
	shouldChangesBeDisplayed: boolean;
	isShowDiffAvailable: boolean;
	steps: InvertableStep[];
};

export class InvertableStep {
	constructor(
		readonly step: Step,
		readonly inverted: Step,
	) {}
}

const getBaselineFromSteps = (doc: PMNode, steps: InvertableStep[]) => {
	for (const step of steps.slice().reverse()) {
		const result = step.inverted.apply(doc);
		if (result.failed === null && result.doc) {
			doc = result.doc;
		}
	}
	return doc;
};

export const createTrackChangesPlugin = (
	api: ExtractInjectionAPI<TrackChangesPlugin> | undefined,
) => {
	// Mark the state to be reset on next time the document has a meaningful change
	let resetBaseline = false;

	return new SafePlugin<TrackChangesPluginState>({
		key: trackChangesPluginKey,
		state: {
			init() {
				return {
					steps: [],
					shouldChangesBeDisplayed: false,
					isShowDiffAvailable: false,
				};
			},
			apply(tr, state) {
				const metadata = tr.getMeta(trackChangesPluginKey);
				if (metadata && metadata.action === ACTION.TOGGLE_TRACK_CHANGES) {
					resetBaseline = true;
					return {
						...state,
						shouldChangesBeDisplayed: !state.shouldChangesBeDisplayed,
					};
				}

				const isDocChanged =
					tr.docChanged &&
					tr.steps.some(
						(step: Step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep,
					);

				if (!isDocChanged || tr.getMeta('isRemote') || tr.getMeta('addToHistory') === false) {
					// If no document changes, return the old changeSet
					return state;
				}

				const newSteps = tr.steps.map(
					(step, idx) => new InvertableStep(step, step.invert(tr.docs[idx])),
				);
				const steps = resetBaseline ? newSteps : [...state.steps, ...newSteps];

				resetBaseline = false;

				// Create a new ChangeSet based on document changes
				return {
					...state,
					steps,
					shouldChangesBeDisplayed: false,
					isShowDiffAvailable: true,
				};
			},
		},
		view() {
			return {
				update(view, prevState) {
					const prevShouldChangesBeDisplayed =
						trackChangesPluginKey.getState(prevState)?.shouldChangesBeDisplayed;
					const currentPluginState = trackChangesPluginKey.getState(view.state);
					const currentShouldChangesBeDisplayed = currentPluginState?.shouldChangesBeDisplayed;

					if (prevShouldChangesBeDisplayed === false && currentShouldChangesBeDisplayed === true) {
						const steps = currentPluginState?.steps ?? [];
						api?.core?.actions.execute(
							api?.showDiff?.commands?.showDiff({
								originalDoc: getBaselineFromSteps(view.state.doc, steps),
								steps: steps.map((s) => s.step),
							}),
						);
					} else if (
						currentShouldChangesBeDisplayed === false &&
						prevShouldChangesBeDisplayed === true
					) {
						api?.core?.actions.execute(api?.showDiff?.commands?.hideDiff);
					}
				},
			};
		},
	});
};
