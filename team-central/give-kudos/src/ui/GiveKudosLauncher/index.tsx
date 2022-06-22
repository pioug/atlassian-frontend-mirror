import { lazy } from 'react';

export const GiveKudosLauncherLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_lazy-give-kudos" */
      './main'
    ),
);
