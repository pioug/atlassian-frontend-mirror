import type { FileState } from '@atlaskit/media-state/file-state';

import { createMediaSubject } from '../createMediaSubject';
import { fromObservable } from './fromObservable';
import { type MediaSubscribable } from './types';

export function createMediaSubscribable(item?: FileState | Error): MediaSubscribable {
	return fromObservable(createMediaSubject(item));
}
