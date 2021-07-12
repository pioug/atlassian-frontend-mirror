/** @jsx jsx */

import styled from 'styled-components';
import * as colors from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

export const HelpContentButtonContainer = styled.a`
  display: block;
  cursor: pointer;
  width: calc(100% - ${gridSize() * 2}px);
  color: ${colors.N600};
  padding: ${gridSize}px;
  border-radius: 3px;

  &:hover,
  &:focus,
  &:visited,
  &:active {
    text-decoration: none;
    outline: none;
    outline-offset: none;
    color: ${colors.N600};
  }

  &:focus {
    box-shadow: ${colors.B100} 0 0 0 2px inset;
  }

  &:hover {
    background-color: ${colors.N30};
  }

  &:active {
    background-color: ${colors.B50};
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
