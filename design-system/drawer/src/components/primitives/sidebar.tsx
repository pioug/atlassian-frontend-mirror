/** @jsx jsx */

import { CSSObject, jsx } from '@emotion/core';

import { N500 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import { SidebarProps } from '../types';

const defaultStyle = {
  alignItems: 'center',
  boxSizing: 'border-box',
  color: N500,
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'column',
  height: '100vh',
  paddingBottom: 2 * gridSize(),
  paddingTop: 3 * gridSize(),
  width: 8 * gridSize(),
};

const sidebarCSS = (): CSSObject => defaultStyle as CSSObject;

const Sidebar = ({ cssFn, ...props }: SidebarProps) => {
  return <div css={cssFn(defaultStyle as CSSObject)} {...props} />;
};

export default {
  component: Sidebar,
  cssFn: sidebarCSS,
};
