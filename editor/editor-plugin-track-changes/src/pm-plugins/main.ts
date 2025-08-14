import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import {
	ReplaceAroundStep,
	ReplaceStep,
	AddMarkStep,
	RemoveMarkStep,
	type Step,
} from '@atlaskit/editor-prosemirror/transform';

import type { TrackChangesPlugin } from '../trackChangesPluginType';

import { filterSteps } from './filterSteps';
import { InvertableStep } from './invertableStep';
import { TOGGLE_TRACK_CHANGES_ACTION as ACTION } from './types';

export const trackChangesPluginKey = new PluginKey<TrackChangesPluginState>('trackChangesPlugin');

type TrackChangesPluginState = {
	shouldChangesBeDisplayed: boolean;
	isShowDiffAvailable: boolean;
	steps: InvertableStep[];
	allocations: Set<number>;
};

// Exported for test purposes
export const getBaselineFromSteps = (doc: PMNode, steps: InvertableStep[]) => {
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
					allocations: new Set<number>(),
				};
			},
			apply(tr, state) {
				const metadata = tr.getMeta(trackChangesPluginKey);
				if (metadata && metadata.action === ACTION.RESET_BASELINE) {
					return {
						...state,
						steps: [],
						isShowDiffAvailable: false,
					};
				}
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
						(step: Step) =>
							step instanceof ReplaceStep ||
							step instanceof ReplaceAroundStep ||
							step instanceof AddMarkStep ||
							step instanceof RemoveMarkStep,
					);

				if (!isDocChanged) {
					// If no document changes, return the old changeSet
					return state;
				}

				if (tr.getMeta('isRemote')) {
					// If the transaction is remote, we need to map the steps to the current document
					return {
						...state,
						steps: state.steps
							.map((s) => {
								const newStep = s.step.map(tr.mapping);
								const newInvertedStep = s.inverted.map(tr.mapping);
								if (newStep && newInvertedStep) {
									return new InvertableStep(newStep, newInvertedStep, s.allocation);
								}
								return undefined;
							})
							.filter((s) => !!s),
					};
				}

				// For undo/redo operations (addToHistory === false), we still need to check if we're back at baseline
				if (tr.getMeta('addToHistory') === false) {
					// This is likely an undo/redo operation, check if current doc matches baseline
					const baselineDoc = getBaselineFromSteps(tr.doc, state.steps);

					const hasChangesFromBaseline = !tr.doc.eq(baselineDoc);

					return {
						...state,
						isShowDiffAvailable: hasChangesFromBaseline,
					};
				}

				// If we don't have the history plugin don't limit the change tracking
				const historyState = api?.history?.sharedState.currentState();
				const currentAllocation = historyState
					? // Combine both done + undone so we have the total "distance".
						historyState.done.eventCount + historyState.undone.eventCount
					: (state.steps.at(-1)?.allocation ?? 0) + 1;

				const newSteps = tr.steps.map(
					(step, idx) => new InvertableStep(step, step.invert(tr.docs[idx]), currentAllocation),
				);
				const concatSteps = resetBaseline ? newSteps : [...state.steps, ...newSteps];

				resetBaseline = false;
				const { allocations, steps } = filterSteps(
					concatSteps,
					state.allocations.add(currentAllocation),
				);

				// Calculate if there are actual changes by comparing current doc with baseline
				const baselineDoc = getBaselineFromSteps(tr.doc, steps);
				const hasChangesFromBaseline = !tr.doc.eq(baselineDoc);

				// Create a new ChangeSet based on document changes
				return {
					...state,
					allocations,
					steps,
					shouldChangesBeDisplayed: false,
					isShowDiffAvailable: hasChangesFromBaseline,
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
