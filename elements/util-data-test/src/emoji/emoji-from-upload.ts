import uuid from 'uuid';

// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import type { EmojiUpload } from '@atlaskit/emoji/types';
import { customCategory, customType } from '../emoji-constants';
import { loggedUser } from './logged-user';

export const emojiFromUpload = (upload: EmojiUpload) => {
  const { shortName, name, dataURL, height, width } = upload;
  return {
    id: uuid(),
    shortName,
    name,
    fallback: shortName,
    type: customType,
    category: customCategory,
    order: -1,
    creatorUserId: loggedUser,
    representation: {
      width,
      height,
      imagePath: dataURL,
    },
    searchable: true,
  };
};
