/**
 * Async factory for the Confluence embed `Page` component.
 *
 * Kept in its own module so `@atlaskit/embedded-confluence/page` is a dynamic
 * import only — hosts that never render a Confluence embed URL do not
 * download this chunk.
 */
export async function loadEmbeddedConfluencePage(): Promise<
	(typeof import('@atlaskit/embedded-confluence/page'))['Page']
> {
	const { Page } = await import(
		/* webpackChunkName: "@atlaskit-internal_smart-card-embedded-confluence-page" */
		'@atlaskit/embedded-confluence/page'
	);
	return Page;
}
