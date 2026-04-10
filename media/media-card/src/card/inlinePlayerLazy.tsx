import { lazy, type ForwardRefExoticComponent, type LazyExoticComponent, type RefAttributes } from 'react';
import type { InlinePlayerProps } from './inlinePlayer';

export const InlinePlayerLazy: LazyExoticComponent<ForwardRefExoticComponent<Omit<InlinePlayerProps, "ref"> & RefAttributes<HTMLDivElement>>> = lazy(async () => {
	const { InlinePlayer } = await import(
		/* webpackChunkName: "@atlaskit-internal_media-card-inlineplayer" */
		'./inlinePlayer'
	);

	return { default: InlinePlayer };
});
