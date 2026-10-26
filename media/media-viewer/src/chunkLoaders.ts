/**
 * The single call site for each lazily loaded chunk that `./preload` warms.
 *
 * Both the render path and the warm-up path must go through these. Repeating an
 * `import()` with the same `webpackChunkName` in two files relies on the two
 * comments staying identical forever; if they drift, the warm-up fetches a
 * different chunk than the one the viewer loads and silently does nothing.
 */

export const loadMediaViewerChunk = (): Promise<
	typeof import('./components/media-viewer-error-boundary')
> =>
	import(
		/* webpackChunkName: "@atlaskit-internal_media-viewer" */ './components/media-viewer-error-boundary'
	);

export const loadImageViewerChunk = (): Promise<typeof import('./viewers/image')> =>
	import(/* webpackChunkName: "@atlaskit-internal_imageViewer" */ './viewers/image');
