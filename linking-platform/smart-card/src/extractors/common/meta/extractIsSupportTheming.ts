import { JsonLd } from 'json-ld-types';
import { PROVIDER_KEYS_WITH_THEMING } from '../../constants';

export const extractIsSupportTheming = (
  meta?: JsonLd.Meta.BaseMeta,
): boolean => {
  return Boolean(meta?.key && PROVIDER_KEYS_WITH_THEMING.includes(meta.key));
};
