import { bind } from 'bind-event-listener';

import { getDocument } from '@atlaskit/browser-apis';

export type LifecycleHandlers = {
	/** The tab became hidden. */
	onHidden: () => void;
	/** The page is being unloaded. May arrive right after `onHidden`. */
	onPageHide: () => void;
	/** The page came back from the back/forward cache. */
	onPageShow: () => void;
	/** The tab became visible again — the session continues. */
	onVisible: () => void;
};

/**
 * Reports the page lifecycle signals that force an extra snapshot: the tab being hidden or
 * shown again, and the page being unloaded or restored from the back/forward cache.
 *
 * None of them is guaranteed to arrive — a mobile browser being killed raises nothing at all.
 * Snapshots carry session-to-date values, so losing the last one costs only the tail of that
 * session.
 */
export class LifecycleObserver {
	private readonly handlers: LifecycleHandlers;
	private unbind: (() => void) | undefined;

	constructor(handlers: LifecycleHandlers) {
		this.handlers = handlers;
	}

	start(): void {
		const doc = getDocument();
		const unbindVisibilityChange = doc
			? bind(doc, {
					type: 'visibilitychange',
					listener: () => {
						if (doc.visibilityState === 'hidden') {
							this.handlers.onHidden();
						} else {
							this.handlers.onVisible();
						}
					},
				})
			: undefined;

		const unbindPageHide = bind(window, {
			type: 'pagehide',
			listener: () => this.handlers.onPageHide(),
		});

		const unbindPageShow = bind(window, {
			type: 'pageshow',
			listener: () => this.handlers.onPageShow(),
		});

		this.unbind = () => {
			unbindVisibilityChange?.();
			unbindPageHide();
			unbindPageShow();
		};
	}

	stop(): void {
		this.unbind?.();
		this.unbind = undefined;
	}
}
