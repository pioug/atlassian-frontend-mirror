import { JsonLd } from 'json-ld-types';
import { Store } from 'redux';
import { CardType } from '@atlaskit/linking-common';
import { CardStore } from './state/store/types';

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

export const getUrl = (store: Store<CardStore>, url: string) => {
  return (
    store.getState()[url] || {
      status: 'pending',
    }
  );
};
