// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { EmojiServiceResponse } from '@atlaskit/emoji/types';

export const getAtlassianEmojiData = (): EmojiServiceResponse =>
  require('../json-data/service-data-atlassian.json') as EmojiServiceResponse;
