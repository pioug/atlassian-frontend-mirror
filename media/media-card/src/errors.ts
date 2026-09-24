export type ImageLoadPrimaryReason =
	| 'cache-remote-uri'
	| 'cache-local-uri'
	| 'local-uri'
	| 'remote-uri'
	| 'external-uri'
	| 'unknown-uri';

export type RemotePreviewPrimaryReason =
	| 'remote-preview-fetch'
	| 'remote-preview-not-ready'
	| 'remote-preview-fetch-ssr';

export type LocalPreviewPrimaryReason =
	| 'local-preview-get'
	| 'local-preview-unsupported'
	| 'local-preview-rejected'
	| 'local-preview-image'
	| 'local-preview-video';

export type SsrPreviewPrimaryReason =
	| 'ssr-client-uri'
	| 'ssr-client-load'
	| 'ssr-server-uri'
	| 'ssr-server-load';

export type SvgPrimaryReason =
	| 'svg-img-error'
	| 'svg-binary-fetch'
	| 'svg-blob-to-datauri'
	| 'svg-unknown-error';

export type { MediaCardErrorPrimaryReason } from './MediaCardError';
