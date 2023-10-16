/** @jsx jsx */
import React, { type ReactNode } from 'react';

import { css, jsx, type SerializedStyles } from '@emotion/react';

import { fontSize as getFontSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { ButtonContext } from '../variants/shared/button-context';
import type { Appearance, Spacing } from '../variants/types';

const fontSize: number = getFontSize();

type SplitButtonAppearance = Extract<
  Appearance,
  'default' | 'primary' | 'danger' | 'warning'
>;

type SplitButtonSpacing = Extract<Spacing, 'default' | 'compact'>;

const defaultDividerHeight = 20 / fontSize + 'em';

const defaultDividerStyles = css({
  height: defaultDividerHeight,
  margin: `${token('space.075', '6px')} -0.5px`,
});

const compactDividerHeight = 16 / fontSize + 'em';

const compactDividerStyles = css({
  height: compactDividerHeight,
  margin: `${token('space.075', '4px')} -0.5px`,
});

const baseDividerStyles = css({
  display: 'inline-flex',
  width: '1px',
  position: 'relative',
  zIndex: 2,
});

const disabledStyles = css({
  backgroundColor: token('color.border', '#091E4224'),
  cursor: 'not-allowed',
});

const dividerBackgroundColors: Record<SplitButtonAppearance, SerializedStyles> =
  {
    default: css({ backgroundColor: token('color.text', '#172B4D') }),
    primary: css({ backgroundColor: token('color.text.inverse', '#FFF') }),
    danger: css({
      backgroundColor: token('color.text.inverse', '#FFF'),
    }),
    warning: css({
      backgroundColor: token('color.text.warning.inverse', '#172B4D'),
    }),
  };

const dividerHeight: Record<SplitButtonSpacing, SerializedStyles> = {
  default: defaultDividerStyles,
  compact: compactDividerStyles,
};

type DividerProps = {
  appearance: SplitButtonAppearance;
  spacing: SplitButtonSpacing;
  isDisabled: boolean;
};

/**
 * I find it funny to provide a div for Divider
 */
const Divider = ({ appearance, spacing, isDisabled }: DividerProps) => {
  return (
    <div
      css={[
        baseDividerStyles,
        dividerBackgroundColors[appearance],
        dividerHeight[spacing],
        isDisabled ? disabledStyles : undefined,
      ]}
    />
  );
};

const splitButtonStyles = css({
  display: 'inline-flex',
  position: 'relative',
  whiteSpace: 'nowrap',
});

type SplitButtonProps = {
  /**
   * Only two children are allowed.
   * First child is the primary action, second child is the secondary action.
   * The assumption is that for both children trees there is a button reading the context.
   */
  children: ReactNode;
  appearance?: SplitButtonAppearance;
  spacing?: SplitButtonSpacing;
  isDisabled?: boolean;
};

/**
 * TODO: Add description when adding docs
 */
export const SplitButton = ({
  children,
  appearance = 'default',
  spacing = 'default',
  isDisabled = false,
}: SplitButtonProps) => {
  const [PrimaryAction, SecondaryAction] = React.Children.toArray(children);

  if (
    (process.env.NODE_ENV !== 'production' && !PrimaryAction) ||
    !SecondaryAction
  ) {
    // TODO: i18n?
    throw new SyntaxError('SplitButton requires two children to be provided');
  }

  return (
    <div css={splitButtonStyles}>
      <ButtonContext.Provider
        value={{
          appearance,
          spacing,
          borderVariant: 'split',
          isDisabled,
          isActiveOverSelected: true,
        }}
      >
        {PrimaryAction}
        <Divider
          appearance={appearance}
          spacing={spacing}
          isDisabled={isDisabled}
        />
        {SecondaryAction}
      </ButtonContext.Provider>
    </div>
  );
};

type SplitButtonWithSlotsProps = {
  primaryAction: ReactNode;
  secondaryAction: ReactNode;
  appearance?: SplitButtonAppearance;
  spacing?: SplitButtonSpacing;
  isDisabled?: boolean;
};
/**
 * TODO: Add description when adding docs
 */
export const SplitButtonWithSlots = ({
  primaryAction,
  secondaryAction,
  appearance = 'default',
  spacing = 'default',
  isDisabled = false,
}: SplitButtonWithSlotsProps) => {
  return (
    <div css={splitButtonStyles}>
      <ButtonContext.Provider
        value={{
          appearance,
          spacing,
          borderVariant: 'split',
          isDisabled,
          isActiveOverSelected: true,
        }}
      >
        {primaryAction}
        <Divider
          appearance={appearance}
          spacing={spacing}
          isDisabled={isDisabled}
        />
        {secondaryAction}
      </ButtonContext.Provider>
    </div>
  );
};
