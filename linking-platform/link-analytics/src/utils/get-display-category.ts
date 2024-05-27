import { type CardType } from '@atlaskit/linking-common';

export const getDisplayCategory = (status?: CardType): 'smartLink' | 'link' => {
  return !status || status !== 'not_found' ? 'smartLink' : 'link';
};
