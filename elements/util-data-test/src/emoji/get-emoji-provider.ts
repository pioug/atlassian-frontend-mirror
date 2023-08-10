// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
/* eslint-disable import/no-extraneous-dependencies */
import { EmojiRepository } from '@atlaskit/emoji/resource';
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji';
import type {
  EmojiProvider,
  EmojiServiceResponse,
} from '@atlaskit/emoji/types';
/* eslint-disable import/no-extraneous-dependencies */

import { MockEmojiResource } from './mock-emoji-resource';
import { MockEmojiResourceConfig } from './types';
import { loggedUser } from './logged-user';

type DataFetch = () => Promise<EmojiServiceResponse>;

export const currentUser = {
  id: loggedUser,
};

export const defaultFetch = async () => {
  const response = await fetch('./emoji/emoji-all.json');

  if (!response.ok) {
    throw new Error(
      `Could not fetch emoji data: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
};

export const getEmojiProvider = async function getEmojiProvider(
  config?: MockEmojiResourceConfig,
  fn: DataFetch = defaultFetch,
): Promise<EmojiProvider> {
  const response = await fn();
  const { emojis } = denormaliseEmojiServiceResponse(response);
  const repository = new EmojiRepository(emojis);
  return new MockEmojiResource(repository, config);
};
