// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji';
import { getTestAtlassianEmojis } from './get-test-atlassian-emojis';
import { getTestSiteEmojis } from './get-test-site-emojis';
import { getTestStandardEmojis } from './get-test-standard-emojis';

export const getTestEmojis = () => [
  ...denormaliseEmojiServiceResponse(getTestStandardEmojis()).emojis,
  ...denormaliseEmojiServiceResponse(getTestAtlassianEmojis()).emojis,
  ...getTestSiteEmojis().emojis,
];
