import { lazy, type LazyExoticComponent } from 'react';

import type { GiveKudosDrawerProps } from '../../types';

export const GiveKudosLauncherLazy: LazyExoticComponent<
	(props: GiveKudosDrawerProps) => JSX.Element
> = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_lazy-give-kudos" */
			'./main'
		),
);
