/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { gridSize } from '@atlaskit/theme/constants';

export interface NavigationFooterProps {
  children: ReactNode;
}

const footerStyles = css({
  padding: gridSize(),
  paddingBottom: gridSize() * 1.75,
  position: 'relative',
});

/**
 * __Navigation footer__
 *
 * Allows for customisation of the footer.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#header-and-footer)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const NavigationFooter = ({ children }: NavigationFooterProps) => {
  return <div css={footerStyles}>{children}</div>;
};

export default NavigationFooter;
