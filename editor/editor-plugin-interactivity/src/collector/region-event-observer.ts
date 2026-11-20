import { bindAll, type UnbindFn } from 'bind-event-listener';

import { INTERACTION_EVENT_TYPES } from './interaction-events';

/** What a region's owner tells the collector the region is made of. */
export type InteractivityRegion = {
	/**
	 * Makes interactions with the element interactions with the region, until the function it
	 * returns is called. Calling that again does nothing. An element added several times is
	 * listened to once, until each of them is removed.
	 */
	addElement: (element: Element) => () => void;
};

type Registration = {
	count: number;
	unbind: UnbindFn;
};

/**
 * Reports the events the interactions with a region are made of, as the browser dispatched
 * them. What they mean is the tracker's business.
 *
 * Event Timing cannot answer which interactions were with a region, because it observes the
 * whole document, nor how many there were, because it reports none below 16 ms.
 *
 * An element has its listeners from the moment it is added until it is removed; they report only
 * between `start` and `stop`.
 */
export class RegionEventObserver implements InteractivityRegion {
	/** Set only while observing, so a stopped region does not keep its collector alive. */
	private onEvent: ((event: Event) => void) | undefined;
	/** Weak, so an element its owner forgot to remove is not kept alive after it leaves the page. */
	private readonly registrations = new WeakMap<Element, Registration>();
	/** An event passing through two elements of the region is one interaction with it. */
	private readonly reported = new WeakSet<Event>();

	// An arrow property, so an owner can hand `region.addElement` on without the region.
	readonly addElement = (element: Element): (() => void) => {
		let registration = this.registrations.get(element);
		if (!registration) {
			registration = { count: 0, unbind: this.listen(element) };
			this.registrations.set(element, registration);
		}
		registration.count += 1;

		let removed = false;
		return () => {
			if (removed) {
				return;
			}
			removed = true;

			registration.count -= 1;
			if (registration.count === 0) {
				registration.unbind();
				this.registrations.delete(element);
			}
		};
	};

	start(onEvent: (event: Event) => void): void {
		this.onEvent = onEvent;
	}

	/** Stops reporting; the elements stay in the region for when observing starts again. */
	stop(): void {
		this.onEvent = undefined;
	}

	private listen(element: Element): UnbindFn {
		return bindAll(
			element,
			INTERACTION_EVENT_TYPES.map((type) => ({ type, listener: this.report })),
			// Capture, so a handler in the region cannot stop an interaction from being reported.
			{ capture: true, passive: true },
		);
	}

	private readonly report = (event: Event): void => {
		if (!this.onEvent || this.reported.has(event)) {
			return;
		}
		this.reported.add(event);
		this.onEvent(event);
	};
}
