/** @jsx jsx */
import { ComponentProps } from 'react';

import { jsx } from '@emotion/core';

import {
  GRAB_AREA_LINE_SELECTOR,
  GRAB_AREA_SELECTOR,
} from '../../common/constants';

import { grabAreaCSS, lineCSS } from './styles';

export type GrabAreaProps = {
  testId?: string;
  isLeftSidebarCollapsed: boolean;
} & ComponentProps<'button'>;

const grabAreaLineSelector = { [GRAB_AREA_LINE_SELECTOR]: true };
const grabAreaSelector = { [GRAB_AREA_SELECTOR]: true };
// TODO: Consider allowing this to be controlled using arrow keys
const GrabArea = ({
  testId,
  isLeftSidebarCollapsed,
  ...rest
}: GrabAreaProps) => (
  <button
    {...grabAreaSelector}
    data-testid={testId}
    type="button"
    css={grabAreaCSS(isLeftSidebarCollapsed)}
    {...rest}
  >
    <span css={lineCSS(isLeftSidebarCollapsed)} {...grabAreaLineSelector} />
  </button>
);

export default GrabArea;
