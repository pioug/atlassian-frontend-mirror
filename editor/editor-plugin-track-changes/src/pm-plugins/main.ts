import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import {
	ReplaceAroundStep,
	ReplaceStep,
	AddMarkStep,
	RemoveMarkStep,
	AttrStep,
	type Step,
} from '@atlaskit/editor-prosemirror/transform';

import type { TrackChangesPlugin } from '../trackChangesPluginType';

import { filterSteps } from './filterSteps';
import { InvertableStep } from './invertableStep';
import { TOGGLE_TRACK_CHANGES_ACTION as ACTION } from './types';

export const trackChangesPluginKey = new PluginKey<TrackChangesPluginState>('trackChangesPlugin');

type TrackChangesPluginState = {
	allocations: Set<number>;
	isShowDiffAvailable: boolean;
	shouldChangesBeDisplayed: boolean;
	steps: InvertableStep[];
};

// Exported for test purposes
export const getBaselineFromSteps = (doc: PMNode, steps: InvertableStep[]) => {
	try {
		// Filter out AttrStep's since attribute changes shouldn't affect baseline content comparison
		const contentSteps = steps.filter((step) => !(step.step instanceof AttrStep));

		for (const step of contentSteps.slice().reverse()) {
			const result = step.inverted.apply(doc);
			if (result.failed === null && result.doc) {
				doc = result.doc;
			}
		}
		return doc;
	} catch (e) {
		// Temporary - we need to understand how this happens - but we want to unblock issues where this crashes the editor
		return undefined;
	}
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
							step instanceof RemoveMarkStep ||
							step instanceof AttrStep,
					);

				const isAnnotationStep = (step: Step): step is AddMarkStep =>
					step instanceof AddMarkStep && step.mark.type.name === 'annotation';

				if (
					!isDocChanged ||
					tr.getMeta('isRemote') ||
					tr.getMeta('replaceDocument') ||
					tr.steps.some(isAnnotationStep)
				) {
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
				const hasChangesFromBaseline = baselineDoc ? !tr.doc.eq(baselineDoc) : false;

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
						const originalDoc = getBaselineFromSteps(view.state.doc, steps);
						if (originalDoc) {
							api?.core?.actions.execute(
								api?.showDiff?.commands?.showDiff({
									originalDoc,
									steps: steps.map((s) => s.step),
								}),
							);
						}
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
