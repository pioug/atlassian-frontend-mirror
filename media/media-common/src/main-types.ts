// Warning! You can't add new media types!
// See packages/media/media-core/src/__tests__/cache-backward-compatibility.spec.ts
export type MediaType = 'doc' | 'audio' | 'video' | 'image' | 'archive' | 'unknown';

export type FileStatus = 'uploading' | 'processing' | 'processed' | 'error' | 'failed-processing';

// TODO EDM-689 Please, consolidate these two CardDimensions types
export interface NumericalCardDimensions {
	width: number;
	height: number;
}

export type SSR = 'client' | 'server';
