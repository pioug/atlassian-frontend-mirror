/** @jsx jsx */
import { ReactNode } from 'react';

import { jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

export interface NavigationFooterProps {
  children: ReactNode;
}

const footerCSS = {
  position: 'relative',
  padding: gridSize(),
  paddingBottom: gridSize() * 1.75,
} as const;

const NavigationFooter = ({ children }: NavigationFooterProps) => {
  return <div css={footerCSS}>{children}</div>;
};

export default NavigationFooter;
