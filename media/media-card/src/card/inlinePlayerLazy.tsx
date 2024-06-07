import { lazy } from 'react';

export const InlinePlayerLazy = lazy(async () => {
	const { InlinePlayer } = await import(
		/* webpackChunkName: "@atlaskit-internal_media-card-inlineplayer" */
		'./inlinePlayer'
	);

	return { default: InlinePlayer };
});
