/** @jsx jsx */
import { type ReactNode } from 'react';

import { css, jsx, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { heights } from '../../variants/shared/xcss';

import { SplitButtonContext } from './split-button-context';
import type {
  SplitButtonAppearance,
  SplitButtonContextAppearance,
  SplitButtonSpacing,
} from './types';
import { getActions } from './utils';

const baseDividerStyles = css({
  display: 'inline-flex',
  width: '1px',
  position: 'relative',
  zIndex: 2,
});

const defaultDividerStyles = css({
  height: heights.default,
});

const compactDividerStyles = css({
  height: heights.compact,
});

const dividerDisabledStyles = css({
  backgroundColor: token('color.text.disabled', '#091E4224'),
  cursor: 'not-allowed',
});

const navigationDividerStyles = css({
  height: '16px',
  margin: `${token('space.100', '8px')} -0.5px`,
  backgroundColor: token('color.text.subtle', '#0052cc'),
  opacity: 0.62,
});

const dividerAppearance: Record<
  SplitButtonContextAppearance,
  SerializedStyles
> = {
  default: css({
    backgroundColor: token('color.text', '#172B4D'),
    opacity: 0.51,
  }),
  primary: css({
    backgroundColor: token('color.text.inverse', '#FFF'),
    opacity: 0.64,
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
        dividerHeight[spacing],
        dividerAppearance[appearance],
        isDisabled ? dividerDisabledStyles : undefined,
      ]}
    />
  );
};

const splitButtonStyles = css({
  display: 'inline-flex',
  position: 'relative',
  alignItems: 'center',
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
 * __Split Button__
 *
 * @private __UNSAFE__ SplitButton is not yet safe for production use.
 *
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
