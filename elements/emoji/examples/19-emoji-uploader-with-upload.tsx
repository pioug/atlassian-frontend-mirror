import React from 'react';
import EmojiUploader from '../src/components/uploader/EmojiUploader';

import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { loggedUser } from '@atlaskit/util-data-test/logged-user';

import { lorem } from '../example-helpers';
import { EmojiProvider } from '../src/resource';

export interface EmojiProps {}

export default class EmojiUploaderWithUpload extends React.Component<
  EmojiProps,
  {}
> {
  constructor(props: EmojiProps) {
    super(props);
  }

  render() {
    const emojiProvider: Promise<EmojiProvider> = getEmojiResource({
      uploadSupported: true,
      currentUser: { id: loggedUser },
    });
    return (
      <div style={{ padding: '10px' }}>
        <EmojiUploader emojiProvider={emojiProvider} />
        <p style={{ width: '400px' }}>
          {lorem}
          {lorem}
        </p>
      </div>
    );
  }
}
