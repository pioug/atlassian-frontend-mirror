import { ChangeSet } from 'prosemirror-changeset';

import { type Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { ConflictChange, ConflictChanges } from '@atlaskit/editor-common/collab';
import { rebaseSteps as collabRebaseSteps, type Rebaseable } from '@atlaskit/prosemirror-collab';

interface Options {
	localSteps: readonly Rebaseable[];
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
	localDoc: PMNode;
	remoteChanges: ChangeSet;
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
 * This runs a collab rebase (that is run synchronously after this)
 * and extracts the local doc (before changes), remote doc and the
 * mapping to determine any conflicts.
 * See: `packages/editor/prosemirror-collab/src/index.ts`
 */
const rebaseSteps = ({ localSteps, remoteSteps, tr }: Options) => {
	const originalMapsLength = tr.mapping.maps?.length;
	const originalDocsLength = tr.docs.length;
	collabRebaseSteps(localSteps, remoteSteps, tr);
	/**
	 * `tr.docs` contains the documents before each change.
	 *
	 * To get "originalDoc" we need to get the document immediately after the local steps are inverted
	 * which is the equal to the number of local steps. If there are no remote steps this will be undefined and
	 * the most current document is appropriate
	 *
	 * To get the "remoteDoc" we need to get the document immediately after the local steps have been inverted
	 * and the remote steps re-applied. If there are no local steps or they are all lost in rebase this will be
	 * undefined and the most current document is appropriate
	 *
	 */
	const originalDoc = tr.docs[originalDocsLength + localSteps.length] ?? tr.doc;
	const remoteDoc = tr.docs[originalDocsLength + localSteps.length + remoteSteps.length] ?? tr.doc;
	const mapStart = originalMapsLength + localSteps.length;

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
