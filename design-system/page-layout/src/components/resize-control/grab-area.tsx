/** @jsx jsx */
import { ComponentProps, FocusEvent, KeyboardEvent, MouseEvent } from 'react';

import { css, jsx } from '@emotion/react';

import { B100, B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
  GRAB_AREA_LINE_SELECTOR,
  GRAB_AREA_SELECTOR,
} from '../../common/constants';

export type GrabAreaProps = {
  isDisabled: boolean;
  isLeftSidebarCollapsed: boolean;
  label: string;
  leftSidebarPercentageExpanded: number;
  onBlur: (event: FocusEvent) => void;
  onFocus: (event: FocusEvent) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onMouseDown: (event: MouseEvent<HTMLButtonElement>) => void;
  testId?: string;
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

const GrabArea = ({
  testId,
  isDisabled,
  isLeftSidebarCollapsed,
  label,
  leftSidebarPercentageExpanded,
  onKeyDown,
  onMouseDown,
  onBlur,
  onFocus,
  ...rest
}: GrabAreaProps) => (
  <button
    {...grabAreaSelector}
    aria-label={label}
    data-testid={testId}
    disabled={isDisabled}
    type="button"
    // The separator role is applied to a button to utilize the native
    // interactive and disabled functionality on the resize separator. While a
    // range input would be more semantically accurate, it does not affect
    // usability.
    role="separator"
    css={[grabAreaStyles, isLeftSidebarCollapsed && grabAreaCollapsedStyles]}
    aria-orientation="vertical"
    aria-valuenow={leftSidebarPercentageExpanded}
    aria-valuemin={0}
    aria-valuemax={100}
    onKeyDown={onKeyDown}
    onMouseDown={onMouseDown}
    onFocus={onFocus}
    onBlur={onBlur}
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    {...rest}
  >
    <span css={lineStyles} {...grabAreaLineSelector} />
  </button>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default GrabArea;
