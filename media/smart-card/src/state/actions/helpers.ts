import { CardBaseActionCreator } from './types';

export const cardAction: CardBaseActionCreator = (
  type,
  { url },
  payload,
  error,
) => ({
  type,
  url,
  payload,
  error,
});
