import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import {
  visuallyHiddenRadioStyles,
  selectedShadow,
  focusedShadow,
} from '../styles';
import { avatarImageStyles } from '../styles';

export const largeAvatarImageStyles = css`
  ${avatarImageStyles}
  width: calc(${token('space.100', '8px')} * 9);
  height: calc(${token('space.100', '8px')} * 9);
`;

export const predefinedAvatarViewWrapperStyles = css`
  .body {
    display: flex;
    flex-flow: row wrap;
    width: 353px;
    max-height: 294px;
    overflow-y: auto;

    padding: ${token('space.100', '8px')} 0 0;
    margin: 0;
  }

  input {
    ${visuallyHiddenRadioStyles}
  }

  input:checked + img {
    ${selectedShadow}
  }

  input:focus + img {
    ${focusedShadow}
  }

  label {
    padding-right: ${token('space.050', '4px')};
    padding-left: ${token('space.050', '4px')};
    padding-bottom: ${token('space.100', '8px')};
    display: inline-flex;
  }

  .header {
    display: flex;
    align-items: center;

    padding-top: ${token('space.050', '4px')};
    padding-bottom: ${token('space.100', '8px')};

    .description {
      padding-left: ${token('space.100', '8px')};
    }

    .back-button {
      width: 32px;
      height: 32px;
      border-radius: ${token('border.radius.400', '16px')};

      align-items: center;
      justify-content: center;

      margin: 0;
      padding: 0;
    }
  }
`;
