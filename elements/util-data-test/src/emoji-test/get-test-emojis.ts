import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/utils';
import { getTestAtlassianEmojis } from './get-test-atlassian-emojis';
import { getTestSiteEmojis } from './get-test-site-emojis';
import { getTestStandardEmojis } from './get-test-standard-emojis';

export const getTestEmojis = () => [
  ...denormaliseEmojiServiceResponse(getTestStandardEmojis()).emojis,
  ...denormaliseEmojiServiceResponse(getTestAtlassianEmojis()).emojis,
  ...getTestSiteEmojis().emojis,
];
