/** @jsx jsx */
import { HTMLAttributes } from 'react';

import { jsx } from '@emotion/core';

import { GRAB_AREA_LINE_SELECTOR } from '../../common/constants';

import { grabAreaCSS, lineCSS } from './styles';

export type GrabAreaProps = {
  testId?: string;
  isLeftSidebarCollapsed: boolean;
} & HTMLAttributes<HTMLDivElement>;

const cssSelector = { [GRAB_AREA_LINE_SELECTOR]: true };
// TODO: Consider allowing this to be controlled using arrow keys
const GrabArea = ({
  testId,
  isLeftSidebarCollapsed,
  ...rest
}: GrabAreaProps) => (
  <div
    data-grab-area
    data-testid={testId}
    css={grabAreaCSS(isLeftSidebarCollapsed)}
    {...rest}
  >
    <div css={lineCSS(isLeftSidebarCollapsed)} {...cssSelector} />
  </div>
);

export default GrabArea;
