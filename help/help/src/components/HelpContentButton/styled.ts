/** @jsx jsx */

import styled from 'styled-components';
import * as colors from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const HelpContentButtonContainer = styled.a`
  display: block;
  cursor: pointer;
  width: calc(100% - ${gridSize() * 2}px);
  color: ${token('color.text.subtle', colors.N600)};
  padding: ${gridSize}px;
  border-radius: 3px;

  &:hover,
  &:focus,
  &:visited,
  &:active {
    text-decoration: none;
    outline: none;
    outline-offset: none;
    color: ${token('color.text.subtle', colors.N600)};
  }

  &:focus {
    box-shadow: ${token('color.border.focused', colors.B100)} 0 0 0 2px inset;
  }

  &:hover {
    background-color: ${token(
      'color.background.neutral.subtle.hovered',
      colors.N30,
    )};
  }

  &:active {
    background-color: ${token(
      'color.background.neutral.subtle.pressed',
      colors.B50,
    )};
  }
`;

export const HelpContentButtonIcon = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  position: relative;

  & span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const HelpContentButtonText = styled.div`
  width: calc(100% - 20px);
  display: inline-block;
  vertical-align: middle;
  padding: 0 ${gridSize}px;
  box-sizing: border-box;
`;

export const HelpContentButtonExternalLinkIcon = styled.div`
  display: inline-block;
  vertical-align: middle;
  padding-left: ${gridSize() / 2}px;
`;

export const HelpContentButtonExternalNotificationIcon = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-top: -${gridSize() / 2}px;
  padding-left: ${gridSize() / 2}px;
`;
