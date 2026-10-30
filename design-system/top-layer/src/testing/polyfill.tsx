// Node supports findLast, but the package defaults to older array type declarations.
/// <reference lib="es2023.array" />
/* eslint-disable compat/compat */
/**
 * Popover API & HTMLDialogElement polyfills for jsdom.
 *
 * jsdom does not implement the Popover API or the HTMLDialogElement methods
 * (showModal, show, close). This polyfill implements them as a browser does,
 * including the event timing, which is checked against Chromium with Playwright.
 *
 * Behaviour:
 *  - beforetoggle: synchronous. Cancelable only on popover show and dialog show/showModal.
 *    toggle: a later task, never cancelable.
 *  - Rapid show/hide coalesces into one toggle event (first oldState to last newState).
 *  - Dialog: showModal/show fire beforetoggle, then toggle. close fires beforetoggle, then toggle,
 *    then the close event.
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
 *  - The popover open state is the `data-popover-open` attribute (jsdom has no `:popover-open`).
 *  - Auto and hint popovers: each mode has an open stack. A press (pointer or mouse down and up)
 *    outside the open chain light-dismisses them, and Escape dismisses the topmost one.
 *  - Escape: the dismissal is the keydown's default action. It runs when `dispatchEvent()`
 *    returns, after every keydown listener, unless one called `preventDefault()`. So the layer is
 *    closed (and a dialog's `cancel` has fired) right after `fireEvent.keyDown()`, as in a browser,
 *    where it runs in the same task. `toggle` and `close` are still later tasks. Unlike Chromium
 *    and Firefox, it also runs for untrusted events, so that tests can send Escape.
 *  - When the open `toggle` fires, removes the inline `opacity` of the popover (the JavaScript
 *    positioning fallback sets `opacity: 0`). So the fallback's `ResizeObserver` reveal is not
 *    needed in jsdom, where its non-zero layout check can never pass.
 *
 * The companion `toBeVisible` patch is in `./to-be-visible`.
 *
 * Importing this module patches the prototypes as a side effect. It is safe to import more than
 * once: each patch is guarded, so it does not replace a native implementation or patch twice.
 */

import { bind } from 'bind-event-listener';

type TToggleState = 'open' | 'closed';

// Describes an element for error messages, for example `<div#my-id.class-a.class-b>`.
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
		// The package DOM types do not have `ToggleEvent`, so cast it to a constructor type.
		const ToggleEventConstructor = (
			globalThis as { ToggleEvent: new (type: string, init: object) => Event }
		).ToggleEvent;
		return new ToggleEventConstructor(type, { oldState, newState, cancelable, bubbles: false });
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

/**
 * Coalesces rapid show/hide into one `toggle` event per element. The event is a task
 * (`setTimeout`), not a microtask, so it fires after microtasks drain, as in a browser.
 */
function createToggleScheduler(): (args: { element: Element; newState: TToggleState }) => void {
	const pendingToggles = new Map<Element, { oldState: TToggleState; newState: TToggleState }>();
	return function schedule({ element, newState }) {
		const pendingToggle = pendingToggles.get(element);
		if (pendingToggle) {
			// Coalesce: keep the first oldState, update newState.
			pendingToggles.set(element, { oldState: pendingToggle.oldState, newState });
			return;
		}

		pendingToggles.set(element, { oldState: oppositeState({ state: newState }), newState });

		setTimeout(() => {
			const toggle = pendingToggles.get(element);
			if (!toggle) {
				return;
			}
			pendingToggles.delete(element);
			fireToggleEvent({
				element,
				type: 'toggle',
				oldState: toggle.oldState,
				newState: toggle.newState,
				cancelable: false,
			});
		}, 0);
	};
}

// Like `createToggleScheduler`, and can also fire `close` as a separate task after `toggle`.
function createDialogToggleScheduler(): (args: {
	dialog: HTMLDialogElement;
	newState: TToggleState;
	shouldFireCloseEvent: boolean;
}) => void {
	const pendingToggles = new Map<
		HTMLDialogElement,
		{ oldState: TToggleState; newState: TToggleState; shouldFireCloseEvent: boolean }
	>();
	return function schedule({ dialog, newState, shouldFireCloseEvent }) {
		const pendingToggle = pendingToggles.get(dialog);
		if (pendingToggle) {
			// Coalesce: keep the first oldState, and fire `close` if any request asked for it.
			pendingToggles.set(dialog, {
				oldState: pendingToggle.oldState,
				newState,
				shouldFireCloseEvent: pendingToggle.shouldFireCloseEvent || shouldFireCloseEvent,
			});
			return;
		}

		pendingToggles.set(dialog, {
			oldState: oppositeState({ state: newState }),
			newState,
			shouldFireCloseEvent,
		});

		// A browser fires `toggle` as a task, not synchronously or as a microtask.
		setTimeout(() => {
			const toggle = pendingToggles.get(dialog);
			if (!toggle) {
				return;
			}
			pendingToggles.delete(dialog);
			fireToggleEvent({
				element: dialog,
				type: 'toggle',
				oldState: toggle.oldState,
				newState: toggle.newState,
				cancelable: false,
			});

			if (toggle.shouldFireCloseEvent) {
				// A browser fires `close` as a separate task after `toggle`.
				setTimeout(() => {
					dialog.dispatchEvent(new Event('close', { bubbles: false, cancelable: false }));
				}, 0);
			}
		}, 0);
	};
}

// Popover API
// Spec: https://html.spec.whatwg.org/multipage/popover.html

/**
 * The `popover` attribute states. Values are case-insensitive. An empty value or `auto` is
 * `auto`, and an unknown value is `manual`.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#attr-popover
 */
type TPopoverMode = 'auto' | 'hint' | 'manual';

function getPopoverMode({ element }: { element: HTMLElement }): TPopoverMode | null {
	if (!element.hasAttribute('popover')) {
		return null;
	}
	const value = element.getAttribute('popover')?.toLowerCase();
	if (!value || value === 'auto') {
		return 'auto';
	}
	if (value === 'hint') {
		return 'hint';
	}
	return 'manual';
}

/**
 * The `popover` IDL property reflects the `popover` attribute. The setter writes the value as
 * is. The getter returns the mode, so an unknown value reads back as `manual`, but the attribute
 * keeps the original string.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#dom-popover
 */
type TPopoverPropertyValue = TPopoverMode | null;
if (
	typeof HTMLElement !== 'undefined' &&
	!Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'popover')
) {
	Object.defineProperty(HTMLElement.prototype, 'popover', {
		configurable: true,
		enumerable: true,
		get(this: HTMLElement): TPopoverPropertyValue {
			return getPopoverMode({ element: this });
		},
		set(this: HTMLElement, value: TPopoverPropertyValue) {
			if (value === null) {
				this.removeAttribute('popover');
				return;
			}
			this.setAttribute('popover', String(value));
		},
	});
}

/**
 * The open auto popovers, in the order they opened.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#showing-auto-popover-list
 */
const openAutoStack: HTMLElement[] = [];

/**
 * The open hint popovers, in the order they opened. A hint popover closes other hint popovers,
 * an auto popover closes all hint popovers, and a hint popover never closes an auto popover.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#showing-hint-popover-list
 */
const openHintStack: HTMLElement[] = [];

function isPopoverOpen({ element }: { element: HTMLElement }): boolean {
	return element.hasAttribute('data-popover-open');
}

// The open stack for a popover mode. Manual popovers have no stack.
function getStackForMode({ mode }: { mode: TPopoverMode | null }): HTMLElement[] | null {
	if (mode === 'auto') {
		return openAutoStack;
	}
	if (mode === 'hint') {
		return openHintStack;
	}
	return null;
}

/**
 * Polyfill only. A browser reveals the popover on the first non-zero layout that its
 * `ResizeObserver` reports. jsdom always reports 0, so that check never passes, and the polyfill
 * clears the inline `opacity: 0` on the open `toggle` instead.
 */
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

// Walks the inclusive ancestors of `node` once each. Returns the first non-null `visit` result.
function findInInclusiveAncestors<T>({
	node,
	visit,
}: {
	node: Node | null;
	visit: ({ node }: { node: Node }) => T | null;
}): T | null {
	const seen = new Set<Node>();
	function step(current: Node | null): T | null {
		if (!current || seen.has(current)) {
			return null;
		}
		seen.add(current);
		const result = visit({ node: current });
		if (result !== null) {
			return result;
		}
		return step(current.parentNode);
	}
	return step(node);
}

/**
 * Finds the invoker of a popover: an element with `popovertarget="<popover id>"`.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#popover-target-element
 */
function findInvokerForPopover({ popover }: { popover: HTMLElement }): HTMLElement | null {
	if (!popover.id || !popover.ownerDocument) {
		return null;
	}
	const escapedId = (typeof CSS !== 'undefined' && CSS.escape ? CSS.escape : String)(popover.id);
	const selector = `[popovertarget="${escapedId}"]`;
	return popover.ownerDocument.querySelector<HTMLElement>(selector);
}

/**
 * Whether `candidate` is reachable from `start` through inclusive ancestors and invokers. At an
 * invoker, the walk also continues from the popover that it references.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#topmost-popover-ancestor
 */
function reachesViaAncestryOrInvoker({
	start,
	candidate,
}: {
	start: Node;
	candidate: HTMLElement;
}): boolean {
	const found = findInInclusiveAncestors<true>({
		node: start,
		visit: ({ node }) => {
			if (node === candidate) {
				return true;
			}
			// Continue in the ancestors of the invoked popover when this node is an invoker.
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

/**
 * Whether `candidate` is in the popover chain to `target`. The chain is the DOM ancestors plus
 * invokers (elements whose `popovertarget` references a popover). So when a button in popover A
 * opens popover B, A is an ancestor of B and stays open.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#topmost-popover-ancestor
 */
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
	// When `target` is a popover, also walk the chain of its invoker, which can be anywhere in the
	// DOM.
	if (target instanceof HTMLElement && target.hasAttribute('popover')) {
		const invoker = findInvokerForPopover({ popover: target });
		if (invoker && reachesViaAncestryOrInvoker({ start: invoker, candidate })) {
			return true;
		}
	}
	return false;
}

/**
 * The popover pointerdown target. Light dismiss has two steps: `pointerdown` stores the nearest
 * open popover of its target here. `pointerup` light-dismisses only when its target has the same
 * nearest open popover, so a drag out of or into a popover does not dismiss.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#light-dismiss-open-popovers
 */
const popoverPointerdownTarget: { current: HTMLElement | null } = { current: null };

/**
 * If `node` is an invoker of an open popover, returns that popover.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#popover-target-element
 */
function getInvokedOpenPopover({ node }: { node: Node }): HTMLElement | null {
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

/**
 * The nearest open popover of `target`: its first inclusive ancestor that is an open popover or
 * invokes one. For an invoker, it is the invoked popover.
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#nearest-inclusive-open-popover
 */
function getNearestOpenPopover({ target }: { target: Node | null }): HTMLElement | null {
	return findInInclusiveAncestors({
		node: target,
		visit: ({ node }) => {
			if (node instanceof HTMLElement && isPopoverOpen({ element: node })) {
				return node;
			}
			return getInvokedOpenPopover({ node });
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

// Polyfill state on an element.
type TPolyfillElement = HTMLElement & {
	/**
	 * The "previously focused element", set by `show()`, `showModal()` and `showPopover()`.
	 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#previously-focused-element
	 */
	_previouslyFocusedElement?: Element | null;
	/**
	 * True while the hide popover algorithm runs for this popover.
	 * Spec: https://html.spec.whatwg.org/multipage/popover.html#popover-hiding
	 */
	_isPopoverHiding?: boolean;
};

// Polyfill state on a `<dialog>`.
type TPolyfillDialog = HTMLDialogElement &
	TPolyfillElement & {
		/**
		 * The "is modal" flag.
		 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#is-modal
		 */
		_isModal?: boolean;
		// The request close return value, set by `requestClose()`.
		_requestCloseReturnValue?: string | null;
		/**
		 * The "enable close watcher for requestClose()" flag.
		 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#enable-close-watcher-for-requestclose()
		 */
		_enableCloseWatcherForRequestClose?: boolean;
		/**
		 * The "is running cancel action" flag of the dialog close watcher.
		 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-is-running-cancel-action
		 */
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
 * One opening of a dialog or popover. Each opening is a new object, so an Escape cannot close a
 * later opening of the same element (for example, one that a `cancel` listener opens).
 */
type TEscapeLayer =
	| { type: 'popover'; element: HTMLElement }
	| { type: 'dialog'; element: TPolyfillDialog };

// The dialog and popover Escape targets, in the order they opened.
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
 * Whether the element of a layer is still connected and open. It reads the DOM, so it also sees
 * direct attribute changes.
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
 * **Removing and insertion steps**
 *
 * jsdom has no hook that runs when a node leaves or joins the document. The polyfill watches open
 * dialogs with a `MutationObserver`, and calls `takeRecords()` before it reads dialog or popover
 * state, so the steps take effect at once, as in a browser.
 *
 * A removed dialog that keeps `open` stays watched until it closes, so inserting it again, even in
 * a later task, runs the insertion steps. The polyfill sees an insertion into the document, or
 * into a shadow root that held the dialog when it opened.
 *
 * Open popovers are watched the same way, for the popover removing steps.
 */
const watchedDialogs = new Set<TPolyfillDialog>();
const watchedPopovers = new Set<HTMLElement>();
const removalObserver: { current: MutationObserver | null } = { current: null };

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
		removalObserver.current?.disconnect();
		removalObserver.current = null;
	}
}

function stopWatchingDialog({ dialog }: { dialog: TPolyfillDialog }) {
	watchedDialogs.delete(dialog);
	disconnectRemovalObserverWhenIdle();
}

function processRemovalRecords({ records }: { records: MutationRecord[] }) {
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
	// A removed dialog that keeps `open` stays watched, for the insertion steps.
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
function flushRemovalObserver() {
	const observer = removalObserver.current;
	if (!observer) {
		return;
	}
	processRemovalRecords({ records: observer.takeRecords() });
}

// A `MutationObserver` does not see into shadow trees, so observe each root that holds the node.
function observeRootsOf({ observer, node }: { observer: MutationObserver; node: Node }) {
	const root = node.getRootNode();
	observer.observe(root, { childList: true, subtree: true });
	if (root instanceof ShadowRoot) {
		observeRootsOf({ observer, node: root.host });
	}
}

function getRemovalObserver(): MutationObserver {
	const observer =
		removalObserver.current ??
		new MutationObserver((records) => processRemovalRecords({ records }));
	removalObserver.current = observer;
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
	flushRemovalObserver();
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
	visit: ({ candidate }: { candidate: Node }) => T | null;
}): T | null {
	if (!node) {
		return null;
	}
	const result = visit({ candidate: node });
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
	flushRemovalObserver();
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
		visit: ({ candidate }) => {
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
function isHiddenByUserAgentStyles({
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
	const hiddenInclusiveAncestor = findInFlatTreeAncestors<Element>({
		node: element,
		visit: ({ candidate }) => {
			if (
				candidate instanceof Element &&
				isHiddenByUserAgentStyles({ candidate, isSelf: candidate === element })
			) {
				return candidate;
			}
			return null;
		},
	});
	return hiddenInclusiveAncestor === null;
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

/**
 * Focuses the element if a browser would, and jsdom treats it as focusable. Returns whether it
 * took focus.
 */
function tryFocus({ element }: { element: TFocusableElement }): boolean {
	// A disconnected element is not a focusable area. jsdom still focuses an SVG `<a href>` there.
	if (!element.isConnected || isFocusBlocked({ element })) {
		return false;
	}
	element.focus();
	return getFocusedElement({ document: element.ownerDocument }) === element;
}

/**
 * Walks the HTML, SVG and MathML descendants of `root` in tree order (not into shadow trees), and
 * stops at the first one for which `visit` returns true. Returns whether `visit` returned true.
 */
function someDescendant({
	root,
	visit,
}: {
	root: HTMLElement | ShadowRoot;
	visit: ({ element }: { element: TFocusableElement }) => boolean;
}): boolean {
	const ownerDocument = root instanceof ShadowRoot ? root.host.ownerDocument : root.ownerDocument;
	const walker = ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
	let node = walker.nextNode();
	while (node) {
		if (isFocusableElementType(node as Element) && visit({ element: node as TFocusableElement })) {
			return true;
		}
		node = walker.nextNode();
	}
	return false;
}

/**
 * Focuses the focusable area of an element that is not itself a focusable area, and returns
 * whether it took focus. Only the shadow host case is modelled: a host whose shadow root delegates
 * focus gives its focus delegate. jsdom does not implement `delegatesFocus`, so this applies only
 * where the environment reports it.
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
		visit: ({ element }) =>
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
		visit: ({ element }) => {
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
	const previouslyFocusedElement = dialog._previouslyFocusedElement ?? null;
	dialog._previouslyFocusedElement = null;
	if (previouslyFocusedElement === null) {
		return;
	}
	if (wasModal || isFocusIn({ container: dialog })) {
		focusPreviouslyFocusedElement({ element: previouslyFocusedElement });
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
	flushRemovalObserver();
	if (!hasActiveCloseWatcher({ dialog }) || !isCloseWatcherEnabled({ dialog })) {
		return;
	}
	unregisterEscapeLayer({ element: dialog });
	dialog.close(dialog._requestCloseReturnValue ?? undefined);
}

/**
 * Escape `keydown` events that passed through the document and wait for their default action.
 */
const pendingEscapeKeydowns = new WeakSet<Event>();

/**
 * Records an Escape `keydown` as it passes through the document. Its default action runs when
 * dispatch returns, after every listener (see the `dispatchEvent` patch below).
 */
function handleDocumentKeydown(event: KeyboardEvent) {
	// A prevented key event must not invoke its default dismissal action.
	if (event.key !== 'Escape' || event.defaultPrevented) {
		return;
	}
	pendingEscapeKeydowns.add(event);
}

/**
 * The Escape default action: dismisses the latest eligible Escape target, unless a keydown
 * listener prevented it. As in a browser, it runs in the same task as the keydown, after the
 * dispatch, so the layer is closed before the code that dispatched the event continues. The
 * `toggle` event is still a later task.
 *
 * Unlike a browser, it also runs for untrusted events (`fireEvent`, `dispatchEvent()`), so that
 * tests can send Escape. Chromium and Firefox ignore an untrusted Escape.
 * Spec: https://html.spec.whatwg.org/multipage/interaction.html#close-requests
 * Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#set-the-dialog-close-watcher
 */
function runEscapeDefaultAction(event: Event) {
	if (!pendingEscapeKeydowns.has(event)) {
		return;
	}
	pendingEscapeKeydowns.delete(event);
	if (event.defaultPrevented) {
		return;
	}
	// Native close requests select from the layers remaining after keydown.
	flushRemovalObserver();
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
	const shouldContinue = runDialogCancelAction({ dialog: layer.element, canPreventClose: true });
	// The cancel handler can close or reopen the dialog. Only close the original opening.
	if (shouldContinue && escapeLayers.includes(layer) && isEscapeLayerOpen({ layer })) {
		// close() dispatches beforetoggle and queues toggle and close notifications.
		layer.element.close();
	}
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
					visit: ({ candidate }) => (candidate === popover ? true : null),
				}) !== null,
		) ?? null
	);
}

popoverRemovingSteps.run = ({ popover }) =>
	hidePopoverElement({ element: popover, focusPreviousElement: false, fireEvents: false });

/**
 * Hides, top first, the popovers in `stack` that are above the topmost one in the chain to
 * `target`. With a null target, hides the whole stack. Light dismiss and opening a popover use
 * it, so focus does not return (`focusPreviousElement` is false).
 * Spec: https://html.spec.whatwg.org/multipage/popover.html#hide-all-popovers-until
 */
function hidePopoversInStackNotInChainTo({
	stack,
	target,
}: {
	stack: HTMLElement[];
	target: Node | null;
}) {
	const topFirstStack = stack.slice().reverse();
	const chainIndex = topFirstStack.findIndex((popover) =>
		isInChainTo({ candidate: popover, target }),
	);
	const popoversToHide = chainIndex === -1 ? topFirstStack : topFirstStack.slice(0, chainIndex);
	popoversToHide.forEach((popover) =>
		hidePopoverElement({ element: popover, focusPreviousElement: false, fireEvents: true }),
	);
}

function handleDocumentPointerdown(event: PointerEvent) {
	flushRemovalObserver();
	if (openAutoStack.length === 0 && openHintStack.length === 0) {
		return;
	}
	const target = event.target instanceof Node ? event.target : null;
	popoverPointerdownTarget.current = getNearestOpenPopover({ target });
}

function handleDocumentPointerup(event: PointerEvent) {
	flushRemovalObserver();
	if (openAutoStack.length === 0 && openHintStack.length === 0) {
		popoverPointerdownTarget.current = null;
		return;
	}
	const target = event.target instanceof Node ? event.target : null;
	const ancestor = getNearestOpenPopover({ target });
	const sameTarget = ancestor === popoverPointerdownTarget.current;
	popoverPointerdownTarget.current = null;
	if (!sameTarget) {
		// The press started and ended with different nearest open popovers: it is a drag. As in the
		// spec, a drag does not dismiss.
		return;
	}
	// Hint popovers are dismissed first (for dismissal they are above auto popovers, but they have
	// their own stack), then auto popovers. When `ancestor` is a hint popover, auto popovers stay
	// open. When `ancestor` is an auto popover or null, every hint popover closes, because no hint
	// popover is an ancestor of the target.
	const ancestorMode = ancestor ? getPopoverMode({ element: ancestor }) : null;
	if (ancestorMode === 'hint') {
		hidePopoversInStackNotInChainTo({ stack: openHintStack, target });
		return;
	}
	hidePopoversInStackNotInChainTo({ stack: openHintStack, target: null });
	hidePopoversInStackNotInChainTo({ stack: openAutoStack, target });
}

if (typeof HTMLElement !== 'undefined') {
	// jsdom throws `SyntaxError` on `:popover-open`. The patch answers it from the
	// `data-popover-open` attribute, answers `:modal`, and passes every other selector to jsdom.
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
				flushRemovalObserver();
				return this.hasAttribute('data-popover-open');
			}
			// jsdom does not support `:modal` either.
			if (selector === ':modal') {
				if (!(this instanceof HTMLDialogElement)) {
					return false;
				}
				flushRemovalObserver();
				return this.open && Boolean((this as TPolyfillDialog)._isModal);
			}
			return originalMatches.call(this, selector);
		};
		Object.defineProperty(patchedMatches, matchesMarker, { value: true });
		// The DOM types give `Element.prototype.matches` type predicate overloads. The patch
		// returns a plain boolean, so cast it to the original member type.
		Element.prototype.matches = patchedMatches as typeof Element.prototype.matches;
	}

	if (!HTMLElement.prototype.showPopover) {
		// Changing or removing the `popover` attribute hides an open popover synchronously.
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

		// Spec: https://html.spec.whatwg.org/multipage/popover.html#dom-showpopover
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
			flushRemovalObserver();
			// No-op: already showing.
			if (isPopoverOpen({ element: this })) {
				return;
			}

			// `beforetoggle` is synchronous. It is cancelable only on show.
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

			// Before the popover opens, it closes other popovers, as in the spec:
			// - `auto`: close every hint popover, and the auto popovers that are not in its chain.
			// - `hint`: close the hint popovers that are not in its chain. Auto popovers stay open.
			// - `manual`: close nothing.
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
			const stack = getStackForMode({ mode });
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
			flushRemovalObserver();
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

			// Return the resulting state. It differs from `force` when a `beforetoggle` listener
			// prevented the show.
			return isPopoverOpen({ element: this });
		};
	}

	// Light dismiss for `popover="auto"` and `popover="hint"`, on the document. The spec uses
	// `pointerdown` and `pointerup` with a same target check. The polyfill also listens for
	// `mousedown` and `mouseup`, because some test tools fire only mouse events.
	type TLightDismissDocument = Document & { __atTopLayerLightDismiss?: boolean };
	if (
		typeof document !== 'undefined' &&
		!(document as TLightDismissDocument).__atTopLayerLightDismiss
	) {
		(document as TLightDismissDocument).__atTopLayerLightDismiss = true;

		// The capture phase, so that an application listener cannot stop propagation first.
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
		// For tests that fire only mouse events. The handlers read only `target`, so a
		// `MouseEvent` works too (`PointerEvent` extends `MouseEvent`).
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

		// Runs the Escape default action when the keydown dispatch returns. A listener cannot
		// stand in for it: one that calls `stopPropagation()`, or one added later, would run after
		// it or stop it.
		const originalDispatchEvent = EventTarget.prototype.dispatchEvent;
		EventTarget.prototype.dispatchEvent = function dispatchEvent(this: EventTarget, event: Event) {
			const result = originalDispatchEvent.call(this, event);
			runEscapeDefaultAction(event);
			return result;
		};
	}
}

// HTMLDialogElement
// Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element

if (typeof HTMLDialogElement !== 'undefined') {
	const dialogPrototype = HTMLDialogElement.prototype as TPolyfillDialog & {
		_returnValue?: string;
	};

	const scheduleDialogToggle = createDialogToggleScheduler();
	const isShowModalPolyfilled = typeof dialogPrototype.showModal !== 'function';

	// Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-showmodal
	if (isShowModalPolyfilled) {
		dialogPrototype.showModal = function showModal(this: TPolyfillDialog) {
			flushRemovalObserver();
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
	if (typeof dialogPrototype.show !== 'function') {
		dialogPrototype.show = function show(this: TPolyfillDialog) {
			flushRemovalObserver();
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

	// Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-close
	if (typeof dialogPrototype.close !== 'function') {
		dialogPrototype.close = function close(this: TPolyfillDialog, returnValue?: string) {
			flushRemovalObserver();
			// No-op: already closed.
			if (!this.hasAttribute('open')) {
				return;
			}

			// Synchronous and not cancelable, as in a browser.
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
			flushRemovalObserver();

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
	if (typeof dialogPrototype.requestClose !== 'function' && isShowModalPolyfilled) {
		dialogPrototype.requestClose = function requestClose(
			this: TPolyfillDialog,
			returnValue?: string,
		) {
			flushRemovalObserver();
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
	if (!('closedBy' in dialogPrototype)) {
		Object.defineProperty(dialogPrototype, 'closedBy', {
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

	if (!('returnValue' in dialogPrototype)) {
		Object.defineProperty(dialogPrototype, 'returnValue', {
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
