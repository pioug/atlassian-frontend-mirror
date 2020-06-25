import { CardBaseActionCreator } from './types';

export const cardAction: CardBaseActionCreator = (
  type,
  { url, hasExpired },
  payload,
  error,
) => ({
  type,
  url,
  hasExpired,
  payload,
  error,
});
