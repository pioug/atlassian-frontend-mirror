import { JsonLd } from 'json-ld-types';

export const extractIsTrusted = (meta?: JsonLd.Meta.BaseMeta): boolean => {
  return Boolean(meta?.key && meta.key !== 'iframely-object-provider');
};
