import { ChangeSet } from 'prosemirror-changeset';

import { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { Transaction } from '@atlaskit/editor-prosemirror/state';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { ConflictChange, ConflictChanges } from '@atlaskit/editor-common/collab';

interface Options {
	localSteps: readonly { inverted: ProseMirrorStep; step: ProseMirrorStep }[];
	remoteSteps: ProseMirrorStep[];
	tr: Transaction;
}

const simplifySteps = (steps: ProseMirrorStep[]): ProseMirrorStep[] => {
	return steps.reduce((acc, step) => {
		const lastStep = acc[acc.length - 1];
		if (lastStep) {
			const mergedStep = lastStep.merge(step);
			if (mergedStep) {
				acc[acc.length - 1] = mergedStep;
				return acc;
			}
		}
		return acc.concat(step);
	}, [] as ProseMirrorStep[]);
};

function findContentChanges(doc: PMNode, steps: ProseMirrorStep[]): ChangeSet {
	let changes = ChangeSet.create(doc);
	let latestDoc = doc;
	simplifySteps(steps).forEach((step, index) => {
		const stepResult = step.apply(latestDoc);
		if (stepResult.failed !== null || stepResult.doc === null) {
			return;
		}
		latestDoc = stepResult.doc;
		changes = changes.addSteps(latestDoc, [step.getMap()], {
			step: index,
		});
	});
	return changes;
}

/**
 * Iterate through the changesets to find overlapping regions that indicate conflicting
 * changes
 */
const getConflicts = ({
	localChanges,
	localDoc,
	remoteChanges,
	remoteDoc,
}: {
	localChanges: ChangeSet;
	remoteChanges: ChangeSet;
	localDoc: PMNode;
	remoteDoc: PMNode;
}): ConflictChange[] => {
	const conflictingChanges: ConflictChange[] = [];
	localChanges.changes.forEach((localChange) => {
		remoteChanges.changes.forEach((remoteChange) => {
			if (
				// Local change is inside remote change
				(localChange.fromA >= remoteChange.fromA && localChange.toA <= remoteChange.toA) ||
				// Remote change is inside local change
				(remoteChange.fromA >= localChange.fromA && remoteChange.toA <= localChange.toA) ||
				// Partial overlap with the end
				(localChange.fromA >= remoteChange.fromA &&
					localChange.fromA < remoteChange.toA &&
					localChange.toA > remoteChange.toA) ||
				// Partial overlap with the start
				(localChange.fromA < remoteChange.fromA &&
					localChange.toA > remoteChange.fromA &&
					localChange.toA <= remoteChange.toA) ||
				// One of the edges match
				localChange.fromA === remoteChange.toA ||
				remoteChange.fromA === localChange.toA
			) {
				const remoteSlice = remoteDoc.slice(remoteChange.fromB, remoteChange.toB);
				const isDeletion = remoteSlice.size === 0;
				conflictingChanges.push({
					from: Math.min(localChange.fromA, remoteChange.fromA),
					to: Math.max(localChange.toA, remoteChange.toA),
					// We only want to capture the exact slice deleted (without parents) so we can display and insert as expected
					local: localDoc.slice(localChange.fromB, localChange.toB, !isDeletion),
					remote: remoteSlice,
				});
			}
		});
	});
	return conflictingChanges;
};

/**
 * Almost a copy of the rebaseSteps in the collab algorithm (which gets called
 * synchronously after this).
 *
 * This also tracks the intermediate documents so we can generate the changesets
 * to use for finding any overlapping regions.
 * See: `packages/editor/prosemirror-collab/src/index.ts`
 */
const rebaseSteps = ({ localSteps, remoteSteps, tr }: Options) => {
	for (let i = localSteps?.length - 1; i >= 0; i--) {
		tr.step(localSteps[i].inverted);
	}
	const originalDoc = tr.doc;
	const mapStart = tr.mapping.maps?.length;

	for (let i = 0; i < remoteSteps.length; i++) {
		tr.step(remoteSteps[i]);
	}
	const remoteDoc = tr.doc;

	for (let i = 0, mapFrom = localSteps.length; i < localSteps.length; i++) {
		const mapped = localSteps[i].step.map(tr.mapping.slice(mapFrom));
		mapFrom--;
		if (mapped && !tr.maybeStep(mapped).failed) {
			// Open ticket for setMirror https://github.com/ProseMirror/prosemirror/issues/869
			// @ts-expect-error
			tr.mapping.setMirror(mapFrom, tr.steps.length - 1);
		}
	}
	return {
		mapStart,
		originalDoc,
		remoteDoc,
	};
};

/**
 * Gets the conflicts between the local document and the remote document based on steps.
 * It assumes the steps will be rebased using the `prosemirror-collab` algorithm synchronously after this
 * Therefore the `tr` property is based on the document before rebasing.
 *
 * In the future we could possibly use `prosemirror-recreate-steps` (or similar approach)
 * and tweak this to work for arbitrary diffs between offline and remote documents.
 *
 * @param localSteps Local steps applied between now and the server steps
 * @param remoteSteps Steps retrieved from the server
 * @param tr Transaction of the current document (expected to happen with local steps applied, before remote are applied)
 * @returns All the conflicts (inserted + deleted) which can be applied to the current document
 */
export function getConflictChanges({ localSteps, remoteSteps, tr }: Options): ConflictChanges {
	const localDoc = tr.doc;
	const { originalDoc, remoteDoc, mapStart } = rebaseSteps({ localSteps, remoteSteps, tr });

	const localChanges = findContentChanges(
		originalDoc,
		localSteps.map((s) => s.step),
	);
	const remoteChanges = findContentChanges(originalDoc, remoteSteps);

	// This is the mapping between the original document and our final one which can be used to
	// map conflict positions (which are based on the original doc)
	const mapping = tr.mapping.slice(mapStart);

	// Find the overlapping conflicts - these are based on the positions of the original document so are
	// common to both local and remote documents.
	// The above mapping allows us to bring these positions to where they are in the current document
	const conflictingChanges = getConflicts({
		localChanges,
		localDoc,
		remoteDoc,
		remoteChanges,
	});

	const isConflictChange = (value: ConflictChange | undefined): value is ConflictChange =>
		Boolean(value);

	// Prevent duplicate ranges occuring
	const seenInsertions = new Set<string>();

	return {
		inserted: conflictingChanges
			.filter((i) => i.remote.size !== 0)
			.map((i) => ({
				...i,
				from: mapping.map(i.from, -1),
				to: mapping.map(i.to),
			}))
			.filter((i) => {
				const identifier = `${i.from}-${i.to}`;
				if (seenInsertions.has(identifier)) {
					return false;
				}
				seenInsertions.add(identifier);
				return isConflictChange(i);
			}),
		deleted: conflictingChanges
			.filter((d) => d.remote.size === 0)
			.map((d) => ({
				...d,
				from: mapping.map(d.from),
				to: mapping.map(d.to),
			}))
			.filter(isConflictChange),
	};
}
