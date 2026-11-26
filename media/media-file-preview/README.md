# MediaFilePreview

A React Hook to fetch and render file previews. It's overloaded with fancy features like SSR, lazy loading, memory cache and local preview.

During server rendering, preview data is embedded in the HTML for use during hydration.

## Usage

`import MediaFilePreview from '@atlaskit/media-file-preview';`

Detailed docs and example usage can be found [here](https://atlaskit.atlassian.com/packages/media/media-file-preview).

With `platform_media_bounded_read_tokens` enabled, SSR image URLs longer than 8,000 characters
fall back to the authenticated client preview flow. This applies to both embedded SSR data and
newly generated SSR URLs. Cached previews and shorter SSR URLs retain their existing behavior.
Oversized previews therefore wait for client fetching instead of loading directly from SSR.
