/* eslint-disable react/react-in-jsx-scope */
/** @jsx jsx */
import { ComponentProps, FocusEvent, KeyboardEvent, MouseEvent } from 'react';

import { css, jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
  GRAB_AREA_LINE_SELECTOR,
  GRAB_AREA_SELECTOR,
} from '../../common/constants';
import { LeftSidebarProps } from '../../common/types';

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
  ref?: React.Ref<HTMLButtonElement>;
} & ComponentProps<'button'>;

/**
 * Determines the color of the grab line.
 *
 * Used on internal leaf node, so naming collisions won't matter.
 */
const varLineColor = '--ds-line';

const grabAreaStyles = css({
  width: 4,
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
});

const grabAreaEnabledStyles = css({
  ':hover': {
    [varLineColor]: token('color.border.selected', B200),
  },
  ':active': {
    borderColor: token('color.border.selected', B200),
    [varLineColor]: token('color.border.selected', B200),
  },
  ':focus-visible': {
    outlineColor: token('color.border.selected', B200),
    outlineStyle: 'solid',
    outlineWidth: token('border.width.outline', '2px'),
    [varLineColor]: token('color.border.selected', B200),
  },
});

const grabAreaCollapsedStyles = css({
  padding: 0,
  backgroundColor: 'transparent',
  border: 0,
  cursor: 'default',
});

const lineStyles = xcss({
  display: 'block',
  width: 'border.width.outline',
  height: '100%',
  backgroundColor: 'color.background.neutral',
  transition: 'background-color 200ms',
});

const grabAreaLineSelector = { [GRAB_AREA_LINE_SELECTOR]: true };
const grabAreaSelector = { [GRAB_AREA_SELECTOR]: true };

const GrabArea = ({
  testId,
  valueTextLabel = 'Width',
  isDisabled,
  isLeftSidebarCollapsed,
  label,
  leftSidebarPercentageExpanded,
  onKeyDown,
  onMouseDown,
  onBlur,
  onFocus,
  ref,
  ...rest
}: GrabAreaProps & Partial<LeftSidebarProps>) => (
  <button
    {...grabAreaSelector}
    aria-label={label}
    data-testid={testId}
    disabled={isDisabled}
    aria-hidden={isLeftSidebarCollapsed}
    type="button"
    // The slider role is applied to a button to utilize the native
    // interactive and disabled functionality on the resize slider. While a
    // range input would be more semantically accurate, it does not affect
    // usability.
    role="slider"
    css={[
      grabAreaStyles,
      isLeftSidebarCollapsed && grabAreaCollapsedStyles,
      !isDisabled && grabAreaEnabledStyles,
    ]}
    aria-orientation="vertical"
    aria-valuenow={leftSidebarPercentageExpanded}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuetext={`${valueTextLabel} ${leftSidebarPercentageExpanded}%`}
    onKeyDown={onKeyDown}
    onMouseDown={onMouseDown}
    onFocus={onFocus}
    onBlur={onBlur}
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    {...rest}
  >
    <Box as="span" xcss={lineStyles} {...grabAreaLineSelector} />
  </button>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default GrabArea;
