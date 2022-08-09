/** @jsx jsx */

import { FC } from 'react';

import { CSSObject, jsx } from '@emotion/core';

import { N500 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { SidebarProps } from '../types';

const defaultStyle: CSSObject = {
  alignItems: 'center',
  boxSizing: 'border-box',
  color: token('color.text.subtle', N500),
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'column',
  height: '100vh',
  paddingBottom: 2 * gridSize(),
  paddingTop: 3 * gridSize(),
  width: 8 * gridSize(),
};

const sidebarCSS = (): CSSObject => defaultStyle;

const Sidebar: FC<SidebarProps> = ({ cssFn, ...props }) => {
  // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage, @repo/internal/react/no-unsafe-spread-props
  return <div css={cssFn(defaultStyle)} {...props} />;
};

export default {
  component: Sidebar,
  cssFn: sidebarCSS,
};
