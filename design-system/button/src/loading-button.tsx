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

const LoadingButton = React.forwardRef(function LoadingButton(
  { isLoading = false, ...rest }: LoadingButtonProps,
  ref: React.Ref<HTMLElement>,
) {
  // Button already has React.memo, so just leaning on that
  return (
    <Button
      {...rest}
      ref={ref}
      overlay={isLoading ? <LoadingSpinner {...rest} /> : null}
    />
  );
});

// Tools including enzyme rely on components having a display name
LoadingButton.displayName = 'LoadingButton';

export default LoadingButton;
