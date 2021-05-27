import { EmojiServiceResponse } from '@atlaskit/emoji/types';

export const getAtlassianEmojiData = (): EmojiServiceResponse =>
  require('../json-data/service-data-atlassian.json') as EmojiServiceResponse;
