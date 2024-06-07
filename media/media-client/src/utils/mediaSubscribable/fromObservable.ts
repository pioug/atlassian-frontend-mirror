import { type ReplaySubject } from 'rxjs/ReplaySubject';
import { type FileState } from '@atlaskit/media-state';
import { createMediaSubject } from '../createMediaSubject';
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

export function createMediaSubscribable(item?: FileState | Error): MediaSubscribable {
	return fromObservable(createMediaSubject(item));
}
