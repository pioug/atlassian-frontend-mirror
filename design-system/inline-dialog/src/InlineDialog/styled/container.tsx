/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/** @jsx jsx */
import React, { forwardRef } from 'react';

import { css, jsx } from '@emotion/core';

import {
  DN50,
  DN50A,
  DN600,
  DN60A,
  N0,
  N50A,
  N60A,
  N900,
} from '@atlaskit/theme/colors';
import { themed, useGlobalTheme } from '@atlaskit/theme/components';
import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
  layers,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const themedBackground = themed({
  light: token('color.background.overlay', N0),
  dark: token('color.background.overlay', DN50),
});

const themedColor = themed({
  light: token('color.text.highEmphasis', N900),
  dark: token('color.text.highEmphasis', DN600),
});

const themedBoxShadow = themed({
  light: token('shadow.overlay', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`),
  dark: token('shadow.overlay', `0 4px 8px -2px ${DN50A}, 0 0 1px ${DN60A}`),
});

const borderRadius = getBorderRadius();
const gridSize = getGridSize();

const CSS_THEME_BACKGROUND = '--theme-background';
const CSS_THEME_COLOR = '--theme-color';
const CSS_THEME_BOX_SHADOW = '--theme-box-shadow';

const containerStyles = css({
  boxSizing: 'content-box',
  maxWidth: `${gridSize * 56}px`,
  maxHeight: `${gridSize * 56}px`,
  padding: `${gridSize * 2}px ${gridSize * 3}px;`,
  zIndex: layers.dialog(),
  background: `var(${CSS_THEME_BACKGROUND})`,
  borderRadius: `${borderRadius}px`,
  boxShadow: `var(${CSS_THEME_BOX_SHADOW})`,
  color: `var(${CSS_THEME_COLOR})`,
  '&:focus': {
    outline: 'none',
  },
});

interface ContainerProps {
  children: React.ReactNode;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  style: React.CSSProperties;
  testId?: string;
}

/**
 * __Container__
 *
 * A container is used as a styled wrapper around the contents of an inline dialog.
 * Note that the styles here are merged with the style prop that comes from the popper.js library.
 *
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, onBlur, onClick, onFocus, style, testId }, ref) => {
    const theme = useGlobalTheme();
    return (
      <div
        css={containerStyles}
        data-testid={testId}
        onBlur={onBlur}
        onClick={onClick}
        onFocus={onFocus}
        ref={ref}
        style={
          ({
            [CSS_THEME_BACKGROUND]: themedBackground(theme),
            [CSS_THEME_COLOR]: themedColor(theme),
            [CSS_THEME_BOX_SHADOW]: themedBoxShadow(theme),
            ...style,
          } as unknown) as React.CSSProperties
        }
      >
        {children}
      </div>
    );
  },
);
