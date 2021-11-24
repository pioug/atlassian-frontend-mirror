import React from 'react';
import { token } from '@atlaskit/tokens';
import EmojiUploadPicker from '../src/components/common/EmojiUploadPicker';
import { emojiPickerWidth } from '../src/util/constants';
import { onUploadEmoji, onUploadCancelled } from '../example-helpers';
import { IntlProvider } from 'react-intl-next';

const defaultStyles = {
  width: emojiPickerWidth,
  border: `1px solid ${token('color.border.neutral', '#ddd')}`,
  margin: '20px',
};

export default function Example() {
  return (
    <IntlProvider locale="en">
      <div style={defaultStyles}>
        <EmojiUploadPicker
          errorMessage="Unable to upload"
          onUploadEmoji={onUploadEmoji}
          onUploadCancelled={onUploadCancelled}
        />
      </div>
    </IntlProvider>
  );
}
