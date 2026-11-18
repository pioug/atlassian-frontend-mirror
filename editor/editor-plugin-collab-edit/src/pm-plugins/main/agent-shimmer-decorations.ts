import { AI_IN_EDITOR_TELEPOINTER_CLASS } from '@atlaskit/editor-common/collab';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';

// Kept out of `plugin-state.ts` so all the agent-shimmer plumbing lives together and is easy to
// remove if the approach changes. `plugin-state` just reduces the active ranges and asks this module
// to build the decorations.

/** Default time the skeleton shimmer stays on the agent-authored content (ms). */
export const AGENT_SHIMMER_DEFAULT_DURATION_MS = 3000;
/**
 * Default time the purple "just edited" highlight stays after the skeleton clears (ms); `0` disables
 * the highlight phase so the shimmer just reveals the content.
 */
export const AGENT_EDIT_HIGHLIGHT_DEFAULT_DURATION_MS = 2000;

// Skeleton-loader bar over the agent-authored range, plus a Rovo AI telepointer at the end.
export const AGENT_SHIMMER_CLASS = 'collab-agent-shimmer';
// Purple "just edited" highlight shown over the range after the skeleton clears — same style as the
// editor AI "improve writing" in-editor highlight (subtle purple background + dashed purple underline).
export const AGENT_EDIT_HIGHLIGHT_CLASS = 'collab-agent-edit-highlight';
export const ROVO_AGENT_TELEPOINTER_LABEL_CLASS = 'ai-in-editor-telepointer-label';
export const ADD_AGENT_SHIMMER_META = 'addAgentShimmer'; // register the shimmer decorations
export const HIGHLIGHT_AGENT_SHIMMER_META = 'highlightAgentShimmer'; // skeleton → purple highlight phase
export const REMOVE_AGENT_SHIMMER_META = 'removeAgentShimmer'; // remove them once the shimmer ends

// A shimmer runs in two phases: the `skeleton` loader, then (optionally) the purple `highlight` over
// the revealed content, before removal.
export type AgentShimmerPhase = 'skeleton' | 'highlight';

// A range an agent step wrote; the shimmer decorations are drawn over `from`..`to` and kept until
// removal (so positions can be re-mapped). Pure data only. `phase` selects skeleton vs purple
// highlight. `telepointerLabel` is the label for the trailing agent telepointer (shown through both
// phases); when absent, no telepointer is shown. `highlightDurationMs` is the purple-highlight
// lifetime, used to size its ease in/out animation so it matches the removal timer.
export type AgentShimmerRange = {
	from: number;
	highlightDurationMs: number;
	phase: AgentShimmerPhase;
	shimmerId: string;
	telepointerLabel?: string;
	to: number;
};

// Rovo AI in-editor telepointer/cursor shown at the end of an agent-authored range (same DOM/style
// pattern as editor-plugin-ai's in-editor direct-streaming telepointer).
const createRovoAgentTelepointer = (label: string): HTMLSpanElement => {
	const element = document.createElement('span');
	element.setAttribute('data-testid', 'ai-in-editor-telepointer-widget');
	element.className = AI_IN_EDITOR_TELEPOINTER_CLASS;
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
	highlightShimmerId: string | undefined,
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
	// Transition a shimmer from the skeleton phase to the purple highlight phase (skeleton timer fired).
	// Guard on an actual match so a timer firing after the shimmer was already removed (superseded by a
	// new batch, or cleared) doesn't rebuild the array and trigger a pointless decoration rebuild.
	if (highlightShimmerId && next.some((shimmer) => shimmer.shimmerId === highlightShimmerId)) {
		next = next.map((shimmer) =>
			shimmer.shimmerId === highlightShimmerId ? { ...shimmer, phase: 'highlight' } : shimmer,
		);
		changed = true;
	}
	if (removedShimmerId) {
		next = next.filter((shimmer) => shimmer.shimmerId !== removedShimmerId);
		changed = true;
	}
	return { changed, next };
};

/**
 * Builds the inline decorations (skeleton bar or purple highlight, per phase) plus the trailing
 * telepointer for the active shimmer ranges. `getValidPos` clamps a raw position to a valid
 * decoration position (owned by `plugin-state`). One bad range is isolated via `onError` so it can't
 * kill the others.
 */
export const buildAgentShimmerDecorations = (
	tr: ReadonlyTransaction,
	shimmers: AgentShimmerRange[],
	getValidPos: (tr: ReadonlyTransaction, pos: number) => number,
	onError: (err: Error) => void,
): Decoration[] => {
	const decorations: Decoration[] = [];
	shimmers.forEach(({ shimmerId, from, to, telepointerLabel, phase, highlightDurationMs }) => {
		try {
			// `getValidPos` already clamps to the last valid position, so only the lower bound needs
			// guarding here (a raw `from < 1` would throw in `doc.resolve`).
			const validFrom = getValidPos(tr, Math.max(from, 1));
			const validTo = getValidPos(tr, to);
			if (validTo <= validFrom) {
				return;
			}
			// Inline decoration over the whole range: the grey skeleton loader, or (once revealed) the
			// purple "just edited" highlight. The highlight eases in and out over its lifetime via a CSS
			// animation whose duration is set inline so it matches the removal timer.
			const isHighlight = phase === 'highlight';
			const inlineAttrs: { class: string; style?: string } = {
				class: isHighlight ? AGENT_EDIT_HIGHLIGHT_CLASS : AGENT_SHIMMER_CLASS,
			};
			if (isHighlight && highlightDurationMs > 0) {
				inlineAttrs.style = `animation-duration: ${highlightDurationMs}ms`;
			}
			decorations.push(
				Decoration.inline(validFrom, validTo, inlineAttrs, { isAgentShimmer: true, shimmerId }),
			);
			// Rovo AI telepointer/cursor (labelled with the agent's type) at the end of the range, shown
			// through BOTH the skeleton and purple-highlight phases so the agent's cursor stays put until
			// the edit is fully revealed.
			if (telepointerLabel) {
				decorations.push(
					Decoration.widget(validTo, createRovoAgentTelepointer(telepointerLabel), {
						isAgentShimmer: true,
						shimmerId,
						class: AI_IN_EDITOR_TELEPOINTER_CLASS,
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
