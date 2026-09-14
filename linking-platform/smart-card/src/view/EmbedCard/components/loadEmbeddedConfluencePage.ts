/**
 * Async factory for the Confluence embed `Page` component.
 *
 * Kept in its own module so `@atlaskit/embedded-confluence` is a dynamic
 * import only — hosts that never render a Confluence embed URL do not
 * download this chunk.
 */
export async function loadEmbeddedConfluencePage(): Promise<
	(typeof import('@atlaskit/embedded-confluence'))['Page']
> {
	const { Page } = await import(
		/* webpackChunkName: "@atlaskit-internal_smart-card-embedded-confluence" */
		'@atlaskit/embedded-confluence'
	);
	return Page;
}
