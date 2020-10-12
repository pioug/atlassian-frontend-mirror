import React from 'react';
import EmojiUploadPicker from '../src/components/common/EmojiUploadPicker';
import { emojiPickerWidth } from '../src/util/constants';
import { onUploadEmoji, onUploadCancelled } from '../example-helpers';

const defaultStyles = {
  width: emojiPickerWidth,
  border: '1px solid #ccc',
  margin: '20px',
};

export default function Example() {
  return (
    <div style={defaultStyles}>
      <EmojiUploadPicker
        errorMessage="Unable to upload"
        onUploadEmoji={onUploadEmoji}
        onUploadCancelled={onUploadCancelled}
      />
    </div>
  );
}
