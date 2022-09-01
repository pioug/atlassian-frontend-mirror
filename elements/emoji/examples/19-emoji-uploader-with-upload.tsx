import React from 'react';
import EmojiUploader from '../src/components/uploader/EmojiUploader';

import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { loggedUser } from '@atlaskit/util-data-test/logged-user';

import { lorem } from '../example-helpers';
import { EmojiProvider } from '../src/resource';
import { IntlProvider } from 'react-intl-next';

export default function EmojiUploaderWithUpload() {
  const emojiProvider: Promise<EmojiProvider> = getEmojiResource({
    uploadSupported: true,
    currentUser: { id: loggedUser },
  });

  return (
    <IntlProvider locale="en">
      <div style={{ padding: '10px' }}>
        <EmojiUploader emojiProvider={emojiProvider} />
        <p style={{ width: '400px' }}>
          {lorem}
          {lorem}
        </p>
      </div>
    </IntlProvider>
  );
}
