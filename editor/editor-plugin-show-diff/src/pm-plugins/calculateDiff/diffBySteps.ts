import type { Change } from 'prosemirror-changeset';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Mapping } from '@atlaskit/editor-prosemirror/transform';
import type { Step, StepMap } from '@atlaskit/editor-prosemirror/transform';

const mapPosition = (mapping: Mapping, pos: number): number => mapping.map(pos);
const createMapping = (maps: StepMap[]): Mapping => {
	const mapping = new Mapping();
	for (const map of maps) {
		mapping.appendMap(map);
	}
	return mapping;
};

const createSpans = (length: number) =>
	length > 0
		? [
				{
					length,
					data: null,
				},
			]
		: [];

const mergeOverlappingByNewDocRange = (changes: Change[]): Change[] => {
	if (changes.length <= 1) {
		return changes;
	}

	const sortedChanges = [...changes].sort((left, right) => left.fromB - right.fromB);
	const merged: Change[] = [];
	let current = { ...sortedChanges[0] };

	for (let i = 1; i < sortedChanges.length; i++) {
		const next = sortedChanges[i];
		const isOverlapping = next.fromB <= current.toB;

		if (isOverlapping) {
			current = {
				fromA: Math.min(current.fromA, next.fromA),
				toA: Math.max(current.toA, next.toA),
				fromB: Math.min(current.fromB, next.fromB),
				toB: Math.max(current.toB, next.toB),
				deleted: [...current.deleted, ...next.deleted],
				inserted: [...current.inserted, ...next.inserted],
			};
		} else {
			merged.push(current);
			current = { ...next };
		}
	}

	merged.push(current);
	return merged;
};

export const diffBySteps = (originalDoc: PMNode, steps: Step[]): Change[] => {
	const changes: Change[] = [];
	let currentDoc = originalDoc;
	const successfulStepMaps = [];
	const rangedSteps: Array<{
		from: number;
		mapIndex: number;
		stepMap: StepMap;
		to: number;
	}> = [];

	for (const step of steps) {
		const result = step.apply(currentDoc);
		if (result.failed !== null || !result.doc) {
			continue;
		}

		const stepMap = step.getMap();
		const rangeStep = step as Step & { from?: number; to?: number };
		if (typeof rangeStep.from === 'number' && typeof rangeStep.to === 'number') {
			rangedSteps.push({
				from: rangeStep.from,
				to: rangeStep.to,
				mapIndex: successfulStepMaps.length,
				stepMap,
			});
		}

		successfulStepMaps.push(stepMap);
		currentDoc = result.doc;
	}

	for (const rangedStep of rangedSteps) {
		// Mapping from original -> doc before this step.
		const originalToBeforeStep = createMapping(successfulStepMaps.slice(0, rangedStep.mapIndex));
		const beforeStepToOriginal = originalToBeforeStep.invert();

		const fromA = mapPosition(beforeStepToOriginal, rangedStep.from);
		const toA = mapPosition(beforeStepToOriginal, rangedStep.to);

		// Map the step range into final steppedDoc coordinates.
		const fromAfterStep = rangedStep.stepMap.map(rangedStep.from, -1);
		const toAfterStep = rangedStep.stepMap.map(rangedStep.to, 1);
		const afterStepToFinal = createMapping(successfulStepMaps.slice(rangedStep.mapIndex + 1));

		const fromB = mapPosition(afterStepToFinal, fromAfterStep);
		const toB = mapPosition(afterStepToFinal, toAfterStep);

		changes.push({
			fromA,
			toA,
			fromB,
			toB,
			deleted: createSpans(Math.max(0, toA - fromA)),
			inserted: createSpans(Math.max(0, toB - fromB)),
		});
	}

	return mergeOverlappingByNewDocRange(changes);
};
