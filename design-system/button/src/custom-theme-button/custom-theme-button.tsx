import React, { useCallback, useState } from 'react';

import { CSSObject } from '@emotion/core';

import GlobalTheme from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';

import ButtonBase from '../shared/button-base';
import getIsOnlySingleIcon from '../shared/get-is-only-single-icon';
import LoadingSpinner from '../shared/loading-spinner';

import {
  InteractionState,
  CustomThemeButtonProps as Props,
} from './custom-theme-button-types';
import Theme, { defaultThemeFn, getSpecifiers } from './theme';

type State = {
  isHover: boolean;
  isActive: boolean;
  isFocus: boolean;
};

function getInteractionState({
  isDisabled = false,
  isActive = false,
  isFocus = false,
  isHover = false,
  isSelected = false,
  isLoading = false,
}: Partial<Props> & State): InteractionState {
  if (isDisabled) {
    return 'disabled';
  }
  if (isSelected && isFocus) {
    return 'focusSelected';
  }
  if (isSelected) {
    return 'selected';
  }
  // not allowing active or focus style changes while loading
  if (!isLoading && isActive) {
    return 'active';
  }
  if (!isLoading && isHover) {
    return 'hover';
  }
  if (isFocus) {
    return 'focus';
  }
  return 'default';
}

const initial: State = { isHover: false, isActive: false, isFocus: false };

const CustomThemeButton = React.memo(
  React.forwardRef<HTMLElement, Props>(function CustomThemeButton(
    {
      // Calculate default props for use in custom themes
      appearance = 'default',
      autoFocus = false,
      isDisabled = false,
      isSelected = false,
      shouldFitContainer = false,
      spacing = 'default',
      isLoading = false,
      onMouseEnter: providedOnMouseEnter,
      onMouseLeave: providedOnMouseLeave,
      onMouseDown: providedOnMouseDown,
      onMouseUp: providedOnMouseUp,
      onFocus: providedOnFocus,
      onBlur: providedOnBlur,
      theme = defaultThemeFn,
      ...rest
    }: Props,
    ref: React.Ref<HTMLElement>,
  ) {
    // TODO is there a nicer way to do this?
    // Add default props back into object for spreading
    const restProps = {
      appearance,
      autoFocus,
      isDisabled,
      isSelected,
      shouldFitContainer,
      spacing,
      ...rest,
    };

    const [state, setState] = useState<State>(initial);

    const onMouseEnter = useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        setState((current) => ({ ...current, isHover: true }));
        if (providedOnMouseEnter) {
          providedOnMouseEnter(event);
        }
      },
      [providedOnMouseEnter],
    );
    const onMouseLeave = useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        setState((current) => ({
          ...current,
          isHover: false,
          isActive: false,
        }));
        if (providedOnMouseLeave) {
          providedOnMouseLeave(event);
        }
      },
      [providedOnMouseLeave],
    );
    const onMouseDown = useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        setState((current) => ({ ...current, isActive: true }));
        if (providedOnMouseDown) {
          providedOnMouseDown(event);
        }
      },
      [providedOnMouseDown],
    );
    const onMouseUp = useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        setState((current) => ({ ...current, isActive: false }));
        if (providedOnMouseUp) {
          providedOnMouseUp(event);
        }
      },
      [providedOnMouseUp],
    );
    const onFocus = useCallback(
      (event: React.FocusEvent<HTMLElement>) => {
        setState((current) => ({ ...current, isFocus: true }));
        if (providedOnFocus) {
          providedOnFocus(event);
        }
      },
      [providedOnFocus],
    );
    const onBlur = useCallback(
      (event: React.FocusEvent<HTMLElement>) => {
        setState((current) => ({ ...current, isFocus: false }));
        if (providedOnBlur) {
          providedOnBlur(event);
        }
      },
      [providedOnBlur],
    );

    return (
      <Theme.Provider value={theme}>
        <GlobalTheme.Consumer>
          {({ mode }: { mode: ThemeModes }) => (
            <Theme.Consumer
              mode={mode}
              state={getInteractionState({
                ...state,
                isLoading,
                isSelected: restProps.isSelected,
                isDisabled: restProps.isDisabled,
              })}
              iconIsOnlyChild={getIsOnlySingleIcon(restProps)}
              isLoading={isLoading}
              {...restProps}
            >
              {({
                buttonStyles,
              }: {
                buttonStyles: CSSObject;
                // No longer supporting spinnerStyles
                // spinnerStyles: CSSObject;
              }) => (
                <ButtonBase
                  {...restProps}
                  ref={ref}
                  overlay={isLoading ? <LoadingSpinner {...restProps} /> : null}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  onMouseDown={onMouseDown}
                  onMouseUp={onMouseUp}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  buttonCss={getSpecifiers(buttonStyles)}
                />
              )}
            </Theme.Consumer>
          )}
        </GlobalTheme.Consumer>
      </Theme.Provider>
    );
  }),
);

// Tools including enzyme rely on components having a display name
CustomThemeButton.displayName = 'CustomThemeButton';

export default CustomThemeButton;
