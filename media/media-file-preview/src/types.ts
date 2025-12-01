export type MediaFilePreviewSource =
	| 'local'
	| 'remote'
	| 'ssr-server'
	| 'ssr-client'
	| 'ssr-data'
	| 'cache-local'
	| 'cache-remote'
	| 'external';

export type MediaFilePreviewDimensions = {
	width?: number;
	height?: number;
};

export interface MediaFilePreview {
	dataURI: string;
	srcSet?: string;
	lazy?: boolean; // Whether the preview is lazy loaded
	orientation?: number;
	dimensions?: MediaFilePreviewDimensions;
	source: MediaFilePreviewSource;
}

export type MediaFilePreviewStatus = 'loading' | 'complete' | 'error';
