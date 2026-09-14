import { type Change, simplifyChanges } from 'prosemirror-changeset';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { getAttributionKey } from '../decorations/colorSchemes/attributions';

import { optimizeChanges } from './optimizeChanges';

type AttributionIdentity = {
	key: string | undefined;
	mergeable: boolean;
};

const getAttributionIdentity = (change: Change): AttributionIdentity => {
	const identities = new Set<string | undefined>();

	for (const span of [...change.deleted, ...change.inserted]) {
		identities.add(getAttributionKey(span.data));
	}

	if (identities.size > 1) {
		return { key: undefined, mergeable: false };
	}

	return { key: identities.values().next().value, mergeable: true };
};

const byNewDocRange = (left: Change, right: Change): number =>
	left.fromB - right.fromB || left.toB - right.toB;

/**
 * Collapses changes whose new-document ranges strictly overlap. Attribution runs are simplified
 * independently, so runs either side of an unattributed step can come back covering the same
 * characters — which stacks two inline decorations and renders one contributor tag per copy.
 *
 * Merging keeps every span from both sides, so the latest-writer rule still decides whose tag is
 * shown. Ranges that merely touch are left alone, so an unattributed edit next to an attributed one
 * is not credited to it.
 */
export const collapseOverlappingChanges = (changes: Change[]): Change[] => {
	if (changes.length <= 1) {
		return changes;
	}

	// A zero-length new-document range paints no inline decoration, so it is kept aside rather than
	// folded into a neighbouring insertion.
	const emptyRanges = changes.filter((change) => change.toB <= change.fromB);
	const collapsed: Change[] = [];

	for (const change of changes.filter((change) => change.toB > change.fromB).sort(byNewDocRange)) {
		const current = collapsed[collapsed.length - 1];

		if (current && change.fromB < current.toB) {
			collapsed[collapsed.length - 1] = {
				fromA: Math.min(current.fromA, change.fromA),
				toA: Math.max(current.toA, change.toA),
				fromB: Math.min(current.fromB, change.fromB),
				toB: Math.max(current.toB, change.toB),
				deleted: [...current.deleted, ...change.deleted],
				inserted: [...current.inserted, ...change.inserted],
			};
		} else {
			collapsed.push({ ...change });
		}
	}

	return [...collapsed, ...emptyRanges].sort(byNewDocRange);
};

/**
 * Simplifies and optimizes consecutive changes without crossing an attribution boundary.
 * A change which already contains more than one identity is deliberately kept isolated.
 */
export const simplifyChangesWithAttribution = (
	changes: readonly Change[],
	doc: PMNode,
): Change[] => {
	const result: Change[] = [];
	let run: Change[] = [];
	let runIdentity: AttributionIdentity | undefined;

	const flush = () => {
		if (run.length > 0) {
			// Some show-diff producers use structurally compatible Change objects rather than the
			// library class. `simplifyChanges` reads runtime `lenA`/`lenB` getters even though they
			// are intentionally omitted from its public declarations, so add equivalent getters
			// without calling the library's internal constructor.
			const normalizedRun: Change[] = run.map((change) => ({
				...change,
				get lenA() {
					return change.toA - change.fromA;
				},
				get lenB() {
					return change.toB - change.fromB;
				},
			}));
			result.push(...optimizeChanges(simplifyChanges(normalizedRun, doc)));
		}
		run = [];
		runIdentity = undefined;
	};

	for (const change of changes) {
		const identity = getAttributionIdentity(change);
		const canJoinRun =
			runIdentity?.mergeable === true && identity.mergeable && runIdentity.key === identity.key;

		if (run.length > 0 && !canJoinRun) {
			flush();
		}

		run.push(change);
		runIdentity = identity;

		if (!identity.mergeable) {
			flush();
		}
	}

	flush();
	return result;
};
