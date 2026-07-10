/**
 * Generic, editor-state-free diff-change computation.
 *
 * Turns an `originalDoc` + forward `steps` into the classified `Change[]` for the
 * requested `diffType`, plus the reconstructed new document — the same classifier
 * the diff overlay uses (`calculateDiffDecorations` → `getChanges`), exposed as a
 * reusable utility (e.g. to derive reviewable segments without rendering
 * decorations). It runs the requested `diffType` DIRECTLY and does NOT apply the
 * overlay's `platform_editor_ai_smart_diff` gate, so a `smart` result here can
 * differ from what the overlay draws when that gate is off (the overlay falls back
 * to inline); callers that need overlay parity must account for that gate.
 *
 * Pure: no `EditorState`, no transactions, no React. The new document is
 * reconstructed by applying the (simplified) steps to `originalDoc`.
 */
import { ChangeSet, simplifyChanges, type Change } from 'prosemirror-changeset';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Step as ProseMirrorStep, StepMap } from '@atlaskit/editor-prosemirror/transform';

import type { DiffType, SmartDiffThresholds } from '../../showDiffPluginType';

import { diffBySteps } from './diffBySteps';
import { groupChangesByBlock } from './groupChangesByBlock';
import { optimizeChanges } from './optimizeChanges';
import { simplifySteps } from './simplifySteps';
import { classifySmartChanges } from './smart/classifySmartChanges';

export type ComputeDiffChangesParams = {
	/**
	 * Which classification to run. Defaults to `smart` — the density-aware model.
	 * The other types are supported for parity with the diff overlay's
	 * `getChanges`.
	 */
	diffType?: DiffType;
	/** BCP-47 locale for `smart` sentence/word segmentation. Defaults to `en`. */
	locale?: string;
	/** The pre-edit document (the diff's left/original side). */
	originalDoc: PMNode;
	/** Optional overrides for the `smart` density thresholds. Ignored otherwise. */
	smartThresholds?: Partial<SmartDiffThresholds>;
	/** Forward `original → new` steps (the standard non-inverted contract). */
	steps: ProseMirrorStep[];
};

/**
 * Apply the (simplified) steps to `originalDoc` to reconstruct the new doc, and
 * compute the classified `Change[]` for the requested `diffType`. Mirrors the
 * body of `calculateDiffDecorations` → `getChanges` so callers stay in lock-step
 * with the rendered diff. Returns an empty change list (and `originalDoc` as the
 * new doc) when there are no steps.
 */
export const computeDiffChanges = ({
	originalDoc,
	steps,
	diffType = 'smart',
	locale = 'en',
	smartThresholds,
}: ComputeDiffChangesParams): { changes: Change[]; newDoc: PMNode } => {
	if (!steps || steps.length === 0) {
		return { changes: [], newDoc: originalDoc };
	}

	const simplifiedSteps = simplifySteps(steps, originalDoc);

	let steppedDoc = originalDoc;
	const stepMaps: StepMap[] = [];
	try {
		for (const step of simplifiedSteps) {
			const result = step.apply(steppedDoc);
			if (result.failed === null && result.doc) {
				stepMaps.push(step.getMap());
				steppedDoc = result.doc;
			}
		}
	} catch {
		// A step's positions fell outside the current doc — `ReplaceStep.apply`
		// throws a RangeError (rather than returning a failed result) when a
		// position exceeds the doc size. This can happen for pathological or
		// inconsistent step sequences. Bail with no changes rather than letting the
		// error propagate to the caller (which, for the PSR, would crash the
		// toolbar); the consumer then falls back to its non-diff segmenting path.
		return { changes: [], newDoc: originalDoc };
	}

	const changeset = ChangeSet.create(originalDoc).addSteps(steppedDoc, stepMaps, steppedDoc);

	if (diffType === 'smart') {
		return {
			changes: classifySmartChanges({
				changes: simplifyChanges(changeset.changes, steppedDoc),
				originalDoc,
				newDoc: steppedDoc,
				locale,
				thresholds: smartThresholds,
			}),
			newDoc: steppedDoc,
		};
	}
	if (diffType === 'block') {
		return {
			changes: groupChangesByBlock(changeset.changes, originalDoc, steppedDoc),
			newDoc: steppedDoc,
		};
	}
	if (diffType === 'step') {
		return { changes: diffBySteps(originalDoc, simplifiedSteps), newDoc: steppedDoc };
	}
	return {
		changes: optimizeChanges(simplifyChanges(changeset.changes, steppedDoc)),
		newDoc: steppedDoc,
	};
};
