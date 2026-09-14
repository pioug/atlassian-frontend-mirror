import { bindAll, type UnbindFn } from 'bind-event-listener';

import { INTERACTION_EVENT_TYPES } from './interaction-events';

/**
 * Reports the events the interactions with the editor are made of, as the browser dispatched
 * them. What they mean is the tracker's business.
 *
 * Event Timing cannot answer which interactions were with the editor, because it observes the
 * whole document, nor how many there were, because it reports none below 16 ms.
 */
export class EditorEventObserver {
	private readonly onEvent: (event: Event) => void;
	private root: Element | undefined;
	private unbind: UnbindFn | undefined;

	constructor(onEvent: (event: Event) => void) {
		this.onEvent = onEvent;
	}

	/**
	 * Called as the element the editor renders itself into changes: the editor only knows it after
	 * its first render, and can replace it.
	 */
	observe(root: Element | null | undefined): void {
		const next = root ?? undefined;
		if (next === this.root) {
			return;
		}

		this.stop();
		this.root = next;

		if (!next) {
			return;
		}

		this.unbind = bindAll(
			next,
			INTERACTION_EVENT_TYPES.map((type) => ({ type, listener: this.onEvent })),
			// Capture, so a handler in the editor cannot stop an interaction from being reported.
			{ capture: true, passive: true },
		);
	}

	stop(): void {
		this.unbind?.();
		this.unbind = undefined;
		this.root = undefined;
	}
}
