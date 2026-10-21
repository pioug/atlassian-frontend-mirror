// Node supports findLast, but the package defaults to older array type declarations.
/// <reference lib="es2023.array" />
/* eslint-disable compat/compat */
/**
 * Popover API & HTMLDialogElement polyfills for jsdom.
 *
 * jsdom does not implement the Popover API or the HTMLDialogElement methods
 * (showModal, show, close). This polyfill provides faithful implementations,
 * including timing semantics validated against Chromium via Playwright.
 *
 * Behaviour:
 *  - beforetoggle: sync, cancelable on popover show and dialog show/showModal only. toggle: async
 *    task, never cancelable.
 *  - Rapid show/hide coalesces into one toggle event (originalOldState to finalNewState).
 *  - Dialog: showModal/show fire beforetoggle+toggle. close fires toggle then close event.
 *  - Dialog focus: showModal and show run the dialog focusing steps (focus moves into the
 *    dialog). close returns focus to the element that had it before, when the dialog was modal
 *    or focus is in it. Removing an open dialog from the document makes it non-modal and takes it
 *    out of Escape handling.
 *  - Modal dialogs block the document: while one is open, everything outside the topmost modal
 *    dialog is inert, including popovers. `focus()` does nothing there, and `getComputedStyle()`
 *    reports `pointer-events: none`, so a `user-event` pointer action on it throws, as a user
 *    cannot hit it. `element.click()` and `dispatchEvent()` still work, as in a browser. The
 *    `inert` attribute works the same way.
 *  - Nothing that a browser does not render can take focus: content in a closed dialog, a closed
 *    popover, or a `hidden` subtree.
 *  - Popover focus: showPopover runs the popover focusing steps (`autofocus`), and records the
 *    element that had focus for the first auto or hint popover in a stack. hidePopover, Escape and
 *    a `popover` attribute change return focus to it when focus is in the popover. Light dismiss
 *    and opening another popover do not.
 *  - `requestClose()` fires a cancelable `cancel` event, then closes the dialog unless it was
 *    prevented. It ignores `closedby`, as in a browser.
 *  - Focus fixup: when the focused element becomes hidden, inert or part of a closed dialog or
 *    popover, focus moves to `<body>` (with `blur`) one frame (16 ms) later, as at a browser's next
 *    rendering update. Not synchronously. With fake timers, use `jest.runOnlyPendingTimers()`.
 *  - Dialog `closedBy` IDL property, and Escape honours `closedby` (as a browser that supports
 *    it). Delete `HTMLDialogElement.prototype.closedBy` to model a browser without `closedby`.
 *  - Popover open state tracked via `data-popover-open` (no `:popover-open` in jsdom).
 *  - Auto popovers: maintain an open stack, perform light-dismiss on document mousedown
 *    outside the open chain, and dismiss the topmost on Escape.
 *  - On open, removes any inline `opacity: 0` from the popover element, so the
 *    JavaScript positioning fallback's `ResizeObserver` reveal is not needed in
 *    jsdom, where its non-zero-layout guard can never pass.
 *
 * Companion `toBeVisible` patch lives at `./to-be-visible`.
 *
 * Importing this module has the side-effect of patching the relevant
 * prototypes. It is safe to import multiple times; each branch is guarded
 * to avoid overwriting native implementations or re-patching.
 */

import { bind } from 'bind-event-listener';

type TToggleState = 'open' | 'closed';

/**
 * e.g. `<div#my-id.class-a.class-b>`
 */
function describeElement({ element }: { element: Element }): string {
	const tag = element.tagName ? element.tagName.toLowerCase() : 'unknown';
	const id = element.id ? `#${element.id}` : '';
	const classes =
		element.classList && element.classList.length > 0
			? `.${Array.from(element.classList).join('.')}`
			: '';
	return `<${tag}${id}${classes}>`;
}

type TToggleEventInit = {
	type: string;
	oldState: TToggleState;
	newState: TToggleState;
	cancelable: boolean;
};

function createToggleEvent({ type, oldState, newState, cancelable }: TToggleEventInit): Event {
	if (typeof (globalThis as { ToggleEvent?: unknown }).ToggleEvent === 'function') {
		// ToggleEvent is not in lib.dom.d.ts at the time of writing; cast to any for construction.
		const ToggleEventCtor = (
			globalThis as { ToggleEvent: new (type: string, init: object) => Event }
		).ToggleEvent;
		return new ToggleEventCtor(type, { oldState, newState, cancelable, bubbles: false });
	}

	const event = new Event(type, { cancelable, bubbles: false }) as Event & {
		oldState?: TToggleState;
		newState?: TToggleState;
	};
	event.oldState = oldState;
	event.newState = newState;
	return event;
}

function fireToggleEvent({
	element,
	type,
	oldState,
	newState,
	cancelable,
}: { element: Element } & TToggleEventInit): boolean {
	return element.dispatchEvent(createToggleEvent({ type, oldState, newState, cancelable }));
}

function oppositeState({ state }: { state: TToggleState }): TToggleState {
	if (state === 'open') {
		return 'closed';
	}
	return 'open';
}

// Coalesces rapid show/hide into one toggle event per element.
// Uses setTimeout (task) not Promise.resolve (microtask) to match browser timing.
function createToggleScheduler(): (args: { element: Element; newState: TToggleState }) => void {
	const pending = new Map<Element, { oldState: TToggleState; newState: TToggleState }>();
	return function schedule({ element, newState }) {
		const existing = pending.get(element);
		if (existing) {
			// Coalesce: keep the original oldState, update newState
			pending.set(element, { oldState: existing.oldState, newState });
			return;
		}

		pending.set(element, { oldState: oppositeState({ state: newState }), newState });

		// Task queue (setTimeout): browser fires toggle after microtasks drain, not during
		setTimeout(() => {
			const entry = pending.get(element);
			if (!entry) {
				return;
			}
			pending.delete(element);
			fireToggleEvent({
				element,
				type: 'toggle',
				oldState: entry.oldState,
				newState: entry.newState,
				cancelable: false,
			});
		}, 0);
	};
}

// Like createToggleScheduler but also fires a close event as a separate task after toggle.
function createDialogToggleScheduler(): (args: {
	dialog: HTMLDialogElement;
	newState: TToggleState;
	shouldFireCloseEvent: boolean;
}) => void {
	const pending = new Map<
		HTMLDialogElement,
		{ oldState: TToggleState; newState: TToggleState; shouldFireCloseEvent: boolean }
	>();
	return function schedule({ dialog, newState, shouldFireCloseEvent }) {
		const existing = pending.get(dialog);
		if (existing) {
			// Coalesce: keep the original oldState, merge shouldFireCloseEvent
			pending.set(dialog, {
				oldState: existing.oldState,
				newState,
				shouldFireCloseEvent: existing.shouldFireCloseEvent || shouldFireCloseEvent,
			});
			return;
		}

		pending.set(dialog, {
			oldState: oppositeState({ state: newState }),
			newState,
			shouldFireCloseEvent,
		});

		// Browser fires toggle as a task, not synchronously or as a microtask
		setTimeout(() => {
			const entry = pending.get(dialog);
			if (!entry) {
				return;
			}
			pending.delete(dialog);
			fireToggleEvent({
				element: dialog,
				type: 'toggle',
				oldState: entry.oldState,
				newState: entry.newState,
				cancelable: false,
			});

			if (entry.shouldFireCloseEvent) {
				// Browser fires close as a separate task after toggle
				setTimeout(() => {
					dialog.dispatchEvent(new Event('close', { bubbles: false, cancelable: false }));
				}, 0);
			}
		}, 0);
	};
}

// Popover API
// Spec: https://html.spec.whatwg.org/multipage/popover.html

// `popover` attribute valid values (case-insensitive). Empty / "auto" -> "auto"; unknown -> "manual".
// Spec: https://html.spec.whatwg.org/multipage/popover.html#attr-popover
type TPopoverMode = 'auto' | 'hint' | 'manual';

function getPopoverMode({ element }: { element: HTMLElement }): TPopoverMode | null {
	if (!element.hasAttribute('popover')) {
		return null;
	}
	const raw = element.getAttribute('popover')?.toLowerCase();
	if (!raw || raw === 'auto') {
		return 'auto';
	}
	if (raw === 'hint') {
		return 'hint';
	}
	return 'manual';
}

// IDL property: `el.popover` reflects the popover content attribute. Setter
// writes verbatim; getter canonicalises (unknown -> "manual", empty -> "auto").
// Spec: https://html.spec.whatwg.org/multipage/popover.html#dom-popover
type TPopoverProp = TPopoverMode | null;
if (
	typeof HTMLElement !== 'undefined' &&
	!Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'popover')
) {
	Object.defineProperty(HTMLElement.prototype, 'popover', {
		configurable: true,
		enumerable: true,
		get(this: HTMLElement): TPopoverProp {
			return getPopoverMode({ element: this });
		},
		set(this: HTMLElement, value: TPopoverProp) {
			if (value === null) {
				this.removeAttribute('popover');
				return;
			}
			// Per spec, the IDL setter writes the value verbatim; the getter then
			// canonicalises (so setting an unknown value is reflected as "manual"
			// only when read back, but the attribute keeps the raw string).
			this.setAttribute('popover', String(value));
		},
	});
}

// Open auto popovers in open-order. Used for light-dismiss, Escape, and
// hide-all-popovers-until on new auto opens.
// Spec: https://html.spec.whatwg.org/multipage/popover.html#showing-auto-popover-list
const openAutoStack: HTMLElement[] = [];

// Open hint popovers in open-order. Hints have their own stack: hint closes
// other hints, auto closes all hints, hint never closes autos.
// Spec: https://html.spec.whatwg.org/multipage/popover.html#showing-hint-popover-list
const openHintStack: HTMLElement[] = [];

function isPopoverOpen({ element }: { element: HTMLElement }): boolean {
	return element.hasAttribute('data-popover-open');
}

// Stack lookup: returns the stack the element belongs to (or null for manual /
// non-popovers). Used by hide-handlers to remove from the correct stack and by
// dismissal logic to find the topmost relevant popover.
function stackForMode({ mode }: { mode: TPopoverMode | null }): HTMLElement[] | null {
	if (mode === 'auto') {
		return openAutoStack;
	}
	if (mode === 'hint') {
		return openHintStack;
	}
	return null;
}

// Polyfill-only. Real browsers reveal the popover on the first non-zero layout
// their `ResizeObserver` reports; jsdom always reports 0, so that guard never
// passes and the inline `opacity: 0` is cleared on the open toggle instead.
function clearOpacityOnOpenToggle({ element }: { element: HTMLElement }) {
	const unbind = bind(element, {
		type: 'toggle',
		listener: (event: Event) => {
			const toggleEvent = event as Event & { newState?: TToggleState };
			if (toggleEvent.newState !== 'open') {
				return;
			}
			element.style.removeProperty('opacity');
			unbind();
		},
	});
}

// Spec: "topmost popover ancestor" walks both DOM ancestry AND the invoker
// chain (an invoker is a button whose `popovertarget` references an open
// popover). When opening popover B from a button inside popover A, A is
// considered B's ancestor and stays open. This walks ancestors of the target,
// hopping through any invoker references discovered along the way.
// Find a popover's invoker: an element with `popovertarget=<popover.id>`.
// Spec: https://html.spec.whatwg.org/multipage/popover.html#popover-target-element
function findInvokerForPopover({ popover }: { popover: HTMLElement }): HTMLElement | null {
	if (!popover.id || !popover.ownerDocument) {
		return null;
	}
	const escaped = (typeof CSS !== 'undefined' && CSS.escape ? CSS.escape : String)(popover.id);
	const selector = `[popovertarget="${escaped}"]`;
	return popover.ownerDocument.querySelector<HTMLElement>(selector);
}

// True if `candidate` is reachable from `start` via DOM ancestry plus invoker
// hops. Spec: https://html.spec.whatwg.org/multipage/popover.html#topmost-popover-ancestor
function reachesViaAncestryOrInvoker({
	start,
	candidate,
}: {
	start: Node;
	candidate: HTMLElement;
}): boolean {
	const found = walkAncestorChain<true>({
		start,
		visitor: ({ node }) => {
			if (node === candidate) {
				return true;
			}
			// Hop into the invoked popover's chain when this node is an invoker.
			if (node instanceof HTMLElement) {
				const popovertarget = node.getAttribute('popovertarget');
				if (popovertarget && node.ownerDocument) {
					const referenced = node.ownerDocument.getElementById(popovertarget);
					if (referenced && referenced !== node) {
						if (reachesViaAncestryOrInvoker({ start: referenced, candidate })) {
							return true;
						}
					}
				}
			}
			return null;
		},
	});
	return found === true;
}

// Is `candidate` an ancestor of `target` via DOM nesting OR invoker chain?
// Spec: https://html.spec.whatwg.org/multipage/popover.html#topmost-popover-ancestor
function isInChainTo({
	candidate,
	target,
}: {
	candidate: HTMLElement;
	target: Node | null;
}): boolean {
	if (!(target instanceof Node)) {
		return false;
	}
	if (reachesViaAncestryOrInvoker({ start: target, candidate })) {
		return true;
	}
	// If target is itself a popover, also walk its invoker's chain (a button
	// elsewhere in the DOM that has `popovertarget=<target.id>`).
	if (target instanceof HTMLElement && target.hasAttribute('popover')) {
		const invoker = findInvokerForPopover({ popover: target });
		if (invoker && reachesViaAncestryOrInvoker({ start: invoker, candidate })) {
			return true;
		}
	}
	return false;
}

// Two-phase light-dismiss: pointerdown stores the nearest open popover for
// the target; pointerup dismisses popovers that are not in that popover's
// chain when the same target is hit. Drag-out / drag-in does not dismiss.
// Spec: https://html.spec.whatwg.org/multipage/popover.html#light-dismiss-open-popovers
const pointerdownState: { target: HTMLElement | null } = { target: null };

// If `node` is an invoker for an open popover, return that popover.
// Spec: https://html.spec.whatwg.org/multipage/popover.html#popover-target-element
function invokedOpenPopover({ node }: { node: Node }): HTMLElement | null {
	if (!(node instanceof HTMLElement)) {
		return null;
	}
	const popovertarget = node.getAttribute('popovertarget');
	if (!popovertarget || !node.ownerDocument) {
		return null;
	}
	const referenced = node.ownerDocument.getElementById(popovertarget);
	if (!referenced || referenced === node || !isPopoverOpen({ element: referenced })) {
		return null;
	}
	return referenced;
}

// Cycle-safe ancestor walker. Returns the first non-null `visitor` result.
function walkAncestorChain<T>({
	start,
	visitor,
}: {
	start: Node | null;
	visitor: ({ node }: { node: Node }) => T | null;
}): T | null {
	const seen = new Set<Node>();
	function step(node: Node | null): T | null {
		if (!node || seen.has(node)) {
			return null;
		}
		seen.add(node);
		const result = visitor({ node });
		if (result !== null) {
			return result;
		}
		return step(node.parentNode);
	}
	return step(start);
}

// Spec: https://html.spec.whatwg.org/multipage/popover.html#nearest-inclusive-open-popover
function nearestOpenPopover({ target }: { target: Node | null }): HTMLElement | null {
	return walkAncestorChain({
		start: target,
		visitor: ({ node }) => {
			if (node instanceof HTMLElement && isPopoverOpen({ element: node })) {
				return node;
			}
			return invokedOpenPopover({ node });
		},
	});
}

/**
 * Walks the shadow-including inclusive ancestors of `node` (a shadow root steps to its host) and
 * returns the first one that matches `isMatch`.
 */
function findShadowIncludingInclusiveAncestor({
	node,
	isMatch,
}: {
	node: Node | null;
	isMatch: (candidate: Node) => boolean;
}): Node | null {
	if (!node) {
		return null;
	}
	if (isMatch(node)) {
		return node;
	}
	if (node instanceof ShadowRoot) {
		return findShadowIncludingInclusiveAncestor({ node: node.host, isMatch });
	}
	return findShadowIncludingInclusiveAncestor({ node: node.parentNode, isMatch });
}

function isShadowIncludingInclusiveAncestor({
	ancestor,
	node,
}: {
	ancestor: Node;
	node: Node;
}): boolean {
	return (
		findShadowIncludingInclusiveAncestor({
			node,
			isMatch: (candidate) => candidate === ancestor,
		}) !== null
	);
}

/**
 * Polyfill state on an element: the "previously focused element", set by `show()`, `showModal()`
 * and `showPopover()`.
 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#previously-focused-element
 */
type TPolyfillElement = HTMLElement & {
	_previouslyFocusedElement?: Element | null;
	// Spec: https://html.spec.whatwg.org/multipage/popover.html#popover-hiding
	_isPopoverHiding?: boolean;
};

/**
 * Polyfill state on a `<dialog>`: the "is modal" flag, the request close state, and the "is
 * running cancel action" flag of its close watcher.
 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#is-modal
 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#enable-close-watcher-for-requestclose()
 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-is-running-cancel-action
 */
type TPolyfillDialog = HTMLDialogElement &
	TPolyfillElement & {
		_isModal?: boolean;
		_requestCloseReturnValue?: string | null;
		_enableCloseWatcherForRequestClose?: boolean;
		_isRunningCancelAction?: boolean;
	};

/**
 * Modal dialogs in the order they joined the top layer. The last connected modal one blocks its
 * document.
 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#blocked-by-a-modal-dialog
 */
const modalDialogs: TPolyfillDialog[] = [];

function removeModalDialog({ dialog }: { dialog: TPolyfillDialog }) {
	const index = modalDialogs.indexOf(dialog);
	if (index !== -1) {
		modalDialogs.splice(index, 1);
	}
}

/**
 * Represents one dialog or popover opening so queued Escape requests cannot close a later opening.
 */
type TEscapeLayer =
	| { type: 'popover'; element: HTMLElement }
	| { type: 'dialog'; element: TPolyfillDialog };
/**
 * Tracks dialog and popover Escape targets in opening order.
 */
const escapeLayers: TEscapeLayer[] = [];

/**
 * Removes an opening from Escape tracking so it cannot receive a later dismissal request.
 */
function unregisterEscapeLayer({ element }: { element: HTMLElement }) {
	const index = escapeLayers.findIndex((layer) => layer.element === element);
	if (index !== -1) {
		escapeLayers.splice(index, 1);
	}
}

/**
 * Records a new opening, replacing any stale registration for the same element.
 */
function registerEscapeLayer({ layer }: { layer: TEscapeLayer }) {
	unregisterEscapeLayer({ element: layer.element });
	escapeLayers.push(layer);
}

/**
 * Checks whether a tracked element is still connected and open, including direct DOM changes.
 */
function isEscapeLayerOpen({ layer }: { layer: TEscapeLayer }): boolean {
	return (
		layer.element.isConnected &&
		(layer.type === 'dialog' ? layer.element.open : isPopoverOpen({ element: layer.element }))
	);
}

/**
 * Removes registrations for closed or disconnected elements before choosing an Escape target.
 */
function pruneClosedEscapeLayers() {
	escapeLayers
		.filter((layer) => !isEscapeLayerOpen({ layer }))
		.forEach((layer) => unregisterEscapeLayer({ element: layer.element }));
}

/**
 * **Dialog removing and insertion steps**
 *
 * jsdom has no hook that runs when a node leaves or joins the document. The polyfill watches open
 * dialogs with a `MutationObserver`, and calls `takeRecords()` before it reads dialog state, so the
 * steps take effect at once, as in a browser.
 *
 * A removed dialog that keeps `open` stays watched until it closes, so inserting it again, even in
 * a later task, runs the insertion steps. The polyfill sees an insertion into the document, or
 * into a shadow root that held the dialog when it opened.
 *
 * Open popovers are watched the same way, for the popover removing steps.
 */
const watchedDialogs = new Set<TPolyfillDialog>();
const watchedPopovers = new Set<HTMLElement>();
const dialogRemovalObserver: { current: MutationObserver | null } = { current: null };

/**
 * The popover removing steps: the hide popover algorithm with no focus return and no events. Set
 * below, where the hide popover algorithm is defined.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#the-popover-attribute:html-element-removing-steps
 */
const popoverRemovingSteps: { run: ((args: { popover: HTMLElement }) => void) | null } = {
	run: null,
};

/**
 * The dialog leaves the top layer, its close watcher is destroyed, and it is no longer modal.
 * It keeps its `open` attribute and its previously focused element.
 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element:html-element-removing-steps
 */
function runDialogRemovingSteps({ dialog }: { dialog: TPolyfillDialog }) {
	unregisterEscapeLayer({ element: dialog });
	removeModalDialog({ dialog });
	dialog._isModal = false;
}

/**
 * An open dialog that joins the document gets a close watcher again. It is never modal: it ran
 * the removing steps first, or it was never shown modally.
 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element:html-element-insertion-steps
 */
function runDialogInsertionSteps({ dialog }: { dialog: TPolyfillDialog }) {
	dialog._isModal = false;
	if (dialog.hasAttribute('open') && dialog.isConnected) {
		registerEscapeLayer({ layer: { type: 'dialog', element: dialog } });
	}
}

function disconnectRemovalObserverWhenIdle() {
	if (watchedDialogs.size === 0 && watchedPopovers.size === 0) {
		dialogRemovalObserver.current?.disconnect();
		dialogRemovalObserver.current = null;
	}
}

function stopWatchingDialog({ dialog }: { dialog: TPolyfillDialog }) {
	watchedDialogs.delete(dialog);
	disconnectRemovalObserverWhenIdle();
}

function processDialogMutations({ records }: { records: MutationRecord[] }) {
	records.forEach((record) => {
		record.removedNodes.forEach((removedNode) => {
			watchedDialogs.forEach((dialog) => {
				if (isShadowIncludingInclusiveAncestor({ ancestor: removedNode, node: dialog })) {
					runDialogRemovingSteps({ dialog });
				}
			});
			// Moving an open popover removes it first, so a move hides it too, as in a browser.
			watchedPopovers.forEach((popover) => {
				if (isShadowIncludingInclusiveAncestor({ ancestor: removedNode, node: popover })) {
					watchedPopovers.delete(popover);
					popoverRemovingSteps.run?.({ popover });
				}
			});
		});
		record.addedNodes.forEach((addedNode) => {
			watchedDialogs.forEach((dialog) => {
				if (isShadowIncludingInclusiveAncestor({ ancestor: addedNode, node: dialog })) {
					runDialogInsertionSteps({ dialog });
				}
			});
		});
	});
	// A removed dialog that keeps `open` stays watched, so inserting it again runs the insertion steps.
	watchedDialogs.forEach((dialog) => {
		if (!dialog.hasAttribute('open')) {
			stopWatchingDialog({ dialog });
		}
	});
	watchedPopovers.forEach((popover) => {
		if (!isPopoverOpen({ element: popover })) {
			watchedPopovers.delete(popover);
		}
	});
	disconnectRemovalObserverWhenIdle();
}

/**
 * Runs the dialog and popover removing steps, and the dialog insertion steps, for every pending
 * DOM change. Call it before reading dialog or popover state.
 */
function flushDialogMutations() {
	const observer = dialogRemovalObserver.current;
	if (!observer) {
		return;
	}
	processDialogMutations({ records: observer.takeRecords() });
}

// A `MutationObserver` does not see into shadow trees, so observe each root that holds the dialog.
function observeRootsOf({ observer, node }: { observer: MutationObserver; node: Node }) {
	const root = node.getRootNode();
	observer.observe(root, { childList: true, subtree: true });
	if (root instanceof ShadowRoot) {
		observeRootsOf({ observer, node: root.host });
	}
}

function getRemovalObserver(): MutationObserver {
	const observer =
		dialogRemovalObserver.current ??
		new MutationObserver((records) => processDialogMutations({ records }));
	dialogRemovalObserver.current = observer;
	return observer;
}

function watchDialogForRemoval({ dialog }: { dialog: TPolyfillDialog }) {
	// A disconnected dialog has nothing to be removed from.
	if (typeof MutationObserver === 'undefined' || !dialog.isConnected) {
		return;
	}
	watchedDialogs.add(dialog);
	observeRootsOf({ observer: getRemovalObserver(), node: dialog });
}

function watchPopoverForRemoval({ popover }: { popover: HTMLElement }) {
	if (typeof MutationObserver === 'undefined' || !popover.isConnected) {
		return;
	}
	watchedPopovers.add(popover);
	observeRootsOf({ observer: getRemovalObserver(), node: popover });
}

/**
 * The computed closed-by state of a dialog.
 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#computed-closed-by-state
 */
function getComputedClosedBy({
	dialog,
}: {
	dialog: TPolyfillDialog;
}): 'any' | 'closerequest' | 'none' {
	flushDialogMutations();
	const closedBy = dialog.getAttribute('closedby')?.toLowerCase();
	if (closedBy === 'any' || closedBy === 'closerequest' || closedBy === 'none') {
		return closedBy;
	}
	// Missing or invalid: Auto. Close requests for modal dialogs only.
	return dialog._isModal ? 'closerequest' : 'none';
}

/**
 * Whether the environment supports `closedby`. A test can delete
 * `HTMLDialogElement.prototype.closedBy` to model a browser without it (for example Safari 27).
 * Then the attribute is ignored, as in that browser.
 */
function isClosedBySupported(): boolean {
	return 'closedBy' in HTMLDialogElement.prototype;
}

/**
 * Checks whether a layer accepts Escape, using closedby and modality for dialogs.
 */
function acceptsEscape({ layer }: { layer: TEscapeLayer }): boolean {
	if (layer.type === 'popover') {
		const mode = getPopoverMode({ element: layer.element });
		return mode === 'auto' || mode === 'hint';
	}
	if (!isClosedBySupported()) {
		// Without `closedby`, only modal dialogs take close requests.
		return Boolean(layer.element._isModal);
	}
	return getComputedClosedBy({ dialog: layer.element }) !== 'none';
}

/**
 * **Rendering, inertness and focus**
 *
 * jsdom has no rendering and no inertness, so it focuses and hit-tests content that a browser does
 * not. The polyfill models both from the DOM.
 */

/**
 * The parent of `node` in the flat tree: the slot of a slotted node, the host of a shadow root,
 * else the parent node.
 * Spec: https://drafts.csswg.org/css-scoping/#flat-tree
 */
function getFlatTreeParent({ node }: { node: Node }): Node | null {
	if (node instanceof Element || node instanceof Text) {
		const slot = node.assignedSlot;
		if (slot) {
			return slot;
		}
	}
	if (node instanceof ShadowRoot) {
		return node.host;
	}
	return node.parentNode;
}

/**
 * Walks the flat tree inclusive ancestors of `node` and returns the first non-null `visit` result.
 */
function findInFlatTreeAncestors<T>({
	node,
	visit,
}: {
	node: Node | null;
	visit: (candidate: Node) => T | null;
}): T | null {
	if (!node) {
		return null;
	}
	const result = visit(node);
	if (result !== null) {
		return result;
	}
	return findInFlatTreeAncestors({ node: getFlatTreeParent({ node }), visit });
}

/**
 * The modal dialog that blocks `document`: the topmost modal dialog in its top layer.
 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#blocked-by-a-modal-dialog
 */
function getBlockingModalDialog({ document }: { document: Document }): TPolyfillDialog | null {
	if (modalDialogs.length === 0) {
		return null;
	}
	flushDialogMutations();
	return (
		modalDialogs.findLast(
			(dialog) =>
				dialog.ownerDocument === document &&
				dialog.isConnected &&
				dialog.hasAttribute('open') &&
				Boolean(dialog._isModal),
		) ?? null
	);
}

/**
 * Whether `node` is inert: it is in an `inert` subtree, or it is outside the modal dialog that
 * blocks its document. Popovers outside that dialog are inert too, as in a browser. The blocking
 * dialog escapes the inertness of its ancestors, but not its own `inert` attribute.
 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#inert-subtrees
 */
function isInert({ node }: { node: Node }): boolean {
	const ownerDocument = node.ownerDocument;
	const blockingDialog =
		ownerDocument && node.isConnected ? getBlockingModalDialog({ document: ownerDocument }) : null;
	const result = findInFlatTreeAncestors<'inert' | 'escapes-inertness'>({
		node,
		visit: (candidate) => {
			if (candidate instanceof Element && candidate.hasAttribute('inert')) {
				return 'inert';
			}
			if (candidate === blockingDialog) {
				return 'escapes-inertness';
			}
			return null;
		},
	});
	if (result === 'inert') {
		return true;
	}
	if (result === 'escapes-inertness') {
		return false;
	}
	return blockingDialog !== null;
}

/**
 * Whether the user agent style sheet gives `candidate` `display: none` (or, for
 * `hidden="until-found"`, hides its content). `isSelf` is true when `candidate` is the element
 * being checked, not an ancestor of it.
 * Spec: https://html.spec.whatwg.org/multipage/rendering.html#hidden-elements
 * Spec: https://html.spec.whatwg.org/multipage/rendering.html#the-dialog-element-2
 */
function isNotRenderedRoot({
	candidate,
	isSelf,
}: {
	candidate: Element;
	isSelf: boolean;
}): boolean {
	if (candidate.hasAttribute('hidden') && candidate.localName !== 'embed') {
		// `hidden="until-found"` hides the content of the element, not the element itself.
		return !isSelf || candidate.getAttribute('hidden')?.toLowerCase() !== 'until-found';
	}
	if (candidate instanceof HTMLDialogElement) {
		return !candidate.hasAttribute('open');
	}
	return (
		candidate instanceof HTMLElement &&
		candidate.hasAttribute('popover') &&
		!isPopoverOpen({ element: candidate })
	);
}

/**
 * Whether a browser renders `element`: it is not in a closed `<dialog>`, a closed popover or a
 * `hidden` subtree. Only the user agent style sheet rules are modelled. Author styles that override
 * `display` (for example `[popover] { display: block }`) are not, so the polyfill is stricter than
 * Chrome there: Chrome focuses content in such a closed popover.
 */
function isRendered({ element }: { element: Element }): boolean {
	const notRenderedRoot = findInFlatTreeAncestors<Element>({
		node: element,
		visit: (candidate) => {
			if (
				candidate instanceof Element &&
				isNotRenderedRoot({ candidate, isSelf: candidate === element })
			) {
				return candidate;
			}
			return null;
		},
	});
	return notRenderedRoot === null;
}

/**
 * Whether a browser refuses to focus `element` because it is not rendered or it is inert.
 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#focusing-steps
 */
function isFocusBlocked({ element }: { element: Element }): boolean {
	return !isRendered({ element }) || isInert({ node: element });
}

type TFocusablePrototype = { focus: (options?: FocusOptions) => void };

/**
 * `focus()` does nothing on an element that a browser does not render or that is inert. jsdom
 * would focus it. For example, React restores focus to the element that had it before a commit,
 * and that element can be in a dialog that the commit closed. The check crosses shadow roots, and
 * covers HTML, SVG and MathML elements.
 */
function blockFocusWhereBrowsersDo({ prototype }: { prototype: TFocusablePrototype }) {
	const originalFocus = prototype.focus;
	const marker = '__topLayerPolyfillFocus';
	if (marker in originalFocus) {
		return;
	}
	function focus(this: Element, options?: FocusOptions) {
		if (isFocusBlocked({ element: this })) {
			return;
		}
		originalFocus.call(this, options);
	}
	Object.defineProperty(focus, marker, { value: true });
	prototype.focus = focus;
}

if (typeof HTMLElement !== 'undefined') {
	blockFocusWhereBrowsersDo({ prototype: HTMLElement.prototype });
}
if (typeof SVGElement !== 'undefined') {
	blockFocusWhereBrowsersDo({ prototype: SVGElement.prototype });
}
if (typeof MathMLElement !== 'undefined') {
	blockFocusWhereBrowsersDo({ prototype: MathMLElement.prototype });
}

/**
 * The `pointer-events` value that models hit testing for `element`: `none` when it is inert, and
 * `auto` for the blocking modal dialog, so its content is not seen to inherit `none` from the
 * blocked `<body>`. Null when the computed style is left alone.
 */
function getHitTestPointerEvents({ element }: { element: Element }): 'none' | 'auto' | null {
	if (!element.isConnected) {
		return null;
	}
	if (isInert({ node: element })) {
		return 'none';
	}
	if (element === getBlockingModalDialog({ document: element.ownerDocument })) {
		return 'auto';
	}
	return null;
}

/**
 * Hit testing skips inert nodes, as if they had `pointer-events: none`. jsdom has no hit testing,
 * and `user-event` reads the computed `pointer-events` before each pointer action. So the computed
 * style reports `none` for an inert element, and a `user-event` click on it throws, as a user cannot
 * click it. `element.click()` and `dispatchEvent()` are not affected, as in a browser.
 *
 * This is the one deliberate divergence from browsers: Chrome keeps the computed `pointer-events`
 * of inert content (usually `auto`) and only its hit testing skips it. The polyfill changes the
 * computed value because that is the only hit-testing input `user-event` reads.
 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#inert-subtrees
 */
if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
	const originalGetComputedStyle = window.getComputedStyle;
	const marker = '__topLayerPolyfillGetComputedStyle';
	if (!(marker in originalGetComputedStyle)) {
		// A function expression: oxlint forbids a function declaration in a block.
		const getComputedStyle = function getComputedStyle(
			element: Element,
			pseudoElement?: string | null,
		): CSSStyleDeclaration {
			const declaration =
				pseudoElement === undefined
					? originalGetComputedStyle.call(window, element)
					: originalGetComputedStyle.call(window, element, pseudoElement);
			if (pseudoElement || !(element instanceof Element)) {
				return declaration;
			}
			const pointerEvents = getHitTestPointerEvents({ element });
			if (pointerEvents === 'none') {
				declaration.setProperty('pointer-events', 'none');
			}
			if (pointerEvents === 'auto' && declaration.getPropertyValue('pointer-events') === '') {
				declaration.setProperty('pointer-events', 'auto');
			}
			return declaration;
		};
		Object.defineProperty(getComputedStyle, marker, { value: true });
		window.getComputedStyle = getComputedStyle;
	}
}

type TFocusableElement = HTMLElement | SVGElement | MathMLElement;

function isFocusableElementType(element: Element | null): element is TFocusableElement {
	if (element instanceof HTMLElement || element instanceof SVGElement) {
		return true;
	}
	return typeof MathMLElement !== 'undefined' && element instanceof MathMLElement;
}

function getDeepActiveElement({ element }: { element: Element }): Element {
	const innerActiveElement = element.shadowRoot?.activeElement;
	if (!innerActiveElement) {
		return element;
	}
	return getDeepActiveElement({ element: innerActiveElement });
}

/**
 * The focused element: the DOM anchor of the focused area, inside shadow roots too. It is null when
 * the viewport has focus (jsdom then reports `<body>` as the active element).
 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#focused
 */
function getFocusedElement({ document }: { document: Document }): Element | null {
	const activeElement = document.activeElement;
	if (
		!activeElement ||
		activeElement === document.body ||
		activeElement === document.documentElement
	) {
		return null;
	}
	return getDeepActiveElement({ element: activeElement });
}

/**
 * Moves focus from `element` to the viewport, firing `blur` and `focusout`. jsdom only blurs an
 * element it treats as focusable, so a `<dialog>` that took focus without a `tabindex` gets a
 * temporary one.
 */
function blurElement({ element }: { element: TFocusableElement }) {
	element.blur();
	if (getFocusedElement({ document: element.ownerDocument }) !== element) {
		return;
	}
	if (element.hasAttribute('tabindex')) {
		return;
	}
	element.setAttribute('tabindex', '-1');
	element.blur();
	element.removeAttribute('tabindex');
}

/**
 * **Focus fixup**
 *
 * When the focused element stops being focusable (it becomes hidden or inert, or its dialog or
 * popover closes), a browser moves focus to the viewport at its next rendering update, after
 * animation frame callbacks, and fires `blur`. It does not do it synchronously. The polyfill
 * watches the attributes that cause this, and checks one frame later. Removing the
 * focused element is a synchronous fixup, which jsdom does itself.
 * Spec: https://html.spec.whatwg.org/multipage/webappapis.html#update-the-rendering
 */
function getFocusedElementToFixUp({ document }: { document: Document }): TFocusableElement | null {
	const focusedElement = getFocusedElement({ document });
	if (!isFocusableElementType(focusedElement) || !isFocusBlocked({ element: focusedElement })) {
		return null;
	}
	return focusedElement;
}

function runFocusFixup({ document }: { document: Document }) {
	const focusedElement = getFocusedElementToFixUp({ document });
	if (focusedElement) {
		blurElement({ element: focusedElement });
	}
}

/**
 * A browser runs the focus fixup at its next rendering update, about one frame later at 60 Hz.
 * The polyfill uses a timer, not `requestAnimationFrame`: some Jest setups stub
 * `requestAnimationFrame` so that it never runs by itself. With fake timers, run
 * `jest.runOnlyPendingTimers()`, `jest.runAllTimers()` or `jest.advanceTimersByTime(16)`.
 */
const focusFixupDelayMs = 16;

/**
 * When the focused element can no longer have focus, checks it again one frame later. The
 * polyfill calls it when it closes a dialog or hides a popover. Other attribute changes reach it
 * through a `MutationObserver`, so after a microtask. No timer is set when focus is still allowed,
 * so tests that count timers see none.
 */
function scheduleFocusFixup({ document }: { document: Document }) {
	if (!getFocusedElementToFixUp({ document })) {
		return;
	}
	setTimeout(() => runFocusFixup({ document }), focusFixupDelayMs);
}

type TFocusFixupDocument = Document & { __atTopLayerFocusFixup?: boolean };
if (
	typeof document !== 'undefined' &&
	typeof MutationObserver !== 'undefined' &&
	!(document as TFocusFixupDocument).__atTopLayerFocusFixup
) {
	(document as TFocusFixupDocument).__atTopLayerFocusFixup = true;
	const fixupDocument = document;
	const fixupObserver = new MutationObserver(() => scheduleFocusFixup({ document: fixupDocument }));
	/**
	 * Only attributes that the polyfill reads to decide rendering and inertness are watched.
	 * `style` and `class` are not: deciding from them needs jsdom's `getComputedStyle()`, which
	 * runs the whole cascade on each call, and class changes are the most frequent mutation in
	 * React suites. jsdom's cascade also has no layout, media queries or most pseudo-classes, so it
	 * would move focus where a browser does not. `focus()` does not read computed styles either.
	 */
	const fixupObserverOptions: MutationObserverInit = {
		attributes: true,
		subtree: true,
		attributeFilter: ['hidden', 'inert', 'open', 'popover', 'data-popover-open'],
	};
	fixupObserver.observe(fixupDocument, fixupObserverOptions);
	// A `MutationObserver` does not see into shadow trees, so watch each new shadow root too.
	const originalAttachShadow = Element.prototype.attachShadow;
	const attachShadowMarker = '__topLayerPolyfillAttachShadow';
	if (typeof originalAttachShadow === 'function' && !(attachShadowMarker in originalAttachShadow)) {
		// A function expression: oxlint forbids a function declaration in a block.
		const attachShadow = function attachShadow(this: Element, init: ShadowRootInit): ShadowRoot {
			const shadowRoot = originalAttachShadow.call(this, init);
			fixupObserver.observe(shadowRoot, fixupObserverOptions);
			return shadowRoot;
		};
		Object.defineProperty(attachShadow, attachShadowMarker, { value: true });
		Element.prototype.attachShadow = attachShadow;
	}
}

// Focuses the element if a browser would, and jsdom treats it as focusable. Returns whether it
// took focus.
function tryFocus({ element }: { element: TFocusableElement }): boolean {
	// A disconnected element is not a focusable area. jsdom still focuses an SVG `<a href>` there.
	if (!element.isConnected || isFocusBlocked({ element })) {
		return false;
	}
	element.focus();
	return getFocusedElement({ document: element.ownerDocument }) === element;
}

/**
 * Walks the descendants of `root` in tree order (not into shadow trees) and stops at the first
 * one for which `visit` returns true.
 */
function someDescendant({
	root,
	visit,
}: {
	root: HTMLElement | ShadowRoot;
	visit: (element: TFocusableElement) => boolean;
}): boolean {
	const ownerDocument = root instanceof ShadowRoot ? root.host.ownerDocument : root.ownerDocument;
	const walker = ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
	let node = walker.nextNode();
	while (node) {
		if (isFocusableElementType(node as Element) && visit(node as TFocusableElement)) {
			return true;
		}
		node = walker.nextNode();
	}
	return false;
}

/**
 * Get the focusable area for an element that is not itself a focusable area. Only the shadow host
 * case is modelled: a host whose shadow root delegates focus gives its focus delegate. jsdom does
 * not implement `delegatesFocus`, so this applies only where the environment reports it.
 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#get-the-focusable-area
 */
function focusFocusableAreaFor({ element }: { element: Element }): boolean {
	const shadowRoot = element.shadowRoot;
	if (!shadowRoot?.delegatesFocus || isFocusBlocked({ element })) {
		return false;
	}
	// `focusDelegate` and this function recurse into each other.
	return focusDelegate({ focusTarget: element, whereToLook: shadowRoot });
}

/**
 * The autofocus delegate: the first `autofocus` descendant that can take focus, or the focus
 * delegate of an `autofocus` shadow host. Returns whether it took focus.
 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#autofocus-delegate
 */
function focusAutofocusDelegate({
	whereToLook,
}: {
	whereToLook: HTMLElement | ShadowRoot;
}): boolean {
	return someDescendant({
		root: whereToLook,
		visit: (element) =>
			element.hasAttribute('autofocus') &&
			(tryFocus({ element }) || focusFocusableAreaFor({ element })),
	});
}

/**
 * The focus delegate: the autofocus delegate, else the first descendant that can take focus. For
 * a dialog, only a sequentially focusable descendant (`tabIndex >= 0`) counts, so a
 * `tabindex="-1"` element is skipped. A shadow host that delegates focus gives its own focus
 * delegate.
 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#focus-delegate
 */
function focusDelegate({
	focusTarget,
	whereToLook,
}: {
	focusTarget: Element;
	whereToLook: HTMLElement | ShadowRoot;
}): boolean {
	if (focusAutofocusDelegate({ whereToLook })) {
		return true;
	}
	const isDialog = focusTarget instanceof HTMLDialogElement;
	return someDescendant({
		root: whereToLook,
		visit: (element) => {
			const isCandidate = !isDialog || element.tabIndex >= 0;
			if (isCandidate && tryFocus({ element })) {
				return true;
			}
			return focusFocusableAreaFor({ element });
		},
	});
}

// jsdom only treats a `<dialog>` as focusable with a `tabindex`, so a temporary one focuses it.
function focusDialogItself({ dialog }: { dialog: HTMLDialogElement }) {
	if (dialog.hasAttribute('tabindex')) {
		dialog.focus();
		return;
	}
	dialog.setAttribute('tabindex', '-1');
	dialog.focus();
	dialog.removeAttribute('tabindex');
}

/**
 * The dialog focusing steps, for both `showModal()` and `show()`:
 * - a dialog with `autofocus` focuses itself;
 * - else its focus delegate;
 * - else the dialog itself.
 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#dialog-focusing-steps
 */
function runDialogFocusingSteps({ dialog }: { dialog: HTMLDialogElement }) {
	if (dialog.hasAttribute('autofocus')) {
		focusDialogItself({ dialog });
		return;
	}
	if (focusDelegate({ focusTarget: dialog, whereToLook: dialog })) {
		return;
	}
	focusDialogItself({ dialog });
}

/**
 * The popover focusing steps: a `<dialog>` runs the dialog focusing steps. Otherwise a popover
 * with `autofocus` focuses itself, else its autofocus delegate takes focus. With neither, focus
 * does not move.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#popover-focusing-steps
 */
function runPopoverFocusingSteps({ popover }: { popover: HTMLElement }) {
	if (popover instanceof HTMLDialogElement) {
		runDialogFocusingSteps({ dialog: popover });
		return;
	}
	if (popover.hasAttribute('autofocus')) {
		popover.focus();
		return;
	}
	focusAutofocusDelegate({ whereToLook: popover });
}

function isFocusIn({ container }: { container: HTMLElement }): boolean {
	const focusedElement = getFocusedElement({ document: container.ownerDocument });
	return (
		focusedElement !== null &&
		isShadowIncludingInclusiveAncestor({ ancestor: container, node: focusedElement })
	);
}

/**
 * Runs the focusing steps for a previously focused element. They do nothing for an element that
 * is gone or cannot take focus. The viewport is not scrolled.
 */
function focusPreviouslyFocusedElement({ element }: { element: Element | null }) {
	if (isFocusableElementType(element) && element.isConnected) {
		element.focus({ preventScroll: true });
	}
}

/**
 * The focus part of closing a dialog: if focus is in the dialog, or it was modal, focus returns to
 * the previously focused element, at once. When it does not, focus can stay in the closed dialog
 * until the focus fixup moves it to the viewport.
 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#close-the-dialog
 */
function restoreFocusOnClose({ dialog, wasModal }: { dialog: TPolyfillDialog; wasModal: boolean }) {
	const element = dialog._previouslyFocusedElement ?? null;
	dialog._previouslyFocusedElement = null;
	if (element === null) {
		return;
	}
	if (wasModal || isFocusIn({ container: dialog })) {
		focusPreviouslyFocusedElement({ element });
	}
}

/**
 * The close watcher of an open, connected dialog. The polyfill has one exactly when the dialog is
 * tracked for Escape.
 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-active
 */
function hasActiveCloseWatcher({ dialog }: { dialog: TPolyfillDialog }): boolean {
	return escapeLayers.some((layer) => layer.element === dialog) && dialog.isConnected;
}

/**
 * The "get enabled state" of a dialog close watcher.
 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#set-the-dialog-close-watcher
 */
function isCloseWatcherEnabled({ dialog }: { dialog: TPolyfillDialog }): boolean {
	return (
		Boolean(dialog._enableCloseWatcherForRequestClose) || getComputedClosedBy({ dialog }) !== 'none'
	);
}

/**
 * Fires the cancel action of a dialog close watcher: a `cancel` event. Returns whether closing
 * should continue.
 */
function runDialogCancelAction({
	dialog,
	canPreventClose,
}: {
	dialog: TPolyfillDialog;
	canPreventClose: boolean;
}): boolean {
	dialog._isRunningCancelAction = true;
	try {
		return dialog.dispatchEvent(
			new Event('cancel', { cancelable: canPreventClose, bubbles: false }),
		);
	} finally {
		dialog._isRunningCancelAction = false;
	}
}

/**
 * Request to close a dialog close watcher, for `requestClose()`. `requireHistoryActionActivation` is
 * false there, so `cancel` is always cancelable. The close action closes the dialog with its
 * request close return value.
 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-request-close
 */
function requestCloseDialogCloseWatcher({ dialog }: { dialog: TPolyfillDialog }) {
	if (!hasActiveCloseWatcher({ dialog }) || !isCloseWatcherEnabled({ dialog })) {
		return;
	}
	if (dialog._isRunningCancelAction) {
		return;
	}
	const shouldContinue = runDialogCancelAction({ dialog, canPreventClose: true });
	if (!shouldContinue) {
		return;
	}
	// Close the close watcher. The cancel handler can close or remove the dialog, or turn the
	// close watcher off.
	flushDialogMutations();
	if (!hasActiveCloseWatcher({ dialog }) || !isCloseWatcherEnabled({ dialog })) {
		return;
	}
	unregisterEscapeLayer({ element: dialog });
	dialog.close(dialog._requestCloseReturnValue ?? undefined);
}

/**
 * Dismisses the latest eligible Escape target, allowing application handlers to prevent dismissal.
 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#set-up-the-dialog-close-watcher
 */
function handleDocumentKeydown(event: KeyboardEvent) {
	// A prevented key event must not invoke its default dismissal action.
	if (event.key !== 'Escape' || event.defaultPrevented) {
		return;
	}

	// Defer the default action until application keydown listeners have run.
	setTimeout(() => {
		if (event.defaultPrevented) {
			return;
		}
		// Native close requests select from the layers remaining after keydown.
		flushDialogMutations();
		pruneClosedEscapeLayers();
		const layer = escapeLayers.findLast((candidate) => acceptsEscape({ layer: candidate }));
		if (!layer) {
			return;
		}
		if (layer.type === 'popover') {
			layer.element.hidePopover();
			return;
		}
		// A cancel handler that calls `requestClose()` does not fire `cancel` again.
		if (layer.element._isRunningCancelAction) {
			return;
		}
		const allowed = runDialogCancelAction({ dialog: layer.element, canPreventClose: true });
		// The cancel handler can close or reopen the dialog; only close the original opening.
		if (allowed && escapeLayers.includes(layer) && isEscapeLayerOpen({ layer })) {
			// close() dispatches beforetoggle and queues toggle and close notifications.
			layer.element.close();
		}
	}, 0);
}

const schedulePopoverToggle = createToggleScheduler();

/**
 * Hint stack parent: the auto popover that the first open hint popover is a child of. Hiding it
 * hides every hint popover.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#hint-stack-parent
 */
const hintStackParent: { current: HTMLElement | null } = { current: null };

/**
 * The hide popover algorithm.
 *
 * - It first hides the popovers above this one in its stack (its child popovers), with the same
 *   `focusPreviousElement` and `fireEvents`. Hiding the hint stack parent hides every hint.
 * - `focusPreviousElement` is true for `hidePopover()`, Escape and a `popover` attribute change,
 *   and false for light dismiss, for popovers that another popover or a dialog closes when it
 *   opens, and for removal. When it is true and focus is in the popover, focus returns to the
 *   element that had it before the popover opened. Otherwise focus can stay in the hidden popover
 *   until the focus fixup moves it to the viewport.
 * - `fireEvents` is false only for removal: then no `beforetoggle` fires and no `toggle` is queued.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#hide-popover-algorithm
 */
function hidePopoverElement({
	element,
	focusPreviousElement,
	fireEvents,
}: {
	element: TPolyfillElement;
	focusPreviousElement: boolean;
	fireEvents: boolean;
}) {
	if (!isPopoverOpen({ element })) {
		return;
	}
	// A `beforetoggle` listener that hides the popover again does not fire more events.
	const isNestedHide = Boolean(element._isPopoverHiding);
	element._isPopoverHiding = true;
	const shouldFireEvents = fireEvents && !isNestedHide;
	try {
		// `hidePopoverStackUntil` and this function recurse into each other.
		if (openHintStack.includes(element)) {
			hidePopoverStackUntil({
				stack: openHintStack,
				endpoint: element,
				focusPreviousElement,
				fireEvents: shouldFireEvents,
			});
		}
		if (element === hintStackParent.current) {
			hidePopoverStackUntil({
				stack: openHintStack,
				endpoint: null,
				focusPreviousElement,
				fireEvents: shouldFireEvents,
			});
		}
		if (openAutoStack.includes(element)) {
			hidePopoverStackUntil({
				stack: openAutoStack,
				endpoint: element,
				focusPreviousElement,
				fireEvents: shouldFireEvents,
			});
		}
		// Hiding the child popovers can run listeners that hide this one.
		if (!isPopoverOpen({ element })) {
			return;
		}
		if (shouldFireEvents) {
			fireToggleEvent({
				element,
				type: 'beforetoggle',
				oldState: 'open',
				newState: 'closed',
				cancelable: false,
			});
			if (!isPopoverOpen({ element })) {
				return;
			}
		}
		element.removeAttribute('data-popover-open');
		unregisterEscapeLayer({ element });
		watchedPopovers.delete(element);
		[openAutoStack, openHintStack].forEach((stack) => {
			const stackIndex = stack.indexOf(element);
			if (stackIndex !== -1) {
				stack.splice(stackIndex, 1);
			}
		});
		if (element === hintStackParent.current || openHintStack.length === 0) {
			hintStackParent.current = null;
		}
		if (shouldFireEvents) {
			schedulePopoverToggle({ element, newState: 'closed' });
		}

		const previouslyFocusedElement = element._previouslyFocusedElement ?? null;
		element._previouslyFocusedElement = null;
		if (
			previouslyFocusedElement !== null &&
			focusPreviousElement &&
			isFocusIn({ container: element })
		) {
			focusPreviouslyFocusedElement({ element: previouslyFocusedElement });
		}
		scheduleFocusFixup({ document: element.ownerDocument });
	} finally {
		if (!isNestedHide) {
			element._isPopoverHiding = false;
		}
	}
}

/**
 * Hides, last first, every popover in `stack` after `endpoint` (all of them when `endpoint` is
 * null or not in the stack).
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#hide-popover-stack-until
 */
function hidePopoverStackUntil({
	stack,
	endpoint,
	focusPreviousElement,
	fireEvents,
}: {
	stack: HTMLElement[];
	endpoint: HTMLElement | null;
	focusPreviousElement: boolean;
	fireEvents: boolean;
}) {
	const lastHideIndex =
		endpoint !== null && stack.includes(endpoint) ? stack.indexOf(endpoint) + 1 : 0;
	stack
		.slice(lastHideIndex)
		.reverse()
		.forEach((popover) =>
			hidePopoverElement({ element: popover, focusPreviousElement, fireEvents }),
		);
}

/**
 * Hides the open auto and hint popovers that are not `endpoint` or below it. Dialogs run it when
 * they open, with `endpoint` the topmost popover ancestor of the dialog.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#hide-all-popovers-until
 */
function hidePopoversUntil({ endpoint }: { endpoint: HTMLElement | null }) {
	const isEndpointHint = endpoint !== null && openHintStack.includes(endpoint);
	hidePopoverStackUntil({
		stack: openHintStack,
		endpoint,
		focusPreviousElement: false,
		fireEvents: true,
	});
	hidePopoverStackUntil({
		stack: openAutoStack,
		endpoint: isEndpointHint ? hintStackParent.current : endpoint,
		focusPreviousElement: false,
		fireEvents: true,
	});
}

/**
 * The topmost popover ancestor of an element that is not a popover, such as a dialog: the last
 * open auto or hint popover that it is a flat tree descendant of.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#topmost-popover-ancestor
 */
function getTopmostPopoverAncestor({ element }: { element: Element }): HTMLElement | null {
	return (
		[...openAutoStack, ...openHintStack].findLast(
			(popover) =>
				popover !== element &&
				findInFlatTreeAncestors<true>({
					node: element,
					visit: (candidate) => (candidate === popover ? true : null),
				}) !== null,
		) ?? null
	);
}

popoverRemovingSteps.run = ({ popover }) =>
	hidePopoverElement({ element: popover, focusPreviousElement: false, fireEvents: false });

// Hide every popover in `stack` that is not an ancestor of `target`. With a
// null target, closes the entire stack. Light dismiss and opening a popover do not return focus (`focusPreviousElement` is false).
// Spec: https://html.spec.whatwg.org/multipage/popover.html#hide-all-popovers-until
function hidePopoversInStackNotInChainTo({
	stack,
	target,
}: {
	stack: HTMLElement[];
	target: Node | null;
}) {
	const snapshot = stack.slice().reverse();
	const stopIndex = snapshot.findIndex((popover) => isInChainTo({ candidate: popover, target }));
	const toHide = stopIndex === -1 ? snapshot : snapshot.slice(0, stopIndex);
	toHide.forEach((popover) =>
		hidePopoverElement({ element: popover, focusPreviousElement: false, fireEvents: true }),
	);
}

function handleDocumentPointerdown(event: PointerEvent) {
	flushDialogMutations();
	if (openAutoStack.length === 0 && openHintStack.length === 0) {
		return;
	}
	const target = event.target instanceof Node ? event.target : null;
	pointerdownState.target = nearestOpenPopover({ target });
}

function handleDocumentPointerup(event: PointerEvent) {
	flushDialogMutations();
	if (openAutoStack.length === 0 && openHintStack.length === 0) {
		pointerdownState.target = null;
		return;
	}
	const target = event.target instanceof Node ? event.target : null;
	const ancestor = nearestOpenPopover({ target });
	const sameTarget = ancestor === pointerdownState.target;
	pointerdownState.target = null;
	if (!sameTarget) {
		// User pointerdowned inside a popover and released elsewhere (or vice
		// versa). Treat as a drag and do not dismiss per spec.
		return;
	}
	// Hints are dismissed first (they sit "above" autos for dismissal purposes
	// even though they live in their own stack), then autos. When ancestor is a
	// hint, autos are unaffected; when ancestor is an auto or null, hints close
	// entirely (because no hint is the target's ancestor).
	const ancestorMode = ancestor ? getPopoverMode({ element: ancestor }) : null;
	if (ancestorMode === 'hint') {
		hidePopoversInStackNotInChainTo({ stack: openHintStack, target });
		return;
	}
	hidePopoversInStackNotInChainTo({ stack: openHintStack, target: null });
	hidePopoversInStackNotInChainTo({ stack: openAutoStack, target });
}

if (typeof HTMLElement !== 'undefined') {
	// jsdom throws `SyntaxError` on the `:popover-open` pseudo-class. Answer
	// it from the polyfill's `data-popover-open` source of truth, answer `:modal`, and
	// delegate every other selector to the original implementation.
	// Spec: https://html.spec.whatwg.org/multipage/semantics-other.html#selector-popover-open
	const originalMatches = Element.prototype.matches;
	const matchesMarker = '__topLayerPolyfillMatches';
	// A second copy of the polyfill (for example after `jest.resetModules()`) must not answer
	// `:modal` from its own, empty state: only the first copy patches `matches`.
	if (!(matchesMarker in originalMatches)) {
		// A function expression: oxlint forbids a function declaration in a block.
		const patchedMatches = function patchedMatches(this: Element, selector: string): boolean {
			if (selector === ':popover-open') {
				// A removed popover is hidden at once, as in a browser.
				flushDialogMutations();
				return this.hasAttribute('data-popover-open');
			}
			// jsdom does not support `:modal` either.
			if (selector === ':modal') {
				if (!(this instanceof HTMLDialogElement)) {
					return false;
				}
				flushDialogMutations();
				return this.open && Boolean((this as TPolyfillDialog)._isModal);
			}
			return originalMatches.call(this, selector);
		};
		Object.defineProperty(patchedMatches, matchesMarker, { value: true });
		// The DOM lib types `Element.prototype.matches` as a set of type-predicate
		// overloads. This polyfill intentionally replaces it with a plain boolean
		// implementation, so we cast to the original member type.
		Element.prototype.matches = patchedMatches as typeof Element.prototype.matches;
	}

	// Spec: https://html.spec.whatwg.org/multipage/popover.html#dom-showpopover
	if (!HTMLElement.prototype.showPopover) {
		// Attribute changes hide an open popover synchronously, even when the new state has no popover.
		// Spec: https://html.spec.whatwg.org/multipage/popover.html#the-popover-attribute
		const originalSetAttribute = HTMLElement.prototype.setAttribute;
		HTMLElement.prototype.setAttribute = function setAttribute(name: string, value: string) {
			const mode = getPopoverMode({ element: this });
			originalSetAttribute.call(this, name, value);
			if (name.toLowerCase() === 'popover' && mode !== getPopoverMode({ element: this })) {
				hidePopoverElement({ element: this, focusPreviousElement: true, fireEvents: true });
			}
		};
		const originalRemoveAttribute = HTMLElement.prototype.removeAttribute;
		HTMLElement.prototype.removeAttribute = function removeAttribute(name: string) {
			const mode = getPopoverMode({ element: this });
			originalRemoveAttribute.call(this, name);
			if (name.toLowerCase() === 'popover' && mode !== null) {
				hidePopoverElement({ element: this, focusPreviousElement: true, fireEvents: true });
			}
		};

		HTMLElement.prototype.showPopover = function showPopover(this: HTMLElement) {
			if (!this.hasAttribute('popover')) {
				throw new DOMException(
					`Failed to execute 'showPopover' on 'HTMLElement': ${describeElement({ element: this })} is not a popover element. Ensure the element has a 'popover' attribute (e.g. <div popover>).`,
					'NotSupportedError',
				);
			}
			if (!this.isConnected) {
				throw new DOMException(
					`Failed to execute 'showPopover' on 'HTMLElement': ${describeElement({ element: this })} is not connected to the document. Ensure the element has been added to the DOM (e.g. via render() or document.body.appendChild()) before calling showPopover().`,
					'InvalidStateError',
				);
			}
			flushDialogMutations();
			// No-op: already showing.
			if (isPopoverOpen({ element: this })) {
				return;
			}

			// sync, cancelable on show only
			const allowed = fireToggleEvent({
				element: this,
				type: 'beforetoggle',
				oldState: 'closed',
				newState: 'open',
				cancelable: true,
			});
			if (!allowed) {
				return;
			}

			// Spec-driven dismissal of popovers in other stacks before opening:
			// - opening an `auto`: close all hints; close autos not in the new
			//   popover's ancestor chain.
			// - opening a `hint`:  close hints not in the new popover's chain;
			//   leave autos alone.
			// - opening a `manual`: leave both stacks untouched.
			const mode = getPopoverMode({ element: this });
			if (mode === 'auto') {
				hidePopoversInStackNotInChainTo({ stack: openHintStack, target: null });
				hidePopoversInStackNotInChainTo({ stack: openAutoStack, target: this });
			} else if (mode === 'hint') {
				hidePopoversInStackNotInChainTo({ stack: openHintStack, target: this });
				// A hint that is a child of an open auto popover makes it the hint stack parent.
				const ancestor = [...openAutoStack, ...openHintStack].findLast((candidate) =>
					isInChainTo({ candidate, target: this }),
				);
				if (ancestor && openAutoStack.includes(ancestor)) {
					hintStackParent.current = ancestor;
				}
			}

			// Focus returns on hide only for the first auto or hint popover in a stack.
			// Only connected popovers count, in case the removing steps have not run yet.
			const shouldRestoreFocus =
				(mode === 'auto' || mode === 'hint') &&
				![...openAutoStack, ...openHintStack].some((popover) => popover.isConnected);
			(this as TPolyfillElement)._previouslyFocusedElement = null;
			const originallyFocusedElement = getFocusedElement({ document: this.ownerDocument });

			this.setAttribute('data-popover-open', '');
			watchPopoverForRemoval({ popover: this });
			const stack = stackForMode({ mode });
			if (stack && !stack.includes(this)) {
				stack.push(this);
				registerEscapeLayer({ layer: { type: 'popover', element: this } });
			}
			runPopoverFocusingSteps({ popover: this });
			if (shouldRestoreFocus && this.hasAttribute('popover')) {
				(this as TPolyfillElement)._previouslyFocusedElement = originallyFocusedElement;
			}
			clearOpacityOnOpenToggle({ element: this });
			schedulePopoverToggle({ element: this, newState: 'open' });
		};
	}

	// Spec: https://html.spec.whatwg.org/multipage/popover.html#dom-hidepopover
	if (!HTMLElement.prototype.hidePopover) {
		HTMLElement.prototype.hidePopover = function hidePopover(this: HTMLElement) {
			if (!this.hasAttribute('popover')) {
				throw new DOMException(
					`Failed to execute 'hidePopover' on 'HTMLElement': ${describeElement({ element: this })} is not a popover element. Ensure the element has a 'popover' attribute (e.g. <div popover>).`,
					'NotSupportedError',
				);
			}
			flushDialogMutations();
			hidePopoverElement({ element: this, focusPreviousElement: true, fireEvents: true });
		};
	}

	// Spec: https://html.spec.whatwg.org/multipage/popover.html#dom-togglepopover
	if (!HTMLElement.prototype.togglePopover) {
		HTMLElement.prototype.togglePopover = function togglePopover(
			this: HTMLElement,
			force?: boolean,
		) {
			const wasOpen = isPopoverOpen({ element: this });

			if (typeof force === 'boolean') {
				if (force && !wasOpen) {
					this.showPopover();
				} else if (!force && wasOpen) {
					this.hidePopover();
				}
			} else if (wasOpen) {
				this.hidePopover();
			} else {
				this.showPopover();
			}

			// Return the actual resulting state, which differs from `force` when
			// `beforetoggle` was preventDefaulted on show.
			return isPopoverOpen({ element: this });
		};
	}

	// Document-level light-dismiss for `popover="auto"` and `popover="hint"`.
	// Spec uses pointerdown + pointerup with same-target check; we also wire
	// `mousedown` + `mouseup` because jsdom does not fire pointer events for
	// fireEvent.click() / userEvent.click() in older jsdom versions.
	type TLightDismissDoc = Document & { __atTopLayerLightDismiss?: boolean };
	if (typeof document !== 'undefined' && !(document as TLightDismissDoc).__atTopLayerLightDismiss) {
		(document as TLightDismissDoc).__atTopLayerLightDismiss = true;

		// capture phase so application handlers cannot stop propagation before us
		const pointerdownAdapter = (event: Event) => handleDocumentPointerdown(event as PointerEvent);
		const pointerupAdapter = (event: Event) => handleDocumentPointerup(event as PointerEvent);

		bind(document, {
			type: 'pointerdown',
			listener: pointerdownAdapter,
			options: { capture: true },
		});
		bind(document, {
			type: 'pointerup',
			listener: pointerupAdapter,
			options: { capture: true },
		});
		// Fallback for environments / fireEvent paths that fire mouse events
		// only. The same handlers work for MouseEvent because we only read
		// `target`. PointerEvent extends MouseEvent so the runtime cast is safe.
		bind(document, {
			type: 'mousedown',
			listener: pointerdownAdapter,
			options: { capture: true },
		});
		bind(document, {
			type: 'mouseup',
			listener: pointerupAdapter,
			options: { capture: true },
		});
		bind(document, {
			type: 'keydown',
			listener: handleDocumentKeydown,
			options: { capture: true },
		});
	}
}

// HTMLDialogElement
// Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element

if (typeof HTMLDialogElement !== 'undefined') {
	const proto = HTMLDialogElement.prototype as TPolyfillDialog & { _returnValue?: string };

	const scheduleDialogToggle = createDialogToggleScheduler();
	const isShowModalPolyfilled = typeof proto.showModal !== 'function';

	if (isShowModalPolyfilled) {
		proto.showModal = function showModal(this: TPolyfillDialog) {
			flushDialogMutations();
			if (!this.isConnected) {
				throw new DOMException(
					`Failed to execute 'showModal' on 'HTMLDialogElement': ${describeElement({ element: this })} is not connected to the document. Ensure the element has been added to the DOM (e.g. via render() or document.body.appendChild()) before calling showModal().`,
					'InvalidStateError',
				);
			}
			if (this.hasAttribute('open')) {
				// No-op: already modal.
				if (this._isModal) {
					return;
				}
				throw new DOMException(
					`Failed to execute 'showModal' on 'HTMLDialogElement': ${describeElement({ element: this })} already has an 'open' attribute, and therefore cannot be opened modally. The dialog was likely opened non-modally with .show(). Call .close() first, then .showModal().`,
					'InvalidStateError',
				);
			}

			// Cancelable: `preventDefault()` stops the dialog opening.
			const allowed = fireToggleEvent({
				element: this,
				type: 'beforetoggle',
				oldState: 'closed',
				newState: 'open',
				cancelable: true,
			});
			// A beforetoggle listener can open or remove the dialog.
			if (!allowed || this.hasAttribute('open') || !this.isConnected) {
				return;
			}

			this.setAttribute('open', '');
			this._isModal = true;
			// The document is now blocked by this dialog: everything outside it is inert.
			removeModalDialog({ dialog: this });
			modalDialogs.push(this);
			registerEscapeLayer({ layer: { type: 'dialog', element: this } });
			watchDialogForRemoval({ dialog: this });
			// The open toggle is queued before the popovers below close, as in a browser.
			scheduleDialogToggle({ dialog: this, newState: 'open', shouldFireCloseEvent: false });
			this._previouslyFocusedElement = getFocusedElement({ document: this.ownerDocument });
			// Open auto and hint popovers that the dialog is not in close.
			hidePopoversUntil({ endpoint: getTopmostPopoverAncestor({ element: this }) });
			runDialogFocusingSteps({ dialog: this });
			// When focus could not move into the dialog (for example, it is `inert`), the focused
			// element outside it is now inert. Chrome moves focus to the viewport at once.
			const focusedElement = getFocusedElement({ document: this.ownerDocument });
			if (isFocusableElementType(focusedElement) && isInert({ node: focusedElement })) {
				blurElement({ element: focusedElement });
			}
		};
	}

	// Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-show
	if (typeof proto.show !== 'function') {
		proto.show = function show(this: TPolyfillDialog) {
			flushDialogMutations();
			if (this.hasAttribute('open')) {
				// No-op: already open non-modally.
				if (!this._isModal) {
					return;
				}
				throw new DOMException(
					`Failed to execute 'show' on 'HTMLDialogElement': ${describeElement({ element: this })} is already open as a modal dialog, and therefore cannot be opened as a non-modal dialog. Call .close() first, then .show().`,
					'InvalidStateError',
				);
			}
			// No connection check: like a browser, `show()` opens a disconnected dialog too.

			// Cancelable: `preventDefault()` stops the dialog opening.
			const allowed = fireToggleEvent({
				element: this,
				type: 'beforetoggle',
				oldState: 'closed',
				newState: 'open',
				cancelable: true,
			});
			// A beforetoggle listener can open the dialog.
			if (!allowed || this.hasAttribute('open')) {
				return;
			}

			this.setAttribute('open', '');
			this._isModal = false;
			// Non-modal dialogs can opt into Escape through closedby.
			registerEscapeLayer({ layer: { type: 'dialog', element: this } });
			watchDialogForRemoval({ dialog: this });
			scheduleDialogToggle({ dialog: this, newState: 'open', shouldFireCloseEvent: false });
			this._previouslyFocusedElement = getFocusedElement({ document: this.ownerDocument });
			// Open auto and hint popovers that the dialog is not in close.
			hidePopoversUntil({ endpoint: getTopmostPopoverAncestor({ element: this }) });
			runDialogFocusingSteps({ dialog: this });
		};
	}

	if (typeof proto.close !== 'function') {
		proto.close = function close(this: TPolyfillDialog, returnValue?: string) {
			flushDialogMutations();
			// No-op: already closed.
			if (!this.hasAttribute('open')) {
				return;
			}

			// Sync beforetoggle (not cancelable); matches browser behavior.
			fireToggleEvent({
				element: this,
				type: 'beforetoggle',
				oldState: 'open',
				newState: 'closed',
				cancelable: false,
			});
			// A beforetoggle listener can close the dialog.
			if (!this.hasAttribute('open')) {
				return;
			}
			// A beforetoggle listener can also remove the dialog, which makes it non-modal.
			flushDialogMutations();

			this.removeAttribute('open');
			unregisterEscapeLayer({ element: this });
			stopWatchingDialog({ dialog: this });
			const wasModal = Boolean(this._isModal);
			this._isModal = false;
			removeModalDialog({ dialog: this });
			if (returnValue !== undefined) {
				this.returnValue = returnValue;
			}
			this._requestCloseReturnValue = null;
			restoreFocusOnClose({ dialog: this, wasModal });
			scheduleFocusFixup({ document: this.ownerDocument });
			scheduleDialogToggle({ dialog: this, newState: 'closed', shouldFireCloseEvent: true });
		};
	}

	/**
	 * Acts as a close request: fires a cancelable `cancel` event, then closes the dialog with
	 * `returnValue` unless the event was canceled. It force-enables the close watcher, so it works
	 * with `closedby="none"` too. Installed only where the polyfill also provides `showModal()`,
	 * because it reads the polyfill dialog state.
	 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-requestclose
	 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#dialog-request-close
	 */
	if (typeof proto.requestClose !== 'function' && isShowModalPolyfilled) {
		proto.requestClose = function requestClose(this: TPolyfillDialog, returnValue?: string) {
			flushDialogMutations();
			if (!this.hasAttribute('open') || !this.isConnected) {
				return;
			}
			this._enableCloseWatcherForRequestClose = true;
			this._requestCloseReturnValue = returnValue === undefined ? null : String(returnValue);
			requestCloseDialogCloseWatcher({ dialog: this });
			this._enableCloseWatcherForRequestClose = false;
		};
	}

	// `closedBy` reflects the `closedby` attribute; the getter returns the computed state.
	// Configurable, so a test can delete it to model a browser without `closedby`.
	// Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-closedby
	if (!('closedBy' in proto)) {
		Object.defineProperty(proto, 'closedBy', {
			get(this: TPolyfillDialog) {
				return getComputedClosedBy({ dialog: this });
			},
			set(this: HTMLDialogElement, value: unknown) {
				this.setAttribute('closedby', String(value));
			},
			configurable: true,
			enumerable: true,
		});
	}

	if (!('returnValue' in proto)) {
		Object.defineProperty(proto, 'returnValue', {
			get(this: { _returnValue?: string }) {
				return this._returnValue === undefined ? '' : this._returnValue;
			},
			set(this: { _returnValue?: string }, value: unknown) {
				this._returnValue = String(value);
			},
			configurable: true,
			enumerable: true,
		});
	}
}
