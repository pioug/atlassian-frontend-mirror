/** @jsx jsx */
import { ComponentProps } from 'react';

import { css, jsx } from '@emotion/core';

import { B100, B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
  GRAB_AREA_LINE_SELECTOR,
  GRAB_AREA_SELECTOR,
} from '../../common/constants';

export type GrabAreaProps = {
  testId?: string;
  isLeftSidebarCollapsed: boolean;
} & ComponentProps<'button'>;

/**
 * Determines the color of the grab line.
 *
 * Used on internal leaf node, so naming collisions won't matter.
 */
const varLineColor = '--ds-line';

const grabAreaStyles = css({
  width: 24,
  height: '100%',
  padding: 0,
  backgroundColor: 'transparent',
  border: 0,
  cursor: 'ew-resize',
  '&::-moz-focus-inner': {
    border: 0,
  },
  ':focus': {
    outline: 0,
  },
  ':enabled': {
    ':hover': {
      [varLineColor]: token('color.border.selected', B100),
    },
    ':active, :focus': {
      [varLineColor]: token('color.border.selected', B200),
    },
  },
});

const grabAreaCollapsedStyles = css({
  padding: 0,
  backgroundColor: 'transparent',
  border: 0,
  cursor: 'default',
});

const lineStyles = css({
  display: 'block',
  width: 2,
  height: '100%',
  backgroundColor: `var(${varLineColor})`,
  transition: 'background-color 200ms',
});

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
    css={[grabAreaStyles, isLeftSidebarCollapsed && grabAreaCollapsedStyles]}
    {...rest}
  >
    <span css={lineStyles} {...grabAreaLineSelector} />
  </button>
);

export default GrabArea;
