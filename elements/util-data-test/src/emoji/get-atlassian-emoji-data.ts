import { EmojiServiceResponse } from '../../../emoji/src/types';

export const getAtlassianEmojiData = (): EmojiServiceResponse =>
  require('../json-data/service-data-atlassian.json') as EmojiServiceResponse;
