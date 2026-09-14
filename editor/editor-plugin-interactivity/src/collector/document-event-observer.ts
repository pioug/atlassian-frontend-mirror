import { getDocument } from '@atlaskit/browser-apis';
import { bindAll, type UnbindFn } from 'bind-event-listener';

import { INTERACTION_EVENT_TYPES } from './interaction-events';

/**
 * Reports the events interactions anywhere on the page are made of, as the browser dispatched them.
 *
 * `EditorEventObserver` answers which interactions were the editor's; this one exists for what only
 * the event itself can say about any interaction: the path it travelled, complete and still in the
 * document. Capture phase, so it is read before a handler has run and moved anything.
 */
export class DocumentEventObserver {
	private readonly onEvent: (event: Event) => void;
	private unbind: UnbindFn | undefined;

	constructor(onEvent: (event: Event) => void) {
		this.onEvent = onEvent;
	}

	/** Does nothing when already started, so a second call cannot bind the listeners twice. */
	start(): void {
		if (this.unbind) {
			return;
		}

		const doc = getDocument();
		if (!doc) {
			return;
		}

		this.unbind = bindAll(
			doc,
			INTERACTION_EVENT_TYPES.map((type) => ({ type, listener: this.onEvent })),
			{ capture: true, passive: true },
		);
	}

	stop(): void {
		this.unbind?.();
		this.unbind = undefined;
	}
}
