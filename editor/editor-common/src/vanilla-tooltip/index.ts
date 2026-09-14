import { createPopper as createLegacyPopper, type Instance, type Placement } from '@popperjs/core';
import { bind } from 'bind-event-listener';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { createPopper as createWrappedPopper } from '@atlaskit/popper/unsafe-imperative';

import { logException } from '../monitoring/error';

const startingOffset = {
	name: 'offset',
	options: {
		offset: [0, 4],
	},
};

const endingOffset = {
	name: 'offset',
	options: {
		offset: [0, 8],
	},
};

/**
 * Opt-in class for the default tooltip look, defined as `vanillaTooltipDefaultStyles` in
 * EditorContentContainer. Pass it alongside your own class name.
 */
export const VANILLA_TOOLTIP_DEFAULT_CLASS = 'ak-editor-vanilla-tooltip-default';

/**
 * Namespaced to keep generated ids from colliding with ids the host page owns, since they share
 * the document's single id space.
 */
const TOOLTIP_ID_PREFIX = 'ak-editor-internal-tooltip';

/**
 * Generates a tooltip id for `aria-describedby`/`popovertarget`.
 *
 * `crypto.randomUUID` covers effectively all production traffic
 * The counter is only a fallback for environments without it (for example a non-secure context)
 * and is scoped to this closure rather than module state.
 */
const generateTooltipId = (() => {
	let count = 0;
	return () =>
		typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
			? `${TOOLTIP_ID_PREFIX}-${crypto.randomUUID()}`
			: `${TOOLTIP_ID_PREFIX}-${(count += 1)}`;
})();

function getCreatePopper() {
	if (fg('platform-dst-popper-consolidation')) {
		return createWrappedPopper;
	}

	return createLegacyPopper;
}

/**
 * A tooltip component similar to "@atlaskit/tooltip" but built for vanilla scenarios
 *
 * Uses Popover API for accessibility + stacking context: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
 * Uses popperJS for positioning
 */
export class VanillaTooltip {
	private popperInstance: Instance | undefined;
	private listeners: (() => void)[] = [];
	private currentTimeoutId: NodeJS.Timeout | undefined;
	private shouldHidePopover = false;
	private tooltip: HTMLSpanElement;
	private isDisplayed = false;
	/**
	 * Set only while this tooltip is on screen, so no listener is retained at rest.
	 */
	private unbindEscape: (() => void) | undefined;

	constructor(
		/**
		 * The element that the tooltip describes and Popper uses as its anchor.
		 *
		 * Prefer a `<button>`: it is focusable and announced by assistive tech for free, and is the
		 * only element the browser honours `popovertarget` on. Anything else works, since this
		 * class calls `showPopover()`/`hidePopover()` itself, but then make sure it:
		 *
		 * - **Renders its children**, as the tooltip is appended to the trigger — unless
		 *   `hoistContainer` is given. `<img>`, `<input>` and `<br>` accept the append without error
		 *   but never render it, leaving the tooltip silently at zero size.
		 * - **Is reachable**, if keyboard and screen reader users need the tooltip — usually
		 *   `tabindex="0"` plus a role and accessible name, since `focus`/`blur` are bound to the
		 *   trigger and `aria-describedby` is set on it.
		 */
		private trigger: HTMLElement,
		content: string,
		/**
		 * Id associated to the tooltip - must be unique within the document.
		 *
		 * Pass `undefined` to have one generated, which is preferred: callers otherwise have to
		 * solve uniqueness themselves, and every consumer had solved it differently.
		 */
		id: string | undefined,
		/**
		 * Class Name – used for styling.
		 */
		className: string,
		private timeout: number = 300,
		/**
		 * Optional inline styles to apply directly to the tooltip element.
		 * Useful when the tooltip is rendered in the browser's top layer (via Popover API),
		 * where ancestor CSS selectors cannot reach it.
		 */
		styles?: Readonly<Record<string, string>>,
		/**
		 * Called when the tooltip has become visible, after `timeout` has elapsed.
		 * Not called when the pointer leaves before the tooltip is shown, matching
		 * the `onShow` semantics of "@atlaskit/tooltip".
		 */
		private onShow?: () => void,
		/**
		 * Where the tooltip sits relative to the trigger.
		 *
		 * Defaults to `'top'`, matching the default `position` of "@atlaskit/tooltip". Use
		 * `'bottom'` to match its `position="mouse"`, which places the tooltip below the cursor.
		 */
		private placement: Placement = 'top',
		/**
		 * Where to append the tooltip, instead of inside the trigger.
		 *
		 * Pass a container when anything between the trigger and the viewport is transformed. The
		 * browser resolves a top-layer popover's position against the viewport, while Popper — which
		 * reads `offsetParent`, and gets `null` for anything in the top layer — falls back to the
		 * nearest ancestor with a `transform`. Inside a wide image that ancestor is `.rich-media-item`,
		 * whose `translateX(-50%)` threw the tooltip off screen (EDITOR-8971). Appended to a container
		 * with no transform above it, the two measure from the same origin.
		 *
		 * Opt-in per caller: the tooltip leaves the trigger's subtree, so anything styling it through
		 * an ancestor stops matching — including `VANILLA_TOOLTIP_DEFAULT_CLASS`, whose rule is scoped
		 * under `.ProseMirror`. Pass `styles` for the look instead.
		 */
		private hoistContainer?: HTMLElement | undefined,
	) {
		// Created in the trigger's own document rather than the global one, so nothing depends on
		// the parent realm when the editor renders inside an iframe. Gated alongside the Escape
		// listener's window so the whole iframe fix moves as a single unit.
		const ownerDocument = isExperimentEnabled('platform_editor_use_vanilla_components')
			? trigger.ownerDocument
			: document;
		const tooltip = ownerDocument.createElement('span');
		tooltip.role = 'tooltip';
		tooltip.popover = 'hint';
		tooltip.className = className;
		tooltip.id = id ?? generateTooltipId();
		tooltip.textContent = content;

		// A tooltip is never a hit target. Set before the caller's styles so it can be overridden.
		if (isExperimentEnabled('platform_editor_use_vanilla_components')) {
			tooltip.style.pointerEvents = 'none';
		}

		if (styles) {
			Object.assign(tooltip.style, styles);
		}

		this.tooltip = tooltip;

		(hoistContainer ?? this.trigger).appendChild(tooltip);
		this.trigger.setAttribute('popovertarget', tooltip.id);
		this.trigger.setAttribute('aria-describedby', tooltip.id);

		const showEvents = ['mouseenter', 'focus'];
		const hideEvents = ['mouseleave', 'blur'];

		showEvents.forEach((event) => {
			this.listeners.push(
				bind(this.trigger, {
					type: event,
					listener: () => this.show(),
				}),
			);
		});

		hideEvents.forEach((event) => {
			this.listeners.push(
				bind(this.trigger, {
					type: event,
					listener: () => this.hide(),
				}),
			);
		});

		// Bound for this tooltip's whole lifetime, even while it is off screen. The experiment
		// moves this to `show()` so nothing is retained at rest.
		if (!isExperimentEnabled('platform_editor_use_vanilla_components')) {
			this.listeners.push(
				bind(window, {
					type: 'keydown',
					listener: (e) => {
						if (e.key === 'Escape') {
							this.hide(true);
						}
					},
				}),
			);
		}

		// Hide the tooltip if the hide transition has completed.
		//
		// Only reachable in the control arm: no consumer declares a transition on the tooltip, so
		// this never fires today, and the experiment closes the popover in `hide()` regardless.
		if (!isExperimentEnabled('platform_editor_use_vanilla_components')) {
			this.tooltip.ontransitionend = () => {
				if (this.shouldHidePopover) {
					this.tooltip.hidePopover();
				}
			};
		}
	}

	/**
	 * The tooltip element, for callers that own its accessibility semantics — a hoisted tooltip is no
	 * longer reachable from the trigger.
	 */
	get element(): HTMLSpanElement {
		return this.tooltip;
	}

	/**
	 * Closes the popover, tolerating it already being closed.
	 *
	 * A `hint` popover is light-dismissed by the browser whenever another `hint` or `auto` popover
	 * opens, so the caller can never be sure this one is still showing.
	 */
	private closePopover(): void {
		try {
			this.tooltip.hidePopover();
		} catch (error) {
			// `hidePopover()` raises `InvalidStateError` both when the popover is not showing
			// when the tooltip is disconnected or has lost its `popover` attribute.
			if (!this.tooltip.isConnected || !this.tooltip.hasAttribute('popover')) {
				logException(error as Error, { location: 'editor-common/vanilla-tooltip' });
			}
		}
	}

	/**
	 * Opens the popover, tolerating it already being open.
	 *
	 * A hover returning during a pending hide re-enters `show()` before `isDisplayed` is set, so
	 * this runs against an already-open popover on that path.
	 */
	private openPopover(): void {
		try {
			this.tooltip.showPopover();
		} catch (error) {
			// `showPopover()` raises `InvalidStateError` both when the tooltip is already in the
			// top layer and when it is disconnected or has lost its `popover` attribute.
			if (!this.tooltip.isConnected || !this.tooltip.hasAttribute('popover')) {
				logException(error as Error, { location: 'editor-common/vanilla-tooltip' });
			}
		}
	}

	private createPopperInstance() {
		this.popperInstance = getCreatePopper()(this.trigger, this.tooltip, {
			placement: this.placement,
			modifiers: [startingOffset],
		});
	}

	destroy(): void {
		// Cancels any pending show/hide, which would otherwise run against detached DOM and
		// invoke `onShow` after the owner has gone away.
		clearTimeout(this.currentTimeoutId);
		// Destroying while visible must not leave the listener bound to a dead tooltip.
		this.unbindEscapeListener();
		this.popperInstance?.destroy();
		this.listeners.forEach((listener) => {
			listener();
		});

		// Undoes what the constructor added to the trigger, matching the React `@atlaskit/tooltip`
		// callers are moving off, whose unmount took its DOM with it. A hoisted tooltip is removed
		// either way: it sits outside the trigger, so nothing else takes it away with it.
		if (isExperimentEnabled('platform_editor_use_vanilla_components') || this.hoistContainer) {
			// A popover removed while still showing is never light-dismissed, so the top layer
			// keeps treating it as open.
			this.closePopover();
			this.tooltip.remove();
			if (this.trigger.getAttribute('aria-describedby') === this.tooltip.id) {
				this.trigger.removeAttribute('aria-describedby');
			}
			if (this.trigger.getAttribute('popovertarget') === this.tooltip.id) {
				this.trigger.removeAttribute('popovertarget');
			}
		}
	}

	/**
	 * Starts listening for Escape to dismiss this tooltip.
	 *
	 * A tooltip only ever needs one Escape listener, so this does nothing when one is already
	 * bound.
	 */
	private bindEscapeListener() {
		if (this.unbindEscape) {
			return;
		}

		this.unbindEscape = bind(this.trigger.ownerDocument.defaultView ?? window, {
			type: 'keydown',
			listener: (e) => {
				if (e.key === 'Escape') {
					this.hide(true);
				}
			},
		});
	}

	/**
	 * Stops listening for Escape, so no listener is retained while this tooltip is off screen.
	 *
	 * Does nothing when no listener is bound.
	 */
	private unbindEscapeListener() {
		this.unbindEscape?.();
		this.unbindEscape = undefined;
	}

	private hide(immediate: boolean = false) {
		clearTimeout(this.currentTimeoutId);

		// Unbound synchronously so a repeated Escape does not re-enter this tooltip while the
		// hide is still pending.
		this.unbindEscapeListener();

		this.shouldHidePopover = true;
		// Disable the event listeners
		this.currentTimeoutId = setTimeout(
			() => {
				if (isExperimentEnabled('platform_editor_use_vanilla_components')) {
					// Released rather than reconfigured. The instance was previously kept for the
					// trigger's whole lifetime, so every element the pointer passed over retained
					// one — and under `platform-dst-popper-consolidation` an instance owns a
					// detached React root, so that was a retained root per hovered trigger.
					//
					// Destroying is also the only way to release that root's capture-phase
					// `scroll`/`resize` listeners on the consolidated path, where the
					// `eventListeners: false` reconfiguration in the control arm is accepted but
					// does nothing.
					this.popperInstance?.destroy();
					this.popperInstance = undefined;
					this.tooltip.style.opacity = '0';
					this.isDisplayed = false;

					// Closed here rather than from `ontransitionend`. No consumer declares a
					// transition on the tooltip, so that event never fires and the popover would
					// otherwise stay open in the top layer for good.
					this.closePopover();
					// Paired with the `visibility` that `show()` sets, so a popover left open by
					// a failed close cannot intercept pointer events over the content.
					this.tooltip.style.visibility = 'hidden';
				} else {
					this.popperInstance?.setOptions((options) => ({
						...options,
						modifiers: [startingOffset, { name: 'eventListeners', enabled: false }],
					}));
					this.tooltip.style.opacity = '0';
					this.isDisplayed = false;
					// If transition animations are disabled immediately hide the popover
					if (this.tooltip.style.transition === 'none') {
						this.tooltip.hidePopover();
					}
				}
			},
			immediate ? 0 : this.timeout,
		);
	}

	private show() {
		// Ahead of the `isDisplayed` guard, unlike the equivalent below: `hide()` takes effect
		// synchronously but leaves the tooltip on screen until its timeout, so a pointer
		// returning in that window finds `isDisplayed` still true and returns early. Cancelling
		// first keeps the tooltip up and stops it being left undismissable with a hide pending.
		if (isExperimentEnabled('platform_editor_use_vanilla_components')) {
			this.bindEscapeListener();
			clearTimeout(this.currentTimeoutId);
			this.shouldHidePopover = false;
		}

		if (this.isDisplayed) {
			return;
		}

		// Control only: the experiment cancels above, ahead of the guard. Kept gated rather than
		// left unconditional — despite being a no-op once the block above has run — so that
		// experiment cleanup can delete it outright instead of having to reason about it.
		if (!isExperimentEnabled('platform_editor_use_vanilla_components')) {
			clearTimeout(this.currentTimeoutId);
			this.shouldHidePopover = false;
		}

		// Make the tooltip visible - but hide until
		this.tooltip.style.visibility = 'hidden';
		if (isExperimentEnabled('platform_editor_use_vanilla_components')) {
			this.openPopover();
		} else {
			this.tooltip.showPopover();
		}

		// Update its position
		if (!this.popperInstance) {
			this.createPopperInstance();
		} else {
			this.popperInstance.update();
		}

		// Enable the event listeners
		this.currentTimeoutId = setTimeout(() => {
			this.tooltip.style.opacity = '1';
			this.tooltip.style.visibility = 'visible';
			this.popperInstance?.setOptions((options) => ({
				...options,
				modifiers: [endingOffset, { name: 'eventListeners', enabled: true }],
			}));
			this.isDisplayed = true;
			this.onShow?.();
		}, this.timeout);
	}
}
