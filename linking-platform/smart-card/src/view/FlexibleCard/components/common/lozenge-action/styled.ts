import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

export const triggerButtonStyles = css`
  all: unset;
  background-color: transparent;
  color: unset;
  cursor: pointer;
  font-family: unset;
  font-size: unset;
  font-style: unset;
  font-weight: unset;
  font-variant: unset;
  line-height: 0;
  padding: 0;
  text-transform: unset;

  border: 2px solid transparent;
  margin: -2px;

  &:focus-visible,
  &:focus-within,
  &[aria-expanded='true'] {
    outline: none;
    box-shadow: 0 0 0 2px ${token('color.border.focused', '#388BFF')};
    border-radius: 5px;
  }
`;

export const triggerLozengeStyles = css`
  align-items: center;
  display: flex;

  span[role='img'] {
    margin: -4px -8px -4px -1px;
  }
`;

export const dropdownItemGroupStyles = css`
  button {
    padding: 6px 12px;
    min-height: 28px;
    width: 220px;

    &:hover {
      background-color: inherit;
    }

    &:focus,
    &:focus-visible {
      background-color: ${token(
        'color.background.neutral.subtle.hovered',
        '#091E420F',
      )};
      box-sizing: border-box;
      box-shadow: inset 2px 0 0 ${token('color.border.selected', '#0C66E4')};
      outline: none;
    }
  }
`;
