import { css } from '@emotion/core';

import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';

import { getNavItemColors, getNavLineColor } from './colors';

const borderRadius = getBorderRadius();
const gridSize = getGridSize();

/*
  NOTE min-height attribute
  FF http://stackoverflow.com/questions/28636832/firefox-overflow-y-not-working-with-nested-flexbox
*/

export const tabStyles = css`
  display: flex;
  flex-basis: 100%;
  flex-direction: column;
  flex-grow: 1;
  max-width: 100%;
  min-height: 0%; /* See min-height note */
`;

export const tabPaneStyles = css`
  flex-grow: 1;
  min-height: 0%; /* See min-height note */
  padding-left: ${gridSize}px;
  padding-right: ${gridSize}px;
  display: none;
  &[data-selected] {
    display: flex;
  }
`;

export const navWrapperStyles = css`
  position: relative;
`;

export const navStyles = css`
  display: flex;
  font-weight: 500;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const underlineHeight = '2px';

export const getNavLineStyles = (mode: ThemeModes) => {
  const colors = getNavLineColor(mode);
  return css`
    background-color: ${colors.lineColor};
    border-radius: ${underlineHeight};
    bottom: 0;
    content: '';
    height: ${underlineHeight};
    left: ${gridSize}px;
    margin: 0;
    position: absolute;
    right: ${gridSize}px;
    width: inherit;
    &[data-selected] {
      background-color: ${colors.selectedColor};
    }
  `;
};

export const getNavItemStyles = (mode: ThemeModes) => {
  const colors = getNavItemColors(mode);
  return css`
    color: ${colors.labelColor};
    cursor: pointer;
    line-height: 1.8;
    margin: 0;
    padding: ${gridSize / 2}px ${gridSize}px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      color: ${colors.hoverLabelColor};
    }
    &:active,
    &:active::before {
      color: ${colors.activeLabelColor};
    }

    &:focus {
      border-radius: ${borderRadius}px;
      /*
        You can only focus on the selected tab
        so use the selected color
       */
      box-shadow: 0 0 0 2px ${colors.selectedColor} inset;
      outline: none;
    }

    /* If selected then don't use any of these styles */
    &&[data-selected] {
      color: ${colors.selectedColor};
    }
  `;
};
