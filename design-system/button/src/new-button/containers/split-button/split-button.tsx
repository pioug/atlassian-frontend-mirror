/** @jsx jsx */
import { type ReactNode } from 'react';

import { css, jsx, type SerializedStyles } from '@emotion/react';

import { fontSize as getFontSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { SplitButtonContext } from './split-button-context';
import type {
  SplitButtonAppearance,
  SplitButtonContextAppearance,
  SplitButtonSpacing,
} from './types';
import { getActions } from './utils';

const fontSize: number = getFontSize();

const defaultDividerHeight = 20 / fontSize + 'em';

const defaultDividerStyles = css({
  height: defaultDividerHeight,
  margin: `${token('space.075', '6px')} -0.5px`,
});

const compactDividerHeight = 16 / fontSize + 'em';

const compactDividerStyles = css({
  height: compactDividerHeight,
  margin: `${token('space.050', '4px')} -0.5px`,
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

const navigationDividerStyles = css({
  height: compactDividerHeight,
  margin: `${token('space.100', '8px')} -0.5px`,
  backgroundColor: token('color.border', '#0052cc'),
});

const dividerAppearance: Record<
  SplitButtonContextAppearance,
  SerializedStyles
> = {
  default: css({ backgroundColor: token('color.text', '#172B4D') }),
  primary: css({ backgroundColor: token('color.text.inverse', '#FFF') }),
  danger: css({
    backgroundColor: token('color.text.inverse', '#FFF'),
  }),
  warning: css({
    backgroundColor: token('color.text.warning.inverse', '#172B4D'),
  }),
  navigation: navigationDividerStyles,
};

const dividerHeight: Record<SplitButtonSpacing, SerializedStyles> = {
  default: defaultDividerStyles,
  compact: compactDividerStyles,
};

type DividerProps = {
  appearance: SplitButtonContextAppearance;
  spacing: SplitButtonSpacing;
  isDisabled?: boolean;
};

/**
 * TODO: Add JSDoc
 */
export const Divider = ({
  appearance,
  spacing,
  isDisabled = false,
}: DividerProps) => {
  return (
    // I find it funny to provide a div for Divider
    <div
      css={[
        baseDividerStyles,
        dividerAppearance[appearance],
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

/**
 * TODO: Add JSdoc
 */
export const SplitButtonContainer = ({ children }: { children: ReactNode }) => {
  return <div css={splitButtonStyles}>{children}</div>;
};

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
  const { PrimaryAction, SecondaryAction } = getActions(children);

  return (
    <SplitButtonContainer>
      <SplitButtonContext.Provider
        value={{
          appearance,
          spacing,
          isDisabled,
        }}
      >
        {PrimaryAction}
        <Divider
          appearance={appearance}
          spacing={spacing}
          isDisabled={isDisabled}
        />
        {SecondaryAction}
      </SplitButtonContext.Provider>
    </SplitButtonContainer>
  );
};

type SplitButtonWithSlotsProps = {
  primaryAction: ReactNode;
  secondaryAction: ReactNode;
  appearance?: SplitButtonAppearance;
  spacing?: SplitButtonSpacing;
  isDisabled?: boolean;
  isSelected?: boolean;
};
/**
 * TODO: Decide on API
 */
export const SplitButtonWithSlots = ({
  primaryAction,
  secondaryAction,
  appearance = 'default',
  spacing = 'default',
  isDisabled = false,
}: SplitButtonWithSlotsProps) => {
  return (
    <SplitButtonContainer>
      <SplitButtonContext.Provider
        value={{
          appearance,
          spacing,
          isDisabled,
        }}
      >
        {primaryAction}
        <Divider
          appearance={appearance}
          spacing={spacing}
          isDisabled={isDisabled}
        />
        {secondaryAction}
      </SplitButtonContext.Provider>
    </SplitButtonContainer>
  );
};
