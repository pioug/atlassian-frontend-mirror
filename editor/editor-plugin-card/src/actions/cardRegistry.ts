import type { CardRegistration, CardRegistrations } from '@atlaskit/editor-common/card/types';

/**
 * Creates a registry of resolved cards, for use with editor actions.
 * Registration changes (insertion, deletion, and id/title/url updates) notify subscribers; live position changes do not.
 *
 * @returns A registry object with the following methods:
 * - `getCardRegistrations`: Returns the current registrations, keyed by card ID.
 * - `registerCard`: Adds or updates a card.
 * - `removeCard`: Removes a card by ID.
 * - `subscribe`: Registers a change listener and returns an unsubscribe function.
 */
export const createCardRegistry = (): {
	/**
	 * Reads the current registrations without copying them.
	 * @returns An immutable object keyed by card ID. Its identity changes only when
	 * registrations change. Each entry's `getPos()` reads its live position, or
	 * undefined after node removal.
	 */
	getCardRegistrations: () => CardRegistrations;
	/**
	 * Adds or updates a card by ID and notifies subscribers when its registration changes.
	 * Ignores cards whose position is undefined.
	 * @param info - The card ID, metadata, and live position getter.
	 */
	registerCard: (info: CardRegistration) => void;
	/**
	 * Removes a card and notifies subscribers. Does nothing for an unknown ID.
	 * @param id - The registered card ID.
	 */
	removeCard: (id: string) => void;
	/**
	 * Registers a listener for registration changes, not position changes.
	 * @param listener - Called after the registration object is replaced.
	 * @returns A cleanup function to unsubscribe the listener.
	 */
	subscribe: (listener: () => void) => () => void;
} => {
	// Replace registrations on each change to notify subscribers and trigger React updates.
	let registrations: CardRegistrations = {};
	const listeners = new Set<() => void>();

	const getCardRegistrations = (): CardRegistrations => registrations;

	const notify = () => {
		Array.from(listeners).forEach((listener) => listener());
	};

	const registerCard = (info: CardRegistration): void => {
		if (info.getPos() === undefined) {
			return;
		}
		const previous: CardRegistration | undefined = registrations[info.id];
		if (
			previous &&
			previous.getPos === info.getPos &&
			previous.title === info.title &&
			previous.url === info.url
		) {
			return; // Don't mutate registrations if no change
		}
		registrations = { ...registrations, [info.id]: { ...info } };
		notify();
	};

	const removeCard = (id: string): void => {
		if (!registrations[id]) {
			return;
		}
		const next = { ...registrations };
		delete next[id];
		registrations = next;
		notify();
	};

	const subscribe = (listener: () => void): (() => void) => {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	};

	return {
		registerCard,
		removeCard,
		subscribe,
		getCardRegistrations,
	};
};
