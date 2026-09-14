/**
 * A simple module-level singleton used to hand media node metadata from the
 * SSR data-preload phase to the render phase.
 *
 * During SSR, Confluence preloads media node metadata and
 * records it here via {@link setMediaNodes}. It is later read via
 * {@link getMediaNodes} both by the product's render pipeline and by platform
 * consumers such as `@atlaskit/media-file-preview`.
 *
 * This lives in `@atlaskit/media-common` (rather than a product package) so that
 * both product code and platform packages can share the exact same singleton
 * instance without platform depending on a product package.
 */
let mediaNodes: ReadonlyArray<unknown> | null = null;

export const setMediaNodes = (nodes: ReadonlyArray<unknown>): void => {
	mediaNodes = nodes;
};

export const getMediaNodes = (): ReadonlyArray<unknown> | null => mediaNodes;

export const resetMediaNodes = (): void => {
	mediaNodes = null;
};
