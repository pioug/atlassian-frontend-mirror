import { style } from 'typestyle';

import { emojiPickerWidth } from '../../util/constants';

// Uploader

export const emojiUploadWidget = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'stretch',
  background: 'white',
  height: `120px`,
  width: `${emojiPickerWidth}px`,
  marginBottom: '8px',
  minWidth: `${emojiPickerWidth}px`,
  margin: '-10px',
  marginTop: '-16px',
});

/// Footer
export const emojiUploadFooter = style({
  flex: '0 0 auto',
});
