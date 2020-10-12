import Layer from '@atlaskit/layer';
import React from 'react';
import { getUsageClearEmojiResource } from '../example-helpers';
import {
  UsageShowAndClearComponent,
  UsagingShowingProps,
} from '../example-helpers/demo-emoji-usage-components';
import { EmojiProvider } from '../src/resource';
import { EmojiPicker } from '../src/picker';

class UsageShowingEmojiPickerTextInput extends UsageShowAndClearComponent {
  constructor(props: UsagingShowingProps) {
    super(props);
  }

  getWrappedComponent() {
    const { emojiResource } = this.props;
    return (
      <Layer
        content={
          <EmojiPicker
            onSelection={this.onSelection}
            emojiProvider={Promise.resolve(emojiResource as EmojiProvider)}
          />
        }
        position="bottom left"
      >
        <input
          id="picker-input"
          style={{
            height: '20px',
            marginBottom: '320px',
          }}
        />
      </Layer>
    );
  }
}

export default function Example() {
  return (
    <UsageShowingEmojiPickerTextInput
      emojiResource={getUsageClearEmojiResource()}
    />
  );
}
