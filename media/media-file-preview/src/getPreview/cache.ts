import { type MediaStoreGetFileImageParams } from '@atlaskit/media-client';

import { type MediaFilePreview } from '../types';
import { CardPreviewCacheImpl } from './CardPreviewCacheImpl';
import { createObjectURLCache } from './createObjectURLCache';

export // Dimensions are used to create a key.
// Cache is invalidated when different dimensions are provided.
type Mode = MediaStoreGetFileImageParams['mode'] | undefined;

export interface MediaFilePreviewCache {
	get(id: string, mode: Mode): MediaFilePreview | undefined;
	set(id: string, mode: Mode, cardPreview: MediaFilePreview): void;
	remove(id: string, mode: Mode): void;
	clear(): void;
	acquire(id: string, mode: Mode): void;
	release(id: string, mode: Mode): void;
}

export const mediaFilePreviewCache: CardPreviewCacheImpl = new CardPreviewCacheImpl(
	createObjectURLCache(),
);
