import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import {
  visuallyHiddenRadioStyles,
  selectedShadow,
  focusedShadow,
  avatarImageStyles,
} from '../styles';

export const largeAvatarImageStyles = css(avatarImageStyles, {
  width: '72px',
  height: '72px',
});

export const predefinedAvatarViewWrapperStyles = css({
  '.body': {
    display: 'flex',
    flexFlow: 'row wrap',
    width: '353px',
    maxHeight: '294px',
    overflowY: 'auto',
    padding: `${token('space.100', '8px')} 0 0`,
    margin: 0,
  },
  input: visuallyHiddenRadioStyles,
  'input:checked + img': selectedShadow,
  'input:focus + img': focusedShadow,
  label: {
    paddingRight: token('space.050', '4px'),
    paddingLeft: token('space.050', '4px'),
    paddingBottom: token('space.100', '8px'),
    display: 'inline-flex',
  },
  '.header': {
    display: 'flex',
    alignItems: 'center',
    paddingTop: token('space.050', '4px'),
    paddingBottom: token('space.100', '8px'),
    '.description': {
      paddingLeft: token('space.100', '8px'),
      margin: 0,
      fontSize: '14px',
      fontWeight: 400,
    },
    '.back-button': {
      width: '32px',
      height: '32px',
      borderRadius: token('border.radius.400', '16px'),
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: 0,
    },
  },
});
