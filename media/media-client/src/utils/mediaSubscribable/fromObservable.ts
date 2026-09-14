/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import { type ReplaySubject } from 'rxjs/ReplaySubject';

import type { FileState } from '@atlaskit/media-state/file-state';

import { type MediaSubscribable, type MediaSubscription } from './types';

export function fromObservable(observable: ReplaySubject<FileState>): MediaSubscribable {
	return {
		subscribe: (observer): MediaSubscription => {
			const subscription =
				// This is needed to handle "subscribe" function overload.
				// It allows accepting a single "next" callback function as an argument.
				observer instanceof Function
					? observable.subscribe(observer)
					: observable.subscribe(observer);

			return {
				unsubscribe: () => {
					subscription.unsubscribe();
				},
			};
		},
	};
}

/**
 * @deprecated Use `import { createMediaSubscribable } from '@atlaskit/media-client'` instead.
 */
export { createMediaSubscribable } from './createMediaSubscribable';
