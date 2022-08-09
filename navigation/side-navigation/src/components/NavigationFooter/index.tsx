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

/**
 * __Navigation footer__
 *
 * Allows for customisation of the footer.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const NavigationFooter = ({ children }: NavigationFooterProps) => {
  return <div css={footerCSS}>{children}</div>;
};

export default NavigationFooter;
