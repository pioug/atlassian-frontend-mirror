import styled from 'styled-components';
import { borderRadius } from '@atlaskit/theme/constants';
import { themed } from '@atlaskit/theme/components';
import { R300, R200, N500, R500 } from '@atlaskit/theme/colors';
import { buttonWidthUnitless, focusRingColor } from '../constants';

// NOTE:
// "-moz-focus-inner" removes some inbuilt padding that Firefox adds (taken from reduced-ui-pack)
// the focus ring is red unless combined with hover, then uses default blue
export const Button = styled.button<{ isRounded: boolean }>`
  align-items: center;
  align-self: center;
  appearance: none;
  background: none;
  border: none;
  border-radius: ${({ isRounded }) =>
    isRounded ? `${buttonWidthUnitless / 2}px` : `${borderRadius()}px`};
  color: ${N500};
  display: flex;
  justify-content: center;
  height: 16px;
  margin: 0;
  padding: 0;
  cursor: pointer;

  &::-moz-focus-inner {
    border: 0;
    margin: 0;
    padding: 0;
  }

  &:focus {
    box-shadow: 0 0 0 2px ${focusRingColor};
    outline: none;
  }

  &:hover {
    box-shadow: 0 0 0 2px ${themed({ light: R300, dark: R200 })};
    color: ${R500};
  }
`;
