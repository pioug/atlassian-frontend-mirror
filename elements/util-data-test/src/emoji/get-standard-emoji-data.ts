// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { EmojiServiceResponse } from '@atlaskit/emoji/types';

// TODO: load this data via http instead
export const getStandardEmojiData = (): EmojiServiceResponse =>
  require('../json-data/service-data-standard.json') as EmojiServiceResponse;
