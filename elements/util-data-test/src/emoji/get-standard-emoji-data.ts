import { EmojiServiceResponse } from '../../../emoji/src/types';

// TODO: load this data via http instead
export const getStandardEmojiData = (): EmojiServiceResponse =>
  require('../json-data/service-data-standard.json') as EmojiServiceResponse;
