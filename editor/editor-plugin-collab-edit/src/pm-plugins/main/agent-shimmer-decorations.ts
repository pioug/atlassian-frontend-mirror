import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';

// Kept out of `plugin-state.ts` so all the agent-shimmer plumbing lives together and is easy to
// remove if the approach changes. `plugin-state` just reduces the active ranges and asks this module
// to build the decorations.

/** Default time the skeleton shimmer stays on the agent-authored content (ms). */
export const AGENT_SHIMMER_DEFAULT_DURATION_MS = 3000;

// Skeleton-loader bar over the agent-authored range, plus a Rovo AI telepointer at the end.
export const AGENT_SHIMMER_CLASS = 'collab-agent-shimmer';
export const ROVO_AGENT_TELEPOINTER_CLASS = 'ai-in-editor-telepointer';
export const ROVO_AGENT_TELEPOINTER_LABEL_CLASS = 'ai-in-editor-telepointer-label';
export const ADD_AGENT_SHIMMER_META = 'addAgentShimmer'; // register the shimmer decorations
export const REMOVE_AGENT_SHIMMER_META = 'removeAgentShimmer'; // remove them once the shimmer ends

// A range an agent step wrote; the skeleton + telepointer decorations are drawn over `from`..`to`
// and kept until removal (so positions can be re-mapped). Pure data only. `telepointerLabel` is the
// label for the trailing agent telepointer (the agent's type); when absent, no telepointer is shown.
export type AgentShimmerRange = {
	from: number;
	shimmerId: string;
	telepointerLabel?: string;
	to: number;
};

// Rovo AI in-editor telepointer/cursor shown at the end of an agent-authored range (same DOM/style
// pattern as editor-plugin-ai's in-editor direct-streaming telepointer).
const createRovoAgentTelepointer = (label: string): HTMLSpanElement => {
	const element = document.createElement('span');
	element.setAttribute('data-testid', 'ai-in-editor-telepointer-widget');
	element.className = ROVO_AGENT_TELEPOINTER_CLASS;
	const labelElement = document.createElement('span');
	labelElement.setAttribute('data-testid', 'ai-in-editor-telepointer-widget-label');
	labelElement.className = ROVO_AGENT_TELEPOINTER_LABEL_CLASS;
	labelElement.append(label);
	element.appendChild(labelElement);
	return element;
};

/**
 * Pure reducer for the active shimmer ranges from a transaction's changes. Maps existing ranges
 * forward as the doc changes, replaces them wholesale when a new agent batch lands (a new batch
 * supersedes any still-in-flight shimmer), and drops a range when its removal timer fires. Returns a
 * fresh array (never mutates in place) plus whether anything changed.
 */
export const reduceAgentShimmers = (
	current: AgentShimmerRange[],
	tr: ReadonlyTransaction,
	added: AgentShimmerRange[] | undefined,
	removedShimmerId: string | undefined,
): { changed: boolean; next: AgentShimmerRange[] } => {
	let next = current;
	let changed = false;

	// Ranges added in THIS transaction are already in post-change coords, so map the pre-existing
	// ones BEFORE replacing with any new batch.
	if (tr.docChanged && next.length) {
		next = next.map((shimmer) => ({
			...shimmer,
			from: tr.mapping.map(shimmer.from, -1),
			to: tr.mapping.map(shimmer.to, 1),
		}));
		changed = true;
	}
	if (added?.length) {
		next = added.map((shimmer) => ({ ...shimmer }));
		changed = true;
	}
	if (removedShimmerId) {
		next = next.filter((shimmer) => shimmer.shimmerId !== removedShimmerId);
		changed = true;
	}
	return { changed, next };
};

/**
 * Builds the inline skeleton-bar + trailing telepointer decorations for the active shimmer ranges.
 * `getValidPos` clamps a raw position to a valid decoration position (owned by `plugin-state`).
 * One bad range is isolated via `onError` so it can't kill the others.
 */
export const buildAgentShimmerDecorations = (
	tr: ReadonlyTransaction,
	shimmers: AgentShimmerRange[],
	getValidPos: (tr: ReadonlyTransaction, pos: number) => number,
	onError: (err: Error) => void,
): Decoration[] => {
	const decorations: Decoration[] = [];
	const docEnd = tr.doc.nodeSize - 2;
	shimmers.forEach(({ shimmerId, from, to, telepointerLabel }) => {
		try {
			const validFrom = getValidPos(tr, Math.max(from, 1));
			const validTo = getValidPos(tr, Math.min(to, docEnd));
			if (validTo <= validFrom) {
				return;
			}
			// Skeleton-loader bar over the whole agent-authored range...
			decorations.push(
				Decoration.inline(
					validFrom,
					validTo,
					{ class: AGENT_SHIMMER_CLASS },
					{ isAgentShimmer: true, shimmerId },
				),
			);
			// ...and, when enabled, a Rovo AI telepointer/cursor (labelled with the agent's type) at the
			// end of the range.
			if (telepointerLabel) {
				decorations.push(
					Decoration.widget(validTo, createRovoAgentTelepointer(telepointerLabel), {
						isAgentShimmer: true,
						shimmerId,
						class: ROVO_AGENT_TELEPOINTER_CLASS,
						key: `agent-telepointer-${shimmerId}`,
						side: 1,
					}),
				);
			}
		} catch (err) {
			// One bad range must not kill the others.
			onError(err as Error);
		}
	});
	return decorations;
};
