import { createPopper, Instance } from '@popperjs/core';
import { bind } from 'bind-event-listener';

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
 * A tooltip component similar to "@atlaskit/tooltip" but built for vanilla scenarios
 *
 * Uses Popover API for accessibility + stacking context: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
 * Uses popperJS for positioning
 *
 * @warning Still experimental. One day we can likely want to move this to a common package.
 */
export class VanillaTooltip {
	private popperInstance: Instance | undefined;
	private listeners: (() => void)[] = [];
	private currentTimeoutId: NodeJS.Timeout | undefined;
	private shouldHidePopover = false;
	private tooltip: HTMLSpanElement;
	private isDisplayed = false;

	constructor(
		private button: HTMLButtonElement,
		content: string,
		/**
		 * Id associated to the tooltip - must be unique.
		 */
		id: string,
		private timeout: number = 300,
	) {
		const tooltip = document.createElement('span');
		tooltip.role = 'tooltip';
		tooltip.popover = 'hint';
		// Warning: Currently this is used for styling - only works in the block controls package
		tooltip.className = 'blocks-quick-insert-tooltip';
		tooltip.id = id;
		tooltip.textContent = content;
		this.tooltip = tooltip;

		// Button preparation
		button.appendChild(tooltip);
		// Prepare the button to have the popover target and accessibility properties
		button.setAttribute('popovertarget', tooltip.id);
		button.setAttribute('aria-describedby', tooltip.id);

		const showEvents = ['mouseenter', 'focus'];
		const hideEvents = ['mouseleave', 'blur'];

		showEvents.forEach((event) => {
			this.listeners.push(
				bind(button, {
					type: event,
					listener: () => this.show(),
				}),
			);
		});

		hideEvents.forEach((event) => {
			this.listeners.push(
				bind(button, {
					type: event,
					listener: () => this.hide(),
				}),
			);
		});

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

		// Hide the tooltip if the hide transition has completed
		this.tooltip.ontransitionend = () => {
			if (this.shouldHidePopover) {
				this.tooltip.hidePopover();
			}
		};
	}

	private createPopperInstance() {
		this.popperInstance = createPopper(this.button, this.tooltip, {
			placement: 'top',
			modifiers: [startingOffset],
		});
	}

	destroy() {
		this.popperInstance?.destroy();
		this.listeners.forEach((listener) => {
			listener();
		});
	}

	private hide(immediate: boolean = false) {
		clearTimeout(this.currentTimeoutId);

		this.shouldHidePopover = true;
		// Disable the event listeners
		this.currentTimeoutId = setTimeout(
			() => {
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
			},
			immediate ? 0 : this.timeout,
		);
	}

	private show() {
		if (this.isDisplayed) {
			return;
		}
		clearTimeout(this.currentTimeoutId);
		this.shouldHidePopover = false;

		// Make the tooltip visible - but hide until
		this.tooltip.style.visibility = 'hidden';
		this.tooltip.showPopover();

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
		}, this.timeout);
	}
}
