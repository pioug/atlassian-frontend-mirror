import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { emojiPickerWidth } from '../../util/constants';

// Uploader

export const emojiUploadWidget = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'stretch',
  background: token('elevation.surface.overlay', 'white'),
  height: `120px`,
  width: `${emojiPickerWidth}px`,
  marginBottom: token('space.100', '8px'),
  minWidth: `${emojiPickerWidth}px`,
  // eslint-disable-next-line @atlaskit/design-system/use-tokens-space
  margin: '-10px',
  marginTop: token('space.negative.200', '-16px'),
});

/// Footer
export const emojiUploadFooter = css({
  flex: '0 0 auto',
});
