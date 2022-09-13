import { JsonLd } from 'json-ld-types';
import { CardType } from '@atlaskit/linking-common';

// Be aware, there is a copy of this function in smart-card/src/state
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
