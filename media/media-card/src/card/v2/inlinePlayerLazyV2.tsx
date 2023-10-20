import { lazy } from 'react';

export const InlinePlayerLazyV2 = lazy(async () => {
  const { InlinePlayerV2 } = await import(
    /* webpackChunkName: "@atlaskit-internal_media-card-inlineplayer-v2" */
    './inlinePlayerV2'
  );

  return { default: InlinePlayerV2 };
});
