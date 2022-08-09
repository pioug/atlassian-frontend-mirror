import React from 'react';
import { EmojiPicker } from '../src/picker';
import {
  ResourcedEmojiControl,
  getEmojiConfig,
  getRealEmojiResource,
} from '../example-helpers/demo-resource-control';
import { onSelection } from '../example-helpers';
import { emojiPickerHeight } from '../src/util/constants';
import { IntlProvider } from 'react-intl-next';

export default function Example() {
  return (
    <IntlProvider locale="en">
      <ResourcedEmojiControl
        emojiConfig={getEmojiConfig()}
        customEmojiProvider={getRealEmojiResource()}
        children={
          <EmojiPicker
            emojiProvider={getRealEmojiResource()}
            onSelection={onSelection}
          />
        }
        customPadding={emojiPickerHeight}
      />
    </IntlProvider>
  );
}
