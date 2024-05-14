import React, { useMemo } from 'react';
import { EmojiPicker } from '../../picker';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getMockEmojis } from '@atlaskit/editor-test-helpers/mock-emojis';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  currentUser,
  getEmojiProvider,
} from '@atlaskit/util-data-test/get-emoji-provider';

import type { EmojiProvider } from '../../resource';
import { IntlProvider } from 'react-intl-next';

const useProvider = (uploadSupported: boolean) => {
  return useMemo<Promise<EmojiProvider>>(() => {
    return getEmojiProvider(
      {
        currentUser,
        uploadSupported,
      },
      getMockEmojis,
    );
  }, [uploadSupported]);
};

export const EmojiPickerWithUpload = () => {
  const emojiProvider = useProvider(true);

  return (
    <IntlProvider locale="en">
      <EmojiPicker emojiProvider={emojiProvider} />
    </IntlProvider>
  );
};

export const EmojiPickerWithoutUpload = () => {
  const emojiProvider = useProvider(false);

  return (
    <IntlProvider locale="en">
      <EmojiPicker emojiProvider={emojiProvider} />
    </IntlProvider>
  );
};
