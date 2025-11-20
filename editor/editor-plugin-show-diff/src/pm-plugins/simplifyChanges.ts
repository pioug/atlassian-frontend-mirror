import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import { areNodesEqualIgnoreAttrs } from '@atlaskit/editor-common/utils/document';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { fg } from '@atlaskit/platform-feature-flags';

/**
 * Attempts to merge two consecutive ReplaceStep operations.
 * This merges steps where:
 * - Both steps replace content at the same starting position
 * - The second step's range encompasses the first step's range
 * - The second step has content to insert
 * Returns null if steps cannot be merged.
 */
function mergeReplaceSteps(step1: ProseMirrorStep, step2: ProseMirrorStep): ProseMirrorStep | null {
	if (!(step1 instanceof ReplaceStep) || !(step2 instanceof ReplaceStep)) {
		return null;
	}
	if (step1.from === step2.from && step2.to >= step1.to && step2.slice.size >= step1.slice.size) {
		return new ReplaceStep(step1.from, step1.to, step2.slice);
	}
	return null;
}

// Simplifies the steps to improve performance and reduce fragmentation in diffs
export function simplifySteps(steps: ProseMirrorStep[], originalDoc: PMNode): ProseMirrorStep[] {
	const stepsToFilter = fg('platform_editor_ai_aifc_patch_ga')
		? removeUnusedSteps(steps, originalDoc)
		: steps;
	return (
		stepsToFilter
			// Remove steps that don't affect document structure or content
			.filter((step) => !(step instanceof AnalyticsStep))
			// Merge consecutive steps where possible
			.reduce<ProseMirrorStep[]>((acc, step) => {
				const lastStep = acc[acc.length - 1];
				const merged = fg('platform_editor_ai_aifc_patch_ga')
					? (lastStep?.merge?.(step) ?? mergeReplaceSteps(lastStep, step))
					: lastStep?.merge?.(step);
				if (merged) {
					acc[acc.length - 1] = merged;
				} else {
					acc.push(step);
				}
				return acc;
			}, [])
	);
}

/**
 * Does a first pass to remove steps that don't impact the document
 */
function removeUnusedSteps(steps: ProseMirrorStep[], originalDoc: PMNode): ProseMirrorStep[] {
	const finalSteps: ProseMirrorStep[] = [];
	let firstPassDoc = originalDoc;
	for (const step of steps) {
		const result = step.apply(firstPassDoc);
		if (
			result.failed === null &&
			result.doc &&
			!areNodesEqualIgnoreAttrs(firstPassDoc, result.doc, ['localId'])
		) {
			finalSteps.push(step);
			firstPassDoc = result.doc;
		}
	}
	return finalSteps;
}
