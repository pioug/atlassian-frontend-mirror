import { JsonLd } from 'json-ld-types';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export const extractIsTrusted = (meta?: JsonLd.Meta.BaseMeta): boolean => {
  if (getBooleanFF('platform.linking-platform.smart-card.fix-is-trusted-pop')) {
    if (!meta?.key) {
      return false;
    }
    return !['iframely-object-provider', 'public-object-provider'].includes(
      meta.key,
    );
  }
  return Boolean(meta?.key && meta.key !== 'iframely-object-provider');
};
