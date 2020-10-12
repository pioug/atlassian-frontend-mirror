import { Appearance } from '@atlaskit/button/types';
import Button from '@atlaskit/button/custom-theme-button';
import React from 'react';

export type Props = {
  appearance?: Appearance;
  iconBefore?: React.ReactChild;
  isLoading?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  text?: React.ReactNode;
};

export const ShareButton = React.forwardRef<HTMLElement, Props>(
  function ShareButton({ text, ...props }: Props, ref) {
    return (
      <Button ref={ref} aria-expanded={props.isSelected} {...props}>
        {text}
      </Button>
    );
  },
);

ShareButton.displayName = 'ShareButton';

export default ShareButton;
