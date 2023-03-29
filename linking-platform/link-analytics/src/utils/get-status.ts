import { JsonLd } from 'json-ld-types';
import { CardType } from '@atlaskit/linking-common';

// Be aware, this is a copy of a function in link-provider/src/helpers
export const getStatus = ({ meta }: JsonLd.Response): CardType => {
  const { access, visibility } = meta;
  switch (access) {
    case 'forbidden':
      if (visibility === 'not_found') {
        return 'not_found';
      } else {
        return 'forbidden';
      }
    case 'unauthorized':
      return 'unauthorized';
    default:
      return 'resolved';
  }
};
