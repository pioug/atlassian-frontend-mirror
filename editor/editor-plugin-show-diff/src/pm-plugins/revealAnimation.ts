import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { RevealOptions } from '../showDiffPluginType';

import {
	buildWipeableBackground,
	REVEAL_ATTR,
	REVEAL_BG_VAR,
	REVEAL_BORDER_VAR,
} from './decorations/revealStyles';

/**
 * Reveal animation timing. Phase A (0–0.6D): outgoing state fades in, agent highlight wipes out.
 * Phase B (0.6D–D): all highlights wipe in. Uses Web Animations API for element reusability and
 * per-reveal cancellation.
 */

/** Total choreography length when the caller does not specify one. */
export const REVEAL_DEFAULT_DURATION_MS = 950;

/**
 * The reflow settles slightly ahead of the highlights. Running it for the full duration makes the
 * movement read as sluggish next to the cross-fade, which is finished well before it.
 */
const REFLOW_DURATION_FRACTION = 0.8;

/** Share of the total spent cross-fading before the highlights come back. */
const PHASE_A_FRACTION = 0.6;

const EASING = 'ease-in-out';

/** Selector for agent highlights in the outgoing snapshot. */
const CHANGED_DECORATION_SELECTOR = '[data-testid="show-diff-changed-decoration"]';

/**
 * Every marker that identifies a block as changed, in either the outgoing or incoming render.
 * Deleted content is a widget in the incoming state only; reveal markers exist only while revealing.
 */
const CHANGED_BLOCK_SELECTOR = [
	'[data-testid="show-diff-changed-decoration"]',
	'[data-testid="show-diff-deleted-decoration"]',
	`[${REVEAL_ATTR}]`,
].join(', ');

/** Elements that re-mount on clone; replace with placeholders to preserve layout. */
const REMOUNT_UNSAFE_SELECTOR = 'iframe, object, embed, video, audio, canvas';

/**
 * Marks animations this module owns, so a re-bind can tell them from anything else on the node.
 * Suffixed per purpose because one element can legitimately carry several — a changed block that
 * also grows takes both the cross-fade and the clip.
 */
const REVEAL_ID = {
	clock: 'show-diff-reveal-clock',
	fade: 'show-diff-reveal-fade',
	reflow: 'show-diff-reveal-reflow',
	wipe: 'show-diff-reveal-wipe',
} as const;
/** `property` distinguishes the clip from the carry, since one block can need both. */
type ReflowSpec = { index: number; keyframes: Keyframe[]; property: 'clip' | 'carry' };

type RunningReveal = {
	/** Dispatched once the choreography ends, to drop the reveal from plugin state. */
	complete: () => void;
	/** Re-bound to the latest decorations each time the diff is repainted mid-reveal. */
	incoming: Animation[];
	/** Started once, when the outgoing state was captured. Never restarted. */
	outgoing: Animation[];
	/** Height of the changed range before the change, to animate the reflow from. */
	outgoingHeights: Map<number, number>;
	overlay: HTMLElement | undefined;
	phaseA: number;
	reflowDuration: number;
	/** Reflow keyframes keyed by child index, so they can be re-resolved after a repaint. */
	reflowSpecs: ReflowSpec[];
	/** Cleanup for inline styles the reflow animation has to set directly. */
	restoreReflow?: () => void;
	/** Wall clock for the run, so a re-bound animation resumes rather than restarts. */
	startedAt: number;
	total: number;
};

const running = new WeakMap<EditorView, RunningReveal>();

/**
 * Stop any running reveal and drop it from plugin state.
 *
 * Clearing the state is what restores the resting appearance: revealing decorations paint their
 * highlight at zero width, so the repaint that follows is what renders them normally again. Doing
 * it in state rather than by writing styles onto the current elements means decorations rendered
 * later are correct too — an imperative fix only reaches the elements that exist at that instant.
 */
export const cancelReveal = (editorView: EditorView): void => {
	const current = running.get(editorView);
	if (!current) {
		return;
	}
	running.delete(editorView);
	[...current.outgoing, ...current.incoming].forEach((animation) => animation.cancel());
	current.overlay?.remove();
	current.restoreReflow?.();
	current.complete();
};

/**
 * Sanitise cloned subtree: remove IDs, contenteditable, re-mount-unsafe elements.
 * Measures embeds from LIVE element (clone is detached, would measure 0x0).
 */
const sanitiseClone = (live: HTMLElement, clone: HTMLElement): void => {
	clone.removeAttribute('id');
	clone.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
	clone.removeAttribute('contenteditable');
	clone.querySelectorAll('[contenteditable]').forEach((element) => {
		element.removeAttribute('contenteditable');
	});
	// Revealing decorations paint at zero width; snapshot must show full width so clear markers here.
	clone.querySelectorAll<HTMLElement>(`[${REVEAL_ATTR}]`).forEach((element) => {
		element.removeAttribute(REVEAL_ATTR);
		element.style.removeProperty('background-size');
	});

	const liveEmbeds = live.querySelectorAll(REMOUNT_UNSAFE_SELECTOR);
	clone.querySelectorAll(REMOUNT_UNSAFE_SELECTOR).forEach((element, index) => {
		const placeholder = document.createElement('div');
		const source = liveEmbeds[index];
		if (source) {
			const { width, height } = source.getBoundingClientRect();
			placeholder.style.width = `${width}px`;
			placeholder.style.height = `${height}px`;
		}
		element.replaceWith(placeholder);
	});
};

/**
 * Convert flat highlights (from non-revealing render) to wipeable gradients.
 * Reads colour from LIVE element (clone is detached, no computed style).
 */
const makeOutgoingHighlightsWipeable = (
	liveBlock: HTMLElement,
	clonedBlock: HTMLElement,
): HTMLElement[] => {
	const live = liveBlock.querySelectorAll<HTMLElement>(CHANGED_DECORATION_SELECTOR);
	const cloned = clonedBlock.querySelectorAll<HTMLElement>(CHANGED_DECORATION_SELECTOR);
	const wipeable: HTMLElement[] = [];

	cloned.forEach((clone, index) => {
		const source = live[index];
		if (!source) {
			return;
		}
		// Read colour from custom property (revealing render) or computed style (flat render).
		const color =
			source.style.getPropertyValue(REVEAL_BG_VAR).trim() ||
			window.getComputedStyle(source).backgroundColor;

		if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
			return;
		}

		clone.setAttribute(
			'style',
			`${clone.getAttribute('style') ?? ''}${buildWipeableBackground(color)}`,
		);
		// Anchor right: shrinking retracts the highlight through the right edge.
		clone.style.backgroundSize = '100% 100%';
		clone.style.backgroundPosition = '100% 0';
		wipeable.push(clone);
	});

	return wipeable;
};

/**
 * The contiguous run of top-level blocks containing a change.
 *
 * Only these cross-fade. Fading the whole content area would also fade blocks that did not change
 * and have merely been pushed up or down by the reflow, which reads as the entire document
 * flickering.
 *
 * Exact rather than contiguous: an agent can touch two paragraphs either side of untouched ones,
 * and a first-to-last range would sweep up everything between them. The index travels with each
 * block so its outgoing height can be paired with its incoming height across the swap.
 */
const findChangedBlocks = (content: HTMLElement): { block: HTMLElement; index: number }[] =>
	Array.from(content.children)
		.filter((child): child is HTMLElement => child instanceof HTMLElement)
		.map((block, index) => ({ block, index }))
		.filter(
			({ block }) =>
				block.matches(CHANGED_BLOCK_SELECTOR) || block.querySelector(CHANGED_BLOCK_SELECTOR),
		);

/** Outgoing height of every changed block, keyed by its position among the content's children. */
const measureBlocks = (changed: { block: HTMLElement; index: number }[]): Map<number, number> =>
	new Map(changed.map(({ block, index }) => [index, block.getBoundingClientRect().height]));

/**
 * Build and position a snapshot of the outgoing state over the changed blocks.
 *
 * The wrapper is a shallow clone of the ProseMirror element so the snapshot keeps the class-based
 * typography the real content has; a plain div would render the text differently. Inserted as a
 * sibling rather than a child so ProseMirror does not reconcile it away.
 */
const buildOverlay = (
	content: HTMLElement,
	changed: { block: HTMLElement; index: number }[],
): HTMLElement | undefined => {
	const host = content.parentElement;
	if (!host || !content.offsetParent || changed.length === 0) {
		return undefined;
	}

	const wrapper = content.cloneNode(false);
	if (!(wrapper instanceof HTMLElement)) {
		return undefined;
	}

	const contentRect = content.getBoundingClientRect();

	changed.forEach(({ block }) => {
		const clone = block.cloneNode(true);
		if (!(clone instanceof HTMLElement)) {
			return;
		}
		sanitiseClone(block, clone);
		makeOutgoingHighlightsWipeable(block, clone);

		// Each clone is placed at its own offset. Stacking them in flow would close the gaps left by
		// the unchanged blocks that were not copied, so a later block would sit too high.
		const rect = block.getBoundingClientRect();
		clone.style.position = 'absolute';
		clone.style.top = `${rect.top - contentRect.top}px`;
		clone.style.left = `${rect.left - contentRect.left}px`;
		clone.style.width = `${rect.width}px`;
		clone.style.margin = '0';
		wrapper.appendChild(clone);
	});

	wrapper.removeAttribute('id');
	wrapper.removeAttribute('contenteditable');
	// aria-hidden + inert removes overlay from focus, hit-testing and AT (aria-hidden-focus safe).
	wrapper.setAttribute('aria-hidden', 'true');
	wrapper.setAttribute('inert', '');
	wrapper.style.position = 'absolute';
	// Sits on the content box, with the clones positioned relative to it.
	wrapper.style.top = `${content.offsetTop}px`;
	wrapper.style.left = `${content.offsetLeft}px`;
	wrapper.style.width = `${content.offsetWidth}px`;
	// The wrapper inherits the editor's own padding and margin, which would offset the copied blocks
	// a second time on top of the position already measured from them.
	wrapper.style.margin = '0';
	wrapper.style.padding = '0';
	wrapper.style.boxSizing = 'border-box';
	wrapper.style.pointerEvents = 'none';
	wrapper.style.zIndex = '1';

	host.insertBefore(wrapper, content);

	return wrapper;
};

/**
 * Slide the content below the change from where it used to sit to where it now sits.
 *
 * The incoming blocks are already at their final height, so without this everything below them
 * jumps the instant the diff is applied. `margin-bottom` carries the following content; when the
 * change has grown, the last block is also clipped back to its old height and released, so the
 * content below is not overlapped while it catches up.
 */
const animateReflow = (
	changed: { block: HTMLElement; index: number }[],
	outgoingHeights: Map<number, number>,
	duration: number,
): { restore: () => void; specs: ReflowSpec[] } => {
	const specs: ReflowSpec[] = [];
	const restores: (() => void)[] = [];
	const deltas = new Map<number, number>();

	changed.forEach(({ block, index }) => {
		const before = outgoingHeights.get(index);
		if (before === undefined) {
			return;
		}
		const delta = before - block.getBoundingClientRect().height;
		if (Math.abs(delta) < 1) {
			return;
		}
		deltas.set(index, delta);

		// Growth only: clip the block back to its old height and open it up. Without this the taller
		// new content would overlap the content below, which has not caught up yet.
		const growth = Math.max(0, -delta);
		if (growth === 0) {
			return;
		}
		const previousOverflow = block.style.overflow;
		block.style.overflow = 'hidden';
		restores.push(() => {
			block.style.overflow = previousOverflow;
		});
		specs.push({
			index,
			keyframes: [{ clipPath: `inset(0 0 ${growth}px 0)` }, { clipPath: 'inset(0 0 0 0)' }],
			property: 'clip',
		});
	});

	const parent = changed[0]?.block.parentElement;
	if (deltas.size === 0 || !parent) {
		return { restore: () => restores.forEach((restore) => restore()), specs };
	}

	// Everything below a change is carried with `transform`, never `margin`. Margin is a layout
	// property, so each frame would re-lay-out the content below at a fractional offset and
	// re-rasterise its text — that reads as shimmer even at a locked 60fps. Transforms run on the
	// compositor: the glyphs are rasterised once and moved.
	let carried = 0;
	Array.from(parent.children).forEach((child, index) => {
		if (child instanceof HTMLElement && carried !== 0) {
			specs.push({
				index,
				keyframes: [{ transform: `translateY(${carried}px)` }, { transform: 'translateY(0px)' }],
				property: 'carry',
			});
		}
		// Applied after the block itself: a change moves the content below it, not its own top edge.
		carried += deltas.get(index) ?? 0;
	});

	return { restore: () => restores.forEach((restore) => restore()), specs };
};

/** Animate incoming highlights; re-run if diff repaints mid-reveal. */
/**
 * Creates an animation unless the element already carries one of ours, and resumes it at `elapsed`.
 *
 * ProseMirror rebuilds inline decorations on any repaint, which destroys animations bound to them.
 * Widget DOM is reused and so survives, which is why deleted highlights used to animate while added
 * ones snapped in. Re-binding at the elapsed time keeps a re-rendered element in step rather than
 * restarting it from the beginning.
 */
const bind = (
	entry: RunningReveal,
	element: HTMLElement,
	id: string,
	keyframes: Keyframe[],
	options: KeyframeAnimationOptions,
	elapsed: number,
): void => {
	if (element.getAnimations().some((animation) => animation.id === id)) {
		return;
	}
	const animation = element.animate(keyframes, options);
	animation.id = id;
	if (elapsed > 0) {
		animation.currentTime = Math.min(elapsed, options.duration as number);
	}
	entry.incoming.push(animation);
};

const highlightKeyframes = (element: HTMLElement): Keyframe[] => {
	const border = element.style.getPropertyValue(REVEAL_BORDER_VAR).trim();
	return [
		{ backgroundSize: '0% 100%', borderBottomColor: 'transparent', offset: 0 },
		{
			backgroundSize: '0% 100%',
			borderBottomColor: 'transparent',
			easing: EASING,
			offset: PHASE_A_FRACTION,
		},
		{ backgroundSize: '100% 100%', borderBottomColor: border, offset: 1 },
	];
};

/** (Re)binds every animation that runs on live, ProseMirror-managed DOM. */
const applyIncoming = (
	entry: RunningReveal,
	content: HTMLElement,
	total: number,
	phaseA: number,
): void => {
	const elapsed = Math.max(0, performance.now() - entry.startedAt);
	const changedBlocks = findChangedBlocks(content);

	// Only the changed blocks cross-fade. Everything else is unchanged content that has merely
	// moved, and fading it would read as the whole document flickering.
	if (entry.overlay) {
		const fading = changedBlocks.length > 0 ? changedBlocks.map(({ block }) => block) : [content];
		fading.forEach((block) => {
			bind(
				entry,
				block,
				REVEAL_ID.fade,
				[{ opacity: 0 }, { opacity: 1 }],
				{ duration: phaseA, easing: EASING, fill: 'forwards' },
				elapsed,
			);
		});
	}

	content.querySelectorAll<HTMLElement>(`[${REVEAL_ATTR}]`).forEach((element) => {
		bind(
			entry,
			element,
			REVEAL_ID.wipe,
			highlightKeyframes(element),
			{ duration: total, fill: 'forwards' },
			elapsed,
		);
	});

	entry.reflowSpecs.forEach(({ index, keyframes, property }) => {
		const child = content.children[index];
		if (child instanceof HTMLElement) {
			bind(
				entry,
				child,
				`${REVEAL_ID.reflow}-${property}`,
				keyframes,
				{ duration: entry.reflowDuration, easing: EASING, fill: 'backwards' },
				elapsed,
			);
		}
	});
};

/**
 * Re-binds the reveal to the current decorations. Called on every repaint while a reveal is in
 * flight, because a repaint silently destroys any animation attached to re-rendered DOM.
 */
export const rebindReveal = (editorView: EditorView, content: HTMLElement): void => {
	const entry = running.get(editorView);
	if (entry) {
		applyIncoming(entry, content, entry.total, entry.phaseA);
	}
};

const scheduleIncoming = (
	editorView: EditorView,
	entry: RunningReveal,
	content: HTMLElement,
	total: number,
	phaseA: number,
): void => {
	requestAnimationFrame(() => {
		if (running.get(editorView) !== entry) {
			return;
		}

		entry.startedAt = performance.now();

		const reflow = animateReflow(
			findChangedBlocks(content),
			entry.outgoingHeights,
			entry.reflowDuration,
		);
		entry.reflowSpecs = reflow.specs;
		entry.restoreReflow = reflow.restore;

		applyIncoming(entry, content, total, phaseA);

		// The clock runs on the content root, which ProseMirror never replaces. Hanging completion
		// off a decoration animation would strand the reveal whenever that decoration was rebuilt.
		const clock = content.animate([{ opacity: 1 }, { opacity: 1 }], { duration: total });
		clock.id = REVEAL_ID.clock;
		clock.onfinish = () => {
			if (running.get(editorView) === entry) {
				cancelReveal(editorView);
			}
		};
		entry.incoming.push(clock);
	});
};

/**
 * Start the reveal. Must be called BEFORE transaction dispatch (last moment outgoing DOM exists
 * for capture). Incoming half animates a frame later, post-decoration-render.
 */
export const beginReveal = ({
	editorView,
	onComplete,
	reveal,
}: {
	editorView: EditorView;
	/** Drops the reveal from plugin state, so the next paint renders the resting style. */
	onComplete: () => void;
	reveal: RevealOptions;
}): void => {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return;
	}

	const content = editorView.dom;
	if (!(content instanceof HTMLElement)) {
		return;
	}

	const total = reveal.durationMs ?? REVEAL_DEFAULT_DURATION_MS;
	const phaseA = Math.round(total * PHASE_A_FRACTION);

	// Repaint mid-reveal: reuse snapshot (not retake), rebind incoming animations to fresh decorations.
	const existing = running.get(editorView);
	if (existing) {
		existing.incoming.forEach((animation) => animation.cancel());
		existing.incoming = [];
		scheduleIncoming(editorView, existing, content, total, phaseA);
		return;
	}

	// Captured before dispatch: this is the last moment the outgoing layout can be measured.
	const outgoingBlocks = findChangedBlocks(content);
	const overlay = buildOverlay(content, outgoingBlocks);
	const outgoing: Animation[] = [];

	if (overlay) {
		// fill: 'forwards' is load-bearing: default fill: 'none' snaps snapshot to opaque (reads as swap).
		const fadeOut = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
			duration: phaseA,
			easing: EASING,
			fill: 'forwards',
		});
		fadeOut.onfinish = () => {
			overlay.remove();
		};
		outgoing.push(fadeOut);

		overlay.querySelectorAll<HTMLElement>(CHANGED_DECORATION_SELECTOR).forEach((element) => {
			if (!element.style.backgroundImage) {
				return;
			}
			outgoing.push(
				element.animate([{ backgroundSize: '100% 100%' }, { backgroundSize: '0% 100%' }], {
					duration: phaseA,
					easing: EASING,
					fill: 'forwards',
				}),
			);
		});
	}

	const entry: RunningReveal = {
		complete: onComplete,
		incoming: [],
		outgoing,
		outgoingHeights: measureBlocks(outgoingBlocks),
		phaseA,
		reflowDuration: Math.round(total * REFLOW_DURATION_FRACTION),
		reflowSpecs: [],
		startedAt: performance.now(),
		total,
		overlay,
	};
	running.set(editorView, entry);
	scheduleIncoming(editorView, entry, content, total, phaseA);
};
