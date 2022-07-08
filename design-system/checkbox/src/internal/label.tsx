/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { N80, N900 } from '@atlaskit/theme/colors';
import { useGlobalTheme } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

import { LabelProps } from '../types';

import { fontFamily } from './constants';
import theme from './theme';

const labelStyles = css({
  display: 'grid',
  gap: '0 4px',
  gridAutoColumns: '1fr',
  gridAutoRows: 'min-content',
  gridTemplateColumns: 'min-content auto',
  color: token('color.text', N900),
  cursor: 'default',
  fontFamily: fontFamily,
});

const disabledStyles = css({
  color: token('color.text.disabled', N80),
  cursor: 'not-allowed',
});

const themeStyles = {
  light: css({
    /**
     * Background
     */
    '--local-background': theme.light.boxColor.rest,
    '--local-background-active': theme.light.boxColor.active,
    '--local-background-checked': theme.light.boxColor.checked,
    '--local-background-checked-hover': theme.light.boxColor.hoveredAndChecked,
    '--local-background-disabled': theme.light.boxColor.disabled,
    '--local-background-hover': theme.light.boxColor.hovered,
    /**
     * Border
     */
    '--local-border': theme.light.borderColor.rest,
    '--local-border-active': theme.light.borderColor.active,
    '--local-border-checked': theme.light.borderColor.checked,
    '--local-border-checked-hover': theme.light.borderColor.hoveredAndChecked,
    '--local-border-checked-invalid': theme.light.borderColor.invalidAndChecked,
    '--local-border-disabled': theme.light.borderColor.disabled,
    '--local-border-focus': theme.light.borderColor.focused,
    '--local-border-hover': theme.light.borderColor.hovered,
    '--local-border-invalid': theme.light.borderColor.invalid,
    /**
     * Tick
     */
    '--local-tick-active': theme.light.tickColor.activeAndChecked,
    '--local-tick-checked': theme.light.tickColor.checked,
    '--local-tick-disabled': theme.light.tickColor.disabledAndChecked,
    '--local-tick-rest': 'transparent',
  }),
  dark: css({
    /**
     * Background
     */
    '--local-background': theme.dark.boxColor.rest,
    '--local-background-active': theme.dark.boxColor.active,
    '--local-background-checked': theme.dark.boxColor.checked,
    '--local-background-checked-hover': theme.dark.boxColor.hoveredAndChecked,
    '--local-background-disabled': theme.dark.boxColor.disabled,
    '--local-background-hover': theme.dark.boxColor.hovered,
    /**
     * Border
     */
    '--local-border': theme.dark.borderColor.rest,
    '--local-border-active': theme.dark.borderColor.active,
    '--local-border-checked': theme.dark.borderColor.checked,
    '--local-border-checked-hover': theme.dark.borderColor.hoveredAndChecked,
    '--local-border-checked-invalid': theme.dark.borderColor.invalidAndChecked,
    '--local-border-disabled': theme.dark.borderColor.disabled,
    '--local-border-focus': theme.dark.borderColor.focused,
    '--local-border-hover': theme.dark.borderColor.hovered,
    '--local-border-invalid': theme.dark.borderColor.invalid,
    /**
     * Tick
     */
    '--local-tick-active': theme.dark.tickColor.activeAndChecked,
    '--local-tick-checked': theme.dark.tickColor.checked,
    '--local-tick-disabled': theme.dark.tickColor.disabledAndChecked,
    '--local-tick-rest': 'transparent',
  }),
};

export default function Label({
  children,
  isDisabled,
  testId,
  onClick,
}: LabelProps) {
  const { mode } = useGlobalTheme();

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <label
      css={[
        labelStyles,
        isDisabled && disabledStyles,
        mode === 'light' && themeStyles.light,
        mode === 'dark' && themeStyles.dark,
      ]}
      data-testid={testId}
      data-disabled={isDisabled || undefined}
      onClick={onClick}
    >
      {children}
    </label>
  );
}
