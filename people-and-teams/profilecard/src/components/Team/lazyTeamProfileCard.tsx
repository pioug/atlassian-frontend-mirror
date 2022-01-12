import { lazy } from 'react';

export const TeamProfileCardLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_lazy-team-profilecard" */
      './TeamProfileCard'
    ),
);
