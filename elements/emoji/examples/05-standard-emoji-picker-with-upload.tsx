import React from 'react';
import Layer from '@atlaskit/layer';
import { EmojiPicker } from '../src/picker';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { getEmojiResourceWithStandardAndAtlassianEmojis } from '@atlaskit/util-data-test/get-emoji-resource-standard-atlassian';
import { loggedUser } from '@atlaskit/util-data-test/logged-user';
import { lorem, onSelection } from '../example-helpers';
import { EmojiProvider } from '../src/resource';

export interface EmojiState {
  siteEmojiEnabled: boolean;
}

export interface EmojiProps {}

export default class EmojiPickerWithUpload extends React.Component<
  EmojiProps,
  EmojiState
> {
  constructor(props: EmojiProps) {
    super(props);
    this.state = {
      siteEmojiEnabled: true,
    };
  }

  enableSiteEmoji(value: boolean) {
    this.setState({ siteEmojiEnabled: value });
  }

  render() {
    const emojiProvider: Promise<EmojiProvider> =
      this.state.siteEmojiEnabled === true
        ? getEmojiResource({
            uploadSupported: true,
            currentUser: { id: loggedUser },
          })
        : getEmojiResourceWithStandardAndAtlassianEmojis({
            uploadSupported: true,
            currentUser: { id: loggedUser },
          });
    return (
      <div style={{ padding: '10px' }}>
        <Layer
          content={
            <EmojiPicker
              emojiProvider={emojiProvider}
              onSelection={onSelection}
            />
          }
          position="bottom left"
        >
          <input
            id="picker-input"
            style={{
              height: '20px',
              margin: '10px',
            }}
          />
        </Layer>
        <p style={{ width: '400px' }}>
          {lorem}
          {lorem}
        </p>

        <button onClick={() => this.enableSiteEmoji(true)}>
          EmojiProvider with Site emoji
        </button>
        <button onClick={() => this.enableSiteEmoji(false)}>
          EmojiProvider without Site emoji
        </button>
      </div>
    );
  }
}
