import React, { useCallback, useMemo, useState } from 'react';

import { CSSObject } from '@emotion/core';

import GlobalTheme from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';

import ButtonBase from './shared/button-base';
import { getCss } from './shared/css';
import getIsOnlySingleIcon from './shared/get-is-only-single-icon';
import { Appearance, BaseProps, Spacing } from './types';

function noop() {}

const isFirefox: boolean =
  typeof navigator !== 'undefined' &&
  navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

export type ButtonProps = BaseProps;

type InnerProps = ButtonProps & {
  mode: ThemeModes;
};

const ButtonWithMode = React.forwardRef(function ButtonWithMode(
  {
    mode,
    onMouseDown: providedOnMouseDown = noop,
    onMouseUp: providedOnMouseUp = noop,
    ...rest
  }: InnerProps,
  ref: React.Ref<HTMLElement>,
) {
  const appearance: Appearance = rest.appearance || 'default';
  const spacing: Spacing = rest.spacing || 'default';
  const shouldFitContainer: boolean = Boolean(rest.shouldFitContainer);
  const isSelected: boolean = Boolean(rest.isSelected);
  const isOnlySingleIcon: boolean = getIsOnlySingleIcon(rest);

  const [isActive, setIsActive] = useState<boolean>(false);

  // Wrap onMouseDown / onMouseUp to manually trigger active state
  //  in Firefox
  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      providedOnMouseDown(event);
      if (isFirefox) {
        setIsActive(true);
      }
    },
    [providedOnMouseDown, setIsActive],
  );

  const onMouseUp = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      providedOnMouseUp(event);
      if (isFirefox) {
        setIsActive(false);
      }
    },
    [providedOnMouseUp, setIsActive],
  );

  const buttonCss: CSSObject = useMemo(
    () =>
      getCss({
        appearance,
        spacing,
        mode,
        isSelected,
        shouldFitContainer,
        isOnlySingleIcon,
      }),
    [
      appearance,
      spacing,
      mode,
      isSelected,
      shouldFitContainer,
      isOnlySingleIcon,
    ],
  );

  return (
    <ButtonBase
      {...rest}
      ref={ref}
      buttonCss={buttonCss}
      // Due to how click events are set, we need to set active styles
      //  manually in Firefox and wrap onMouseDown/onMouseUp
      data-firefox-is-active={isActive ? true : undefined}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    />
  );
});

const Button = React.memo(
  React.forwardRef(function Button(
    props: ButtonProps,
    ref: React.Ref<HTMLElement>,
  ) {
    return (
      <GlobalTheme.Consumer>
        {({ mode }: { mode: ThemeModes }) => {
          return <ButtonWithMode {...props} ref={ref} mode={mode} />;
        }}
      </GlobalTheme.Consumer>
    );
  }),
);

// Tools including enzyme rely on components having a display name
Button.displayName = 'Button';

export default Button;
