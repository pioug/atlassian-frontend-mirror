/* eslint-disable compat/compat */
/**
 * Popover API & HTMLDialogElement polyfills for jsdom.
 *
 * jsdom does not implement the Popover API or the HTMLDialogElement methods
 * (showModal, show, close). This polyfill provides faithful implementations,
 * including timing semantics validated against Chromium via Playwright.
 *
 * Behaviour:
 *  - beforetoggle: sync, cancelable on popover show only. toggle: async task, never cancelable.
 *  - Rapid show/hide coalesces into one toggle event (originalOldState to finalNewState).
 *  - Dialog: showModal/show fire beforetoggle+toggle. close fires toggle then close event.
 *  - Popover open state tracked via `data-popover-open` (no `:popover-open` in jsdom).
 *  - Auto popovers: maintain an open stack, perform light-dismiss on document mousedown
 *    outside the open chain, and dismiss the topmost on Escape.
 *  - On open, removes any inline `opacity: 0` from the popover element so callers that
 *    rely on a `ResizeObserver` reveal callback (e.g. `use-anchor-position`) become
 *    visible in jsdom, where layout-driven RO callbacks never fire.
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

// `popover` attribute valid values. Empty / "auto" -> "auto"; unknown -> "manual".
// Spec: https://html.spec.whatwg.org/multipage/popover.html#attr-popover
type TPopoverMode = 'auto' | 'hint' | 'manual';

function getPopoverMode({ element }: { element: HTMLElement }): TPopoverMode | null {
	if (!element.hasAttribute('popover')) {
		return null;
	}
	const raw = element.getAttribute('popover');
	if (raw === null || raw === '' || raw === 'auto') {
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

// Polyfill-only. Real browsers reveal the popover once `ResizeObserver`
// callbacks fire after the first layout pass. jsdom has no layout, so we clear
// any inline `opacity: 0` (set by callers like `use-anchor-position`) once
// the open toggle has fired.
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

// Hide every popover in `stack` that is not an ancestor of `target`. With a
// null target, closes the entire stack.
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
	toHide.forEach((popover) => popover.hidePopover());
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

function handleDocumentPointerdown(event: PointerEvent) {
	if (openAutoStack.length === 0 && openHintStack.length === 0) {
		return;
	}
	const target = event.target instanceof Node ? event.target : null;
	pointerdownState.target = nearestOpenPopover({ target });
}

function handleDocumentPointerup(event: PointerEvent) {
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

// Topmost still-connected popover in `stack`, pruning disconnected entries
// (test pollution where a popover was removed from the DOM without hidePopover).
// Polyfill-only defensive cleanup; not in the spec.
function topmostConnected({ stack }: { stack: HTMLElement[] }): HTMLElement | null {
	while (stack.length > 0) {
		const candidate = stack[stack.length - 1];
		if (candidate.isConnected) {
			return candidate;
		}
		stack.pop();
	}
	return null;
}

// Escape closes the topmost open popover. Hints are dismissed before autos.
// Spec: https://html.spec.whatwg.org/multipage/popover.html#close-watcher
function handleDocumentKeydown(event: KeyboardEvent) {
	if (event.key !== 'Escape') {
		return;
	}
	const topHint = topmostConnected({ stack: openHintStack });
	if (topHint) {
		topHint.hidePopover();
		return;
	}
	const topAuto = topmostConnected({ stack: openAutoStack });
	if (topAuto) {
		topAuto.hidePopover();
	}
}

if (typeof HTMLElement !== 'undefined') {
	const schedulePopoverToggle = createToggleScheduler();

	// jsdom throws `SyntaxError` on the `:popover-open` pseudo-class. Answer
	// it from the polyfill's `data-popover-open` source of truth and
	// delegate every other selector to the original implementation.
	// Spec: https://html.spec.whatwg.org/multipage/semantics-other.html#selector-popover-open
	const originalMatches = Element.prototype.matches;
	Element.prototype.matches = function patchedMatches(this: Element, selector: string): boolean {
		if (selector === ':popover-open') {
			return this.hasAttribute('data-popover-open');
		}
		return originalMatches.call(this, selector);
	};

	// Spec: https://html.spec.whatwg.org/multipage/popover.html#dom-showpopover
	if (!HTMLElement.prototype.showPopover) {
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
			}

			this.setAttribute('data-popover-open', '');
			const stack = stackForMode({ mode });
			if (stack && !stack.includes(this)) {
				stack.push(this);
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
			// Browser does not throw for disconnected elements on hide. No-op.
			if (!this.isConnected || !isPopoverOpen({ element: this })) {
				return;
			}

			// not cancelable on hide
			fireToggleEvent({
				element: this,
				type: 'beforetoggle',
				oldState: 'open',
				newState: 'closed',
				cancelable: false,
			});
			this.removeAttribute('data-popover-open');
			const stack = stackForMode({ mode: getPopoverMode({ element: this }) });
			if (stack) {
				const stackIndex = stack.indexOf(this);
				if (stackIndex !== -1) {
					stack.splice(stackIndex, 1);
				}
			}
			schedulePopoverToggle({ element: this, newState: 'closed' });
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
	const proto = HTMLDialogElement.prototype as HTMLDialogElement & {
		_isModal?: boolean;
		_returnValue?: string;
	};

	const scheduleDialogToggle = createDialogToggleScheduler();

	if (typeof proto.showModal !== 'function') {
		proto.showModal = function showModal(this: HTMLDialogElement & { _isModal?: boolean }) {
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

			fireToggleEvent({
				element: this,
				type: 'beforetoggle',
				oldState: 'closed',
				newState: 'open',
				cancelable: false,
			});

			this.setAttribute('open', '');
			this._isModal = true;
			scheduleDialogToggle({ dialog: this, newState: 'open', shouldFireCloseEvent: false });
		};
	}

	if (typeof proto.show !== 'function') {
		proto.show = function show(this: HTMLDialogElement & { _isModal?: boolean }) {
			// Browser does not throw for disconnected elements on show; no-op.
			if (!this.isConnected || this.hasAttribute('open')) {
				return;
			}

			fireToggleEvent({
				element: this,
				type: 'beforetoggle',
				oldState: 'closed',
				newState: 'open',
				cancelable: false,
			});

			this.setAttribute('open', '');
			this._isModal = false;
			scheduleDialogToggle({ dialog: this, newState: 'open', shouldFireCloseEvent: false });
		};
	}

	if (typeof proto.close !== 'function') {
		proto.close = function close(
			this: HTMLDialogElement & { _isModal?: boolean; returnValue: string },
			returnValue?: string,
		) {
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

			this.removeAttribute('open');
			this._isModal = false;
			if (returnValue !== undefined) {
				this.returnValue = returnValue;
			}
			scheduleDialogToggle({ dialog: this, newState: 'closed', shouldFireCloseEvent: true });
		};
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
