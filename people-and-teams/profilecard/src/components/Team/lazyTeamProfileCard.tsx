import { lazy } from 'react';

export const TeamProfileCardLazy = lazy(
  () =>
    // eslint-disable-next-line import/dynamic-import-chunkname
    import(/* webpackChunkName:"lazy-team-profilecard" */ './TeamProfileCard'),
);
