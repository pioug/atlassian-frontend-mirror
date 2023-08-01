import React from 'react';

import Button from './button';
import LoadingSpinner from './shared/loading-spinner';
import { BaseProps } from './types';

export type LoadingButtonOwnProps = {
  /* Conditionally show a spinner over the top of a button */
  isLoading?: boolean;
};

export type LoadingButtonProps = Omit<BaseProps, 'overlay'> &
  LoadingButtonOwnProps;

/**
 * __Loading button__
 *
 * A small wrapper around Button that allows you to show an @atlaskit/spinner as an overlay on the button when you set an isLoading prop to true.
 *
 * - [Examples](https://atlassian.design/components/button/examples#loading-button)
 */
const LoadingButton = React.forwardRef(function LoadingButton(
  {
    appearance,
    isDisabled,
    isSelected,
    isLoading = false,
    spacing,
    ...rest
  }: LoadingButtonProps,
  ref: React.Ref<HTMLElement>,
) {
  // Button already has React.memo, so just leaning on that
  return (
    <Button
      {...rest}
      ref={ref}
      appearance={appearance}
      aria-busy={isLoading}
      isDisabled={isDisabled}
      isSelected={isSelected}
      overlay={
        isLoading ? (
          <LoadingSpinner
            spacing={spacing}
            appearance={appearance}
            isDisabled={isDisabled}
            isSelected={isSelected}
          />
        ) : null
      }
      spacing={spacing}
    />
  );
});

// Tools including enzyme rely on components having a display name
LoadingButton.displayName = 'LoadingButton';

export default LoadingButton;
