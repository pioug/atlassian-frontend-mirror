import { JsonLd } from 'json-ld-types';
import { CardType } from '../types';

const getStatusForNotFoundVisibility = (meta: JsonLd.Meta.BaseMeta) => {
  const accessType = meta.requestAccess?.accessType;
  if (!accessType || accessType === 'ACCESS_EXISTS') {
    return 'not_found';
  }
  // for the rest of the accessTypes we will return forbidden,see https://product-fabric.atlassian.net/browse/EDM-7125
  return 'forbidden';
};

export const getStatus = ({
  meta,
}: {
  meta: JsonLd.Response['meta'];
}): CardType => {
  const { access, visibility } = meta;

  switch (access) {
    case 'forbidden':
      if (visibility === 'not_found') {
        return getStatusForNotFoundVisibility(meta);
      } else {
        return 'forbidden';
      }
    case 'unauthorized':
      return 'unauthorized';
    default:
      return 'resolved';
  }
};
