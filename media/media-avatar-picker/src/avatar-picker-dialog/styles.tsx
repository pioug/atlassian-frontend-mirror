import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

export const avatarPickerErrorStyles = css({
  margin: `0 ${token('space.200', '16px')} ${token('space.200', '16px')}`,
});

export const formStyles = css({
  margin: 0,
});

export const avatarPickerViewWrapperStyles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  textAlign: 'center',
  minHeight: '339px',
});

export const modalHeaderStyles = css({
  // Using `&` twice to increase specificity
  '&&': {
    margin: token('space.200', '16px'),
    fontWeight: 500,
    fontSize: '20px',
  },
});
